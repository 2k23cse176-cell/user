const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const { Readable } = require('stream');
const http = require('http');

function parseList(value) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function createSilentStream() {
  return new Readable({
    read(size) {
      this.push(Buffer.alloc(1920));
    }
  });
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => data += chunk);
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const rawTokens = process.env.BOT_TOKENS || process.env.BOT_TOKEN || '';
const tokens = parseList(rawTokens);
const autoJoin = (process.env.AUTO_JOIN || 'false').toLowerCase() === 'true';
const rawChannels = process.env.VOICE_CHANNEL_IDS || process.env.VOICE_CHANNEL_ID || process.env.CHANNEL_ID || '';
const channelIds = parseList(rawChannels);
const port = Number(process.env.PORT || 3000);
const keepAliveMs = Number(process.env.KEEPALIVE_MS || 15000);

if (tokens.length === 0) {
  console.error('❌ Missing BOT_TOKEN or BOT_TOKENS');
  process.exit(1);
}

const bots = tokens.slice(0, 20).map((token, index) => {
  const client = new Client({ checkUpdate: false });
  let voiceConnection = null;
  let audioPlayer = null;

  const bot = {
    client,
    token,
    channelId: null,
    guildId: null,
    status: 'offline',
    voiceState: 'disconnected',
    lastError: null,
    async joinChannel(targetChannelId, targetGuildId) {
      if (!targetChannelId) return false;
      bot.lastError = null;
      pushLog(`Attempting join for bot ${index + 1} -> ${targetChannelId}`);
      if (voiceConnection && bot.channelId === targetChannelId && voiceConnection.state?.status === 'ready') {
        console.log(`ℹ️ [Bot ${index + 1}] Already in ready channel ${targetChannelId}`);
        return;
      }

      if (voiceConnection) {
        try {
          voiceConnection.destroy();
          audioPlayer?.stop();
        } catch (e) {}
      }

      bot.voiceState = 'connecting';
      bot.channelId = null;
      bot.guildId = null;

      try {
        const channel = await client.channels.fetch(targetChannelId);
        const isVoiceChannel = channel && (typeof channel.isVoice === 'function'
          ? channel.isVoice()
          : ['GUILD_VOICE', 'GUILD_STAGE_VOICE', 'GUILD_STAGE_INSTANCE'].includes(channel.type));
        if (!channel || !isVoiceChannel) {
          console.error(`❌ [Bot ${index + 1}] Channel ${targetChannelId} was not found or is not a voice channel`);
          bot.voiceState = 'failed';
          return;
        }

        const guild = targetGuildId
          ? client.guilds.cache.get(targetGuildId) || await client.guilds.fetch(targetGuildId)
          : channel.guild || await client.guilds.fetch(channel.guildId || channel.guild?.id);
        if (!guild) {
          console.error(`❌ [Bot ${index + 1}] Could not resolve guild for ${channel.id}`);
          bot.voiceState = 'failed';
          return;
        }

        console.log(`✅ [Bot ${index + 1}] Joining voice channel ${channel.name} (${channel.id})`);

        voiceConnection = joinVoiceChannel({
          channelId: channel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator,
          selfDeaf: false,
          selfMute: true,
        });

        audioPlayer = createAudioPlayer({
          behaviors: { noSubscriber: NoSubscriberBehavior.Play }
        });
        const silentStream = createSilentStream();
        const resource = createAudioResource(silentStream, {
          inputType: StreamType.Raw,
          inlineVolume: true,
        });
        resource.volume.setVolume(0.0);

        audioPlayer.play(resource);
        voiceConnection.subscribe(audioPlayer);

        voiceConnection.on('error', (error) => {
          const message = error?.message || String(error);
          console.error(`❌ [Bot ${index + 1}] Voice connection error:`, message);
          pushLog(`Bot ${index + 1} voice error: ${message}`);
          bot.lastError = message;
          bot.voiceState = 'failed';
        });

        try {
          await entersState(voiceConnection, VoiceConnectionStatus.Ready, 30000);
          bot.channelId = channel.id;
          bot.guildId = guild.id;
          bot.voiceState = 'connected';
          pushLog(`Bot ${index + 1} connected to ${channel.id}`);
          console.log(`💚 [Bot ${index + 1}] Voice connection ready`);
        } catch (readyError) {
          bot.voiceState = 'failed';
          pushLog(`Bot ${index + 1} failed to ready: ${readyError.message}`);
          console.error(`❌ [Bot ${index + 1}] Voice connection failed to become ready: ${readyError.message}`);
          voiceConnection.destroy();
          audioPlayer?.stop();
          voiceConnection = null;
          audioPlayer = null;
          bot.channelId = null;
          bot.guildId = null;
          return;
        }

        voiceConnection.on('stateChange', (oldState, newState) => {
          console.log(`🔌 [Bot ${index + 1}] Voice state: ${oldState.status} -> ${newState.status}`);
          if (newState.status === 'disconnected' || newState.status === 'destroyed') {
            bot.voiceState = 'disconnected';
            console.error(`❌ [Bot ${index + 1}] Voice disconnected, attempting reconnect...`);
            setTimeout(() => bot.joinChannel(targetChannelId, targetGuildId), 5000);
          }
        });

        audioPlayer.on('error', error => {
          const message = error?.message || String(error);
          console.error(`❌ [Bot ${index + 1}] Audio player error:`, message);
          bot.lastError = message;
          bot.voiceState = 'failed';
        });

        setInterval(() => {
          if (voiceConnection && voiceConnection.state.status === 'ready') {
            console.log(`💚 [Bot ${index + 1}] Voice channel still active`);
          }
        }, keepAliveMs);
      } catch (error) {
        const message = error?.message || String(error);
        bot.lastError = message;
        bot.voiceState = 'failed';
        bot.channelId = null;
        bot.guildId = null;
        pushLog(`Bot ${index + 1} join failed: ${message}`);
        console.error(`❌ [Bot ${index + 1}] Join failed: ${message}`);
      }
      return bot.voiceState === 'connected';
    },
    leaveChannel() {
      if (voiceConnection) {
        console.log(`🟡 [Bot ${index + 1}] Leaving voice channel ${bot.channelId}`);
        voiceConnection.destroy();
        audioPlayer?.stop();
        voiceConnection = null;
        audioPlayer = null;
        bot.channelId = null;
        bot.guildId = null;
      }
    },
    shutdown() {
      try {
        if (voiceConnection) voiceConnection.destroy();
        if (audioPlayer) audioPlayer.stop();
        client.destroy();
      } catch (e) {}
    }
  };

  client.on('ready', async () => {
    bot.status = 'ready';
    console.log(`✅ [Bot ${index + 1}] ${client.user.tag} is ready`);

    if (!autoJoin) {
      console.log(`🟢 [Bot ${index + 1}] Staying online without auto-joining a channel`);
      return;
    }

    const targetChannelId = channelIds[index] || channelIds[0] || null;
    if (!targetChannelId) {
      console.log(`ℹ️ [Bot ${index + 1}] AUTO_JOIN enabled but no channel id was provided`);
      return;
    }

    await bot.joinChannel(targetChannelId);
  });

  client.on('error', (error) => {
    console.error(`❌ [Bot ${index + 1}] Client error:`, error);
  });

  return bot;
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
});

