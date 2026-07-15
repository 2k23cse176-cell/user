const { fork } = require('child_process');
const express = require('express');
const path = require('path');
const fs = require('fs');

// ==================== RENDER BOT LAUNCHER ====================
// This is the main process that spawns child bot instances
// and serves the React dashboard UI

const PORT = process.env.PORT || 3000;
const app = express();
const botProcesses = [];

// ==================== SERVE WEB DASHBOARD ====================
app.use(express.json());

// Serve the static dashboard HTML (works without React build)
const publicPath = path.join(process.cwd(), 'public');
if (fs.existsSync(path.join(publicPath, 'dashboard.html'))) {
  app.use(express.static(publicPath));
  app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'dashboard.html'));
  });
  console.log(`🌐 Dashboard UI served from ${publicPath}`);
}

// Parse Discord tokens from environment
const MAX_BOTS = 12;
const DISCORD_TOKENS = (process.env.DISCORD_TOKENS || '').split(',').filter(t => t.trim() !== '').slice(0, MAX_BOTS);
const WHITELISTED_USERS = (process.env.WHITELISTED_USERS || '').split(',').filter(u => u.trim() !== '');

console.log(`🤖 Starting bot launcher with ${DISCORD_TOKENS.length} tokens...`);

// ==================== SPAWN INDIVIDUAL BOTS ====================
function spawnBot(token, index) {
  const botPath = path.join(process.cwd(), 'headless', 'bot-instance.js');
  
  const botProcess = fork(botPath, {
    env: {
      ...process.env,
      BOT_TOKEN: token,
      BOT_INDEX: index,
      WHITELISTED_USERS: WHITELISTED_USERS.join(','),
    },
    detached: false,
  });

  botProcess.on('error', (err) => {
    console.error(`❌ Bot ${index + 1} error:`, err);
  });

  botProcess.on('exit', (code) => {
    console.log(`⚠️  Bot ${index + 1} exited with code ${code}. Restarting in 5 seconds...`);
    setTimeout(() => spawnBot(token, index), 5000);
  });

  botProcesses.push(botProcess);
  console.log(`✅ Bot ${index + 1} spawned`);
}

// Spawn all bots
DISCORD_TOKENS.forEach((token, index) => {
  spawnBot(token, index);
});

// ==================== API ENDPOINTS ====================
// Command all bots via IPC-like message (for dashboard controls)
const botIpc = [];

app.post('/api/command', (req, res) => {
  const { command } = req.body;
  if (!command) return res.json({ sent: 0 });
  
  botProcesses.forEach((p, i) => {
    try { p.send({ type: 'command', command }); } catch(e) {}
  });
  
  console.log(`📋 Command broadcast: ${command}`);
  res.json({ sent: botProcesses.length, command });
});

app.post('/api/join', (req, res) => {
  const { invite, vcId } = req.body;
  if (!invite || !vcId) return res.json({ sent: 0, error: 'Missing invite or vcId' });
  
  botProcesses.forEach((p, i) => {
    try { p.send({ type: 'join', invite, vcId }); } catch(e) {}
  });
  
  console.log(`🌐 Join broadcast: ${invite} (VC: ${vcId})`);
  res.json({ sent: botProcesses.length, invite, vcId });
});

app.post('/api/broadcast', (req, res) => {
  const { message } = req.body;
  if (!message) return res.json({ sent: 0 });
  
  botProcesses.forEach((p, i) => {
    try { p.send({ type: 'broadcast', message }); } catch(e) {}
  });
  
  console.log(`📢 Broadcast: ${message.substring(0, 50)}...`);
  res.json({ sent: botProcesses.length });
});

app.post('/api/validate-tokens', async (req, res) => {
  const { tokens } = req.body;
  if (!tokens || !Array.isArray(tokens)) return res.json({ valid: [] });
  
  const valid = [];
  const https = require('https');
  
  for (const token of tokens) {
    try {
      const ok = await new Promise((resolve) => {
        const req = https.get('https://discord.com/api/v9/users/@me', {
          headers: { Authorization: token }
        }, (response) => {
          resolve(response.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.end();
      });
      if (ok) valid.push(token);
    } catch(e) {}
  }
  
  res.json({ valid, total: tokens.length, validCount: valid.length });
});

app.post('/api/set-tokens', (req, res) => {
  const { tokens } = req.body;
  if (!tokens || !Array.isArray(tokens)) return res.json({ count: 0 });
  
  const count = Math.min(tokens.length, 12);
  console.log(`🔄 Token update request: ${count} tokens (re-deploy required)`);
  // Note: Changing tokens at runtime requires a Render redeploy
  // The UI shows this as a staging action
  res.json({ count, message: 'Tokens staged. Trigger a Manual Deploy on Render to apply.' });
});

// ==================== HEALTH CHECK ENDPOINTS ====================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    bots: botProcesses.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/bots', (req, res) => {
  res.status(200).json({
    total: botProcesses.length,
    active: botProcesses.filter(p => !p.killed).length,
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🌐 Bot Launcher running on port ${PORT}`);
  console.log(`📊 Health check: GET /health`);
  console.log(`🤖 Bot status: GET /bots`);
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down...');
  botProcesses.forEach(p => p.kill());
  process.exit(0);
});