process.on('SIGTERM', () => {
  bots.forEach((bot) => bot.shutdown());
  process.exit(0);
});

process.on('SIGINT', () => {
  bots.forEach((bot) => bot.shutdown());
  process.exit(0);
});

bots.forEach((bot, index) => {
  bot.client.login(bot.token).catch((error) => {
    console.error(`❌ [Bot ${index + 1}] Login failed:`, error.message);
  });
});

console.log(`🚀 Starting ${bots.length} voice bot(s) from BOT_TOKENS/BOT_TOKEN`);
console.log(`🧠 Health endpoint enabled on port ${port}`);

const sendCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// simple in-memory log buffer for diagnostics
const diagLogs = [];
function pushLog(line) {
  const entry = { time: new Date().toISOString(), line };
  diagLogs.push(entry);
  if (diagLogs.length > 1000) diagLogs.shift();
  console.log(line);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    sendCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Render Bot Monitor</title>
  <style>
    body { background:#0b1220; color:#e5e7eb; font-family:system-ui, sans-serif; margin:0; padding:24px; }
    h1 { margin:0 0 8px; font-size:clamp(2rem, 3vw, 2.75rem); }
    p { margin:4px 0 16px; color:#9ca3af; }
    input, button { font:inherit; }
    input { width:100%; max-width:420px; border:1px solid #334155; border-radius:12px; padding:12px 14px; background:#0f172a; color:#e2e8f0; margin-top:10px; }
    button { cursor:pointer; border:none; padding:14px 18px; border-radius:14px; font-weight:700; letter-spacing:.02em; }
    .row { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px; }
    .card { background:rgba(15, 23, 42, .95); border:1px solid rgba(148,163,184,.15); border-radius:18px; padding:18px; width:100%; max-width:920px; }
    .bot { background:#111827; border:1px solid rgba(148,163,184,.12); border-radius:16px; padding:14px; margin-bottom:12px; }
    .bot span { display:inline-block; min-width:90px; color:#94a3b8; }
    .status-ready { color:#22c55e; }
    .status-offline { color:#f97316; }
    .status-vc { color:#38bdf8; }
    .actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:16px; }
    .actions button { flex:1 1 160px; }
    .form-row { display:grid; gap:12px; margin-bottom:16px; }
    a { color:#38bdf8; }
  </style>
</head>
<body>
  <h1>Render Bot Monitor</h1>
  <p>Hosted bot panel for Render. Join bots into a voice channel from this page and keep them online even when your Electron app is closed.</p>

  <div class="card">
    <h2 style="margin-top:0;">Voice Channel Control</h2>
    <div class="form-row">
      <input id="inputGuild" placeholder="Guild ID (optional)" />
      <input id="inputChannel" placeholder="Voice Channel ID" />
    </div>
    <div class="actions">
      <button id="joinBtn" style="background:#22c55e;color:#0f172a;">Join Channel</button>
      <button id="stay" style="background:#0ea5e9;color:#fff;">Rejoin Saved Channel</button>
      <button id="leave" style="background:#ef4444;color:#fff;">Leave Channel</button>
      <button id="refresh" style="background:#475569;color:#fff;">Refresh Status</button>
    </div>
    <div id="message" style="margin:18px 0 0;color:#cbd5e1;"></div>
  </div>

  <div class="card" id="bots"></div>

  <div class="card">
    <h2 style="margin-top:0;">Recent Server Logs</h2>
    <pre id="logs" style="background:#020617;color:#e2e8f0;padding:16px;border-radius:14px;max-height:320px;overflow-y:auto;font-family:menlo,monospace;font-size:12px;line-height:1.4;white-space:pre-wrap;"></pre>
  </div>

  <script>
    const statusEl = document.getElementById('message');
    const botsEl = document.getElementById('bots');
    const logsEl = document.getElementById('logs');
    const guildInput = document.getElementById('inputGuild');
    const channelInput = document.getElementById('inputChannel');

    const renderStatus = (data) => {
      if (!data || !Array.isArray(data.bots)) {
        statusEl.textContent = 'Unable to load bot status.';
        botsEl.innerHTML = '';
        return;
      }

      const total = data.bots.length;
      const readyCount = data.bots.filter(bot => bot.ready).length;
      const connectedCount = data.bots.filter(bot => bot.connected).length;

      statusEl.textContent = 'Ready ' + readyCount + '/' + total + ' • Connected ' + connectedCount + '/' + total + (data.joinedAll ? ' • ALL JOINED' : '');

      if (total === 0) {
        botsEl.innerHTML = '<p>No bots are configured. Set BOT_TOKENS on Render and restart.</p>';
        return;
      }

      botsEl.innerHTML = data.bots.map(function(bot) {
        const statusClass = bot.connected ? 'status-vc' : bot.ready ? 'status-ready' : 'status-offline';
        const statusLabel = bot.connected ? 'Connected' : bot.ready ? 'Ready' : 'Offline';
        return '<div class="bot">'
          + '<div><strong>Bot ' + bot.index + '</strong></div>'
          + '<div><span>Status:</span><span class="' + statusClass + '">' + statusLabel + '</span></div>'
          + '<div><span>Voice State:</span><span>' + (bot.voiceState || 'unknown') + '</span></div>'
          + '<div><span>Channel:</span><span>' + (bot.channelId || 'None') + '</span></div>'
          + '<div><span>Guild:</span><span>' + (bot.guildId || 'None') + '</span></div>'
          + (bot.lastError ? '<div><span>Error:</span><span class="status-offline">' + bot.lastError + '</span></div>' : '')
          + '</div>';
      }).join('');
    };

    const renderLogs = (data) => {
      if (!data || !Array.isArray(data.logs)) {
        logsEl.textContent = 'Unable to load logs.';
        return;
      }
      logsEl.textContent = data.logs
        .map(entry => '[' + entry.time + '] ' + entry.line)
        .join('\n');
      logsEl.scrollTop = logsEl.scrollHeight;
    };

    const fetchStatus = async () => {
      try {
        const res = await fetch('/status');
        const data = await res.json();
        renderStatus(data);
      } catch (e) {
        statusEl.textContent = 'Failed to load status';
        botsEl.innerHTML = '';
      }
    };

    const fetchLogs = async () => {
      try {
        const res = await fetch('/logs');
        const data = await res.json();
        renderLogs(data);
      } catch (e) {
        logsEl.textContent = 'Failed to load logs.';
      }
    };

    document.getElementById('joinBtn').addEventListener('click', async () => {
      const channelId = channelInput.value.trim();
      const guildId = guildInput.value.trim();
      if (!channelId) {
        statusEl.textContent = 'Channel ID is required to join.';
        return;
      }
      statusEl.textContent = 'Joining bots to channel...';
      const res = await fetch('/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, guildId })
      });
      const data = await res.json();
      if (data.joinedAll) {
        statusEl.textContent = 'All bots joined successfully.';
      } else {
        statusEl.textContent = 'Join completed, but not all bots connected.';
      }
      if (data.results && data.results.length) {
        const joinedCount = data.results.filter(r => r.connected).length;
        statusEl.textContent += ' (' + joinedCount + '/' + data.results.length + ' connected)';
      }
      fetchStatus();
      fetchLogs();
    });

    document.getElementById('stay').addEventListener('click', async () => {
      statusEl.textContent = 'Rejoining saved channel...';
      const res = await fetch('/stay', { method: 'POST' });
      const data = await res.json();
      statusEl.textContent = data.status || 'Stay requested';
      fetchStatus();
    });

    document.getElementById('leave').addEventListener('click', async () => {
      statusEl.textContent = 'Leaving voice channel...';
      const res = await fetch('/leave', { method: 'POST' });
      const data = await res.json();
      statusEl.textContent = data.status || 'Leave requested';
      fetchStatus();
    });

    document.getElementById('refresh').addEventListener('click', () => {
      fetchStatus();
      fetchLogs();
    });
    fetchStatus();
    fetchLogs();
    setInterval(() => {
      fetchStatus();
      fetchLogs();
    }, 10000);
  </script>
</body>
</html>`);
    return;
  }

  if (req.url === '/health' && req.method === 'GET') {
    sendCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', bots: bots.length }));
    return;
  }

  if (req.url === '/status' && req.method === 'GET') {
    sendCorsHeaders(res);
    const botStates = bots.map((bot, index) => ({
      index: index + 1,
      ready: bot.status === 'ready',
      connected: bot.voiceState === 'connected',
      voiceState: bot.voiceState,
      channelId: bot.channelId,
      guildId: bot.guildId,
      lastError: bot.lastError,
    }));

    const readyCount = botStates.filter((bot) => bot.ready).length;
    const connectedCount = botStates.filter((bot) => bot.connected).length;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      bots: botStates,
      online: readyCount,
      active: connectedCount,
      joinedAll: connectedCount === botStates.length && botStates.length > 0,
      savedChannel: botStates.find((bot) => bot.connected)?.channelId || null,
      savedGuild: botStates.find((bot) => bot.connected)?.guildId || null,
    }));
    return;
  }

  if (req.url === '/logs' && req.method === 'GET') {
    sendCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ logs: diagLogs.slice(-100) }));
    return;
  }

  if (req.url === '/stay' && req.method === 'POST') {
    sendCorsHeaders(res);
    for (const bot of bots) {
      if (bot.channelId && bot.guildId) {
        bot.joinChannel(bot.channelId, bot.guildId);
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'staying in vc' }));
    return;
  }

  if (req.url === '/join' && req.method === 'POST') {
    try {
      sendCorsHeaders(res);
      const body = await parseJSONBody(req);
      const targetChannelId = body.channelId || body.channel || null;
      const targetGuildId = body.guildId || body.guild || null;
      if (!targetChannelId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'channelId is required' }));
        return;
      }

      pushLog(`Starting join for ${bots.length} bots into ${targetChannelId}`);
      const results = [];
      for (let i = 0; i < bots.length; i++) {
        const bot = bots[i];
        const success = await bot.joinChannel(targetChannelId, targetGuildId).catch(e => {
          const message = e?.message || String(e);
          pushLog(`Join error bot ${i + 1}: ${message}`);
          return false;
        });
        results.push({
          bot: i + 1,
          ready: bot.status === 'ready',
          connected: bot.voiceState === 'connected',
          voiceState: bot.voiceState,
          channelId: bot.channelId,
          guildId: bot.guildId,
          lastError: bot.lastError,
          success,
        });
        pushLog(`Bot ${i + 1} join result: ${success ? 'connected' : 'failed'} (state=${bot.voiceState})`);
        const delayMs = 1500 + Math.floor(Math.random() * 2000);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      const joinedAll = results.every((item) => item.connected);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'joining', channelId: targetChannelId, guildId: targetGuildId, joinedAll, results }));
    } catch (error) {
        const message = error?.message || String(error);
        pushLog(`Join endpoint error: ${message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: message }));
    }
    return;
  }

    if (req.url === '/retry-failed' && req.method === 'POST') {
      sendCorsHeaders(res);
      try {
        const retried = [];
        for (const bot of bots) {
          if (bot.voiceState !== 'connected') {
            try {
              await bot.joinChannel(bot.channelId || bots[0]?.channelId, bot.guildId || bots[0]?.guildId);
              retried.push(true);
            } catch (e) {
              pushLog(`Retry failed for bot: ${e.message || e}`);
              retried.push(false);
            }
            await new Promise((r) => setTimeout(r, 1500 + Math.floor(Math.random() * 2000)));
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'retried', retried }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

  if (req.url === '/leave' && req.method === 'POST') {
    for (const bot of bots) {
      bot.leaveChannel();
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'left' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(port, () => {
  console.log(`🌐 Health server listening on port ${port}`);
});

setInterval(() => {
  process.stdout.write('.');
}, 60000);
