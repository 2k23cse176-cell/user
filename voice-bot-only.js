const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType, VoiceConnectionStatus, AudioPlayerStatus, entersState } = require('@discordjs/voice');
const { Readable, PassThrough } = require('stream');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

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

class InfinitePCMStream extends Readable {
  constructor() {
    super({ highWaterMark: 960 * 4 * 50 });
    this.buffer = Buffer.alloc(0);
  }
  _read(size) {
    if (this.buffer.length >= size) {
      this.push(this.buffer.slice(0, size));
      this.buffer = this.buffer.slice(size);
    } else {
      // Pad with silence to prevent stream from ending/stalling
      this.push(Buffer.alloc(size));
    }
  }
  addAudio(data) {
    this.buffer = Buffer.concat([this.buffer, data]);
  }
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

// ============================================================
// SINGLE GLOBAL AUDIO PLAYER — CORRECT @discordjs/voice broadcast pattern
// subscribe() broadcasts the player's output to ALL connected voice connections
// ============================================================
let globalVolume = 1.0;      // Normalized 0.0 - 2.0 (applied in FFmpeg C-code, NOT JS)
let globalMute = true;
let globalDeaf = false;
let globalAudioProcess = null;
let globalAudioProcessKilled = false;
let globalAudioPlayer = null;
let isPlaying = false;

function createAudioPlayerInstance() {
  const player = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Play }
  });

  player.on('error', error => {
    console.error(`❌ Global Audio Player Error:`, error.message);
    playGlobalSilence();
  });

  return player;
}

globalAudioPlayer = createAudioPlayerInstance();

function playGlobalSilence() {
  isPlaying = false;
  if (globalAudioProcess) {
    globalAudioProcessKilled = true;
    try { globalAudioProcess.kill(); } catch(e) {}
    globalAudioProcess = null;
  }
  const silentStream = createSilentStream();
  const resource = createAudioResource(silentStream, {
    inputType: StreamType.Raw,
    inlineVolume: false,  // CRITICAL: No JS volume processing
  });
  globalAudioPlayer.play(resource);
}

function subscribeAllConnectedBots() {
  for (const bot of bots) {
    if (bot.voiceConnection && bot.voiceConnection.state?.status === VoiceConnectionStatus.Ready) {
      bot.voiceConnection.subscribe(globalAudioPlayer);
    }
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playGlobalAudio() {
  if (!fs.existsSync('./shared_audio.mp3')) return false;

  if (globalAudioProcess) {
    globalAudioProcessKilled = true;
    try { globalAudioProcess.kill(); } catch(e) {}
  }

  if (globalAudioPlayer && globalAudioPlayer.state?.status !== AudioPlayerStatus.Idle) {
    globalAudioPlayer.stop(true);
  }

  isPlaying = true;

  // FFmpeg — volume applied in C-code via -af volume=... (zero JS overhead)
  globalAudioProcess = spawn(ffmpeg, [
    '-i', './shared_audio.mp3',
    '-af', `volume=${globalVolume}`,
    '-f', 's16le',
    '-ar', '48000',
    '-ac', '2',
    '-loglevel', 'error',
    'pipe:1'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  globalAudioProcess.stderr.on('data', d => {
    const text = d.toString().trim();
    if (globalAudioProcessKilled && text.includes('Connection reset by peer')) return;
    if (text) console.log('FFmpeg:', text);
  });

  globalAudioProcess.on('exit', (code, signal) => {
    globalAudioProcessKilled = false;
    if (code !== 0 && signal !== 'SIGTERM') {
      console.error(`❌ FFmpeg exited: code=${code}, signal=${signal}`);
      globalAudioProcess = null;
      if (isPlaying) setTimeout(() => { if (isPlaying) playGlobalAudio(); }, 200);
    }
  });

  globalAudioProcess.on('error', (err) => {
    console.error(`❌ FFmpeg error:`, err.message);
    globalAudioProcess = null;
    playGlobalSilence();
  });

  // inlineVolume: false — volume is handled by FFmpeg's -af volume=
  const resource = createAudioResource(globalAudioProcess.stdout, {
    inputType: StreamType.Raw,
    inlineVolume: false,
  });
  
  globalAudioPlayer.play(resource);

  globalAudioProcess.on('close', () => {
    globalAudioProcess = null;
  });

  return true;
}

playGlobalSilence();

// ============================================================
// BOTS — All subscribe to the same global player
// ============================================================
const bots = tokens.slice(0, 30).map((token, index) => {
  const client = new Client({ checkUpdate: false });
  let voiceConnection = null;
  let readyPromise = null;

  const waitForReady = () => {
    if (readyPromise) return readyPromise;
    if (bot.status === 'ready' || client.readyTimestamp || client.isReady?.()) {
      return Promise.resolve();
    }
    readyPromise = new Promise((resolve, reject) => {
      const onReady = () => { cleanup(); resolve(); };
      const onError = (error) => { cleanup(); reject(error); };
      const cleanup = () => {
        client.off('ready', onReady);
        client.off('error', onError);
      };
      client.once('ready', onReady);
      client.once('error', onError);
    });
    return readyPromise;
  };

  const bot = {
    client,
    token,
    channelId: null,
    guildId: null,
    voiceConnection: null,
    status: 'offline',
    voiceState: 'disconnected',
    lastError: null,
    async joinChannel(targetChannelId, targetGuildId) {
      if (!targetChannelId) return false;
      if (voiceConnection && bot.channelId === targetChannelId && voiceConnection.state?.status === 'ready') {
        bot.voiceState = 'connected';
        return true;
      }

      if (voiceConnection) {
        try { voiceConnection.destroy(); } catch (e) {}
      }

      bot.voiceState = 'connecting';
      bot.lastError = null;
      bot.channelId = null;
      bot.guildId = null;

      try {
        await waitForReady();

        const channel = await client.channels.fetch(targetChannelId);
        if (!channel || !channel.isVoice?.()) {
          bot.lastError = `Channel ${targetChannelId} not found or not a voice channel`;
          bot.voiceState = 'failed';
          return false;
        }

        const guild = targetGuildId
          ? client.guilds.cache.get(targetGuildId) || await client.guilds.fetch(targetGuildId)
          : channel.guild || await client.guilds.fetch(channel.guildId || channel.guild?.id);

        if (!guild) {
          bot.lastError = `Could not resolve guild`;
          bot.voiceState = 'failed';
          return false;
        }

        console.log(`✅ [Bot ${index + 1}] Joining ${channel.name}`);

        let joined = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            voiceConnection = joinVoiceChannel({
              channelId: channel.id,
              guildId: guild.id,
              adapterCreator: guild.voiceAdapterCreator,
              group: client.user.id,
              selfDeaf: globalDeaf,
              selfMute: globalMute,
            });

            bot.voiceConnection = voiceConnection;
            voiceConnection.subscribe(globalAudioPlayer);

            await entersState(voiceConnection, VoiceConnectionStatus.Ready, 30000);
            joined = true;
            break;
          } catch (error) {
            voiceConnection?.destroy();
            voiceConnection = null;
            if (attempt === 3) throw error;
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }

        if (!joined) throw new Error('Voice join failed after retries');

        bot.channelId = channel.id;
        bot.guildId = guild.id;
        bot.voiceState = 'connected';
        bot.lastError = null;

        voiceConnection.on('stateChange', (oldState, newState) => {
          if (newState.status === 'disconnected' || newState.status === 'destroyed') {
            bot.voiceState = 'disconnected';
            const jitter = Math.floor(Math.random() * 5000) + 3000;
            setTimeout(() => {
              if (bot.channelId && bot.guildId) {
                bot.joinChannel(bot.channelId, bot.guildId).catch(() => {});
              }
            }, jitter);
          }
        });

        setInterval(() => {
          if (voiceConnection && voiceConnection.state.status === 'ready') {
            console.log(`💚 [Bot ${index + 1}] Active`);
          }
        }, keepAliveMs);
        return true;
      } catch (error) {
        bot.lastError = error?.message || String(error);
        bot.voiceState = 'failed';
        return false;
      }
    },
    leaveChannel() {
      if (voiceConnection) {
        voiceConnection.destroy();
        voiceConnection = null;
        bot.channelId = null;
        bot.guildId = null;
      }
    },
    shutdown() {
      try { if (voiceConnection) voiceConnection.destroy(); client.destroy(); } catch (e) {}
    }
  };

  client.on('ready', async () => {
    bot.status = 'ready';
    console.log(`✅ [Bot ${index + 1}] ${client.user.tag} ready`);

    if (!autoJoin) return;

    const targetChannelId = channelIds[index] || channelIds[0] || null;
    if (!targetChannelId) return;

    await bot.joinChannel(targetChannelId);
  });

  client.on('error', (error) => {
    console.error(`❌ [Bot ${index + 1}] Client error:`, error);
  });

  return bot;
});

// ============================================================
// PROCESS
// ============================================================
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
});

process.on('SIGTERM', () => {
  if (globalAudioProcess) { globalAudioProcessKilled = true; try { globalAudioProcess.kill(); } catch(e) {} }
  bots.forEach((bot) => bot.shutdown());
  process.exit(0);
});

process.on('SIGINT', () => {
  if (globalAudioProcess) { globalAudioProcessKilled = true; try { globalAudioProcess.kill(); } catch(e) {} }
  bots.forEach((bot) => bot.shutdown());
  process.exit(0);
});

// ============================================================
// LOGIN
// ============================================================
const loginAllBots = async () => {
  await Promise.all(bots.map((bot, index) => bot.client.login(bot.token).then(() => {
    console.log(`🔐 [Bot ${index + 1}] Login complete`);
  }).catch((error) => {
    console.error(`❌ [Bot ${index + 1}] Login failed:`, error.message);
    throw error;
  })));
};

loginAllBots().catch(() => {});

console.log(`🚀 Starting ${bots.length} voice bot(s)`);
console.log(`🧠 HTTP server on port ${port}`);

// ============================================================
// HTTP SERVER
// ============================================================
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Multi-Bot Audio</title>
<style>
*{box-sizing:border-box}
body{background:#0b1220;color:#e5e7eb;font-family:system-ui,sans-serif;margin:0;padding:0}
h1{margin:0;font-size:1.8rem}
header{padding:18px 24px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:16px}
.tabs{display:flex;gap:0;border-bottom:1px solid #1e293b}
.tab{padding:12px 22px;cursor:pointer;font-weight:600;color:#94a3b8;border-bottom:3px solid transparent;transition:.2s}
.tab.active{color:#f43f5e;border-bottom-color:#f43f5e}
.page{display:none;padding:24px;max-width:960px}.page.active{display:block}
input,button{font:inherit}
input[type=text],input[type=file]{width:100%;border:1px solid #334155;border-radius:12px;padding:11px 14px;background:#0f172a;color:#e2e8f0;margin-top:8px}
button{cursor:pointer;border:none;padding:12px 18px;border-radius:12px;font-weight:700}
.card{background:rgba(15,23,42,.95);border:1px solid rgba(148,163,184,.15);border-radius:18px;padding:18px;margin-bottom:20px}
.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}.actions button{flex:1 1 140px}
.bot{background:#111827;border:1px solid rgba(148,163,184,.12);border-radius:14px;padding:12px;margin-bottom:10px}
.bot span{display:inline-block;min-width:90px;color:#94a3b8}
.ok{color:#22c55e}.off{color:#f97316}
label{display:flex;justify-content:space-between;font-weight:bold;color:#f43f5e;margin-top:12px}
#msg,#amsg,#imsg,#micmsg{margin-top:14px;color:#cbd5e1;min-height:20px}
#micBtn{background:#e11d48;color:#fff;font-size:1rem;padding:16px 32px;border-radius:16px;width:100%}
#micBtn.active{background:#059669}
.inv-result{font-size:.85rem;margin-top:8px;max-height:200px;overflow:auto;color:#94a3b8}
</style></head><body>
<header><h1>🎙️ Multi-Bot Audio</h1><span style="color:#64748b">${bots.length} bots</span></header>
<div class="tabs">
  <div class="tab active" onclick="switchTab('audio')">🎵 Audio</div>
  <div class="tab" onclick="switchTab('vc')">📡 Voice Control</div>
  <div class="tab" onclick="switchTab('invite')">🔗 Server Join</div>
  <div class="tab" onclick="switchTab('mic')">🎤 Mic Route & Captchas</div>
  <div class="tab" onclick="switchTab('bots')">🤖 Bots</div>
</div>

<!-- AUDIO TAB -->
<div id="page-audio" class="page active">
  <div class="card">
    <h2 style="margin-top:0;color:#f43f5e">🎵 God Volume Audio Player</h2>
    <input type="file" id="audioFile" accept="audio/*"/>
    <label>Volume: <span id="volDisplay">1.0x</span></label>
    <input type="range" id="volSlider" min="0" max="200" step="1" value="100" style="width:100%;accent-color:#f43f5e;margin-top:6px"/>
    <div class="actions">
      <button id="uploadPlayBtn" style="background:#8b5cf6;color:#fff">Upload & Play</button>
      <button id="playSavedBtn" style="background:#0ea5e9;color:#fff">Play Saved</button>
      <button id="stopAudioBtn" style="background:#ef4444;color:#fff">Stop</button>
    </div>
    <div id="amsg"></div>
  </div>
</div>

<!-- VOICE CONTROL TAB -->
<div id="page-vc" class="page">
  <div class="card">
    <h2 style="margin-top:0">📡 Voice Channel Control</h2>
    <input type="text" id="inputGuild" placeholder="Guild ID (optional)"/>
    <input type="text" id="inputChannel" placeholder="Voice Channel ID"/>
    <div class="actions">
      <button id="joinBtn" style="background:#22c55e;color:#0f172a">Join Channel</button>
      <button id="stayBtn" style="background:#0ea5e9;color:#fff">Rejoin Saved</button>
      <button id="leaveBtn" style="background:#ef4444;color:#fff">Leave Channel</button>
    </div>
    <div id="msg"></div>
  </div>
  <div class="card">
    <h2 style="margin-top:0">🔇 Mute / Deafen</h2>
    <div class="actions">
      <button onclick="fa('/audio/mute','Muting...')" style="background:#4b5563;color:#fff">Mute All</button>
      <button onclick="fa('/audio/unmute','Unmuting...')" style="background:#10b981;color:#fff">Unmute All</button>
      <button onclick="fa('/audio/deafen','Deafening...')" style="background:#4b5563;color:#fff">Deafen All</button>
      <button onclick="fa('/audio/undeafen','Undeafening...')" style="background:#3b82f6;color:#fff">Undeafen All</button>
    </div>
  </div>
</div>

<!-- SERVER JOIN TAB -->
<div id="page-invite" class="page">
  <div class="card">
    <h2 style="margin-top:0;color:#a78bfa">🔗 Join New Server via Invite Link</h2>
    <p style="color:#94a3b8;margin:0 0 10px">Paste a Discord voice channel invite link. All bots will accept it and join the voice channel automatically.</p>
    <input type="text" id="inviteInput" placeholder="https://discord.gg/XXXXXXX"/>
    <div class="actions" style="margin-top:12px">
      <button id="inviteJoinBtn" style="background:#a78bfa;color:#fff;flex:none;width:100%">🚀 Join All Bots to This Server</button>
    </div>
    <div id="imsg"></div>
    <div id="inviteResults" class="inv-result"></div>
  </div>
</div>

<!-- MIC ROUTE TAB -->
<div id="page-mic" class="page">
  <div class="card">
    <h2 style="margin-top:0;color:#e11d48">🎤 Mic Route — Speak Through All Bots</h2>
    <p style="color:#94a3b8;margin:0 0 14px">Your microphone will be captured in the browser and streamed live through all 20 bots in the voice channel simultaneously.</p>
    <button id="micBtn">🎤 Start Mic Route</button>
    <div id="micmsg" style="margin-top:12px;color:#94a3b8"></div>
  </div>
  
    <h2 style="margin-top:24px;color:#a855f7;text-shadow:0 2px 4px rgba(0,0,0,0.3)">🎚️ Shuklacord Engine</h2>
    <p style="color:#e2e8f0;margin:0 0 14px;font-size:0.9rem">The complete Shuklacord extension interface loaded natively.</p>
    <iframe src="/shuklacord/popup.html" style="width:100%;height:450px;border:none;border-radius:12px;background:#181818"></iframe>
    <h2 style="margin-top:24px;color:#f43f5e;display:flex;justify-content:space-between;align-items:center;">
      <span>🔠 Web Grid (Captcha Solver)</span>
      <span style="font-size:0.9rem;color:#94a3b8;font-weight:normal;">Use your browser extensions to inject tokens into these frames.</span>
    </h2>
    <div id="iframeGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px;height:60vh;overflow-y:auto;padding-right:10px;margin-top:10px">
      ${bots.map((b,i)=>`
        <div style="background:#111827;border:1px solid #334155;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;height:400px">
          <div style="background:#1e293b;padding:4px 8px;font-size:0.8rem;font-weight:bold;color:#cbd5e1;display:flex;justify-content:space-between">
            <span>Bot ${i+1}</span>
            <button onclick="document.getElementById('frame-${i}').src='https://discord.com/app'" style="padding:2px 6px;font-size:0.7rem;border-radius:4px;background:#3b82f6;color:white">Reload</button>
          </div>
          <iframe id="frame-${i}" src="https://discord.com/app" style="width:100%;height:100%;border:none;background:#2b2d31"></iframe>
        </div>
      `).join('')}
    </div>
  </div>
</div>

<!-- BOTS TAB -->
<div id="page-bots" class="page">
  <div class="card" id="botsContainer"><p>Loading...</p></div>
</div>

<script>
// Tab switching
function switchTab(t){
  document.querySelectorAll('.tab').forEach((el,i)=>{el.classList.toggle('active',['audio','vc','invite','mic','bots'][i]===t)});
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+t).classList.add('active');
  if(t==='bots') fetchStatus();
}

// Status
async function fetchStatus(){
  try{const r=await fetch('/status');const d=await r.json();
  document.getElementById('botsContainer').innerHTML=d.bots.map(b=>'<div class="bot"><div><strong>Bot '+b.index+'</strong></div><div><span>Status:</span><span class="'+(b.ready?'ok':'off')+'">'+(b.ready?'Ready':'Offline')+'</span></div><div><span>Voice:</span><span>'+(b.voiceState||'—')+'</span></div><div><span>Channel:</span><span>'+(b.channelId||'None')+'</span></div></div>').join('');
  }catch(e){}}
fetchStatus(); setInterval(fetchStatus,10000);

// Audio
const amsg=document.getElementById('amsg'),vs=document.getElementById('volSlider'),vd=document.getElementById('volDisplay');
vs.oninput=()=>vd.textContent=(vs.value/100).toFixed(2)+'x';
vs.onchange=async()=>await fetch('/audio/volume',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({volume:vs.value/100})});
document.getElementById('uploadPlayBtn').onclick=async()=>{
  const f=document.getElementById('audioFile').files[0];if(!f){amsg.textContent='Select a file';return}
  amsg.textContent='Uploading...';const up=await fetch('/audio/upload',{method:'POST',body:f});
  if(!up.ok){amsg.textContent='Upload failed';return}
  amsg.textContent='Playing...';const d=await(await fetch('/audio/play',{method:'POST'})).json();amsg.textContent=d.status||d.error};
document.getElementById('playSavedBtn').onclick=async()=>{amsg.textContent='Playing...';const d=await(await fetch('/audio/play',{method:'POST'})).json();amsg.textContent=d.status||d.error};
document.getElementById('stopAudioBtn').onclick=async()=>{amsg.textContent='Stopping...';const d=await(await fetch('/audio/stop',{method:'POST'})).json();amsg.textContent=d.status};

// Voice control
const msg=document.getElementById('msg');
document.getElementById('joinBtn').onclick=async()=>{
  const ch=document.getElementById('inputChannel').value.trim();if(!ch){msg.textContent='Channel ID required';return}
  msg.textContent='Joining...';const d=await(await fetch('/join',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({channelId:ch,guildId:document.getElementById('inputGuild').value.trim()})})).json();
  msg.textContent=d.status||'Done';fetchStatus()};
document.getElementById('stayBtn').onclick=async()=>{msg.textContent='Rejoining...';const d=await(await fetch('/stay',{method:'POST'})).json();msg.textContent=d.status};
document.getElementById('leaveBtn').onclick=async()=>{msg.textContent='Leaving...';const d=await(await fetch('/leave',{method:'POST'})).json();msg.textContent=d.status;fetchStatus()};
async function fa(url,txt){const d=await(await fetch(url,{method:'POST'})).json();document.getElementById('amsg').textContent=d.status||d.error}

// Invite Join
document.getElementById('inviteJoinBtn').onclick=async()=>{
  const inv=document.getElementById('inviteInput').value.trim();
  if(!inv){document.getElementById('imsg').textContent='Paste an invite link first';return}
  document.getElementById('imsg').textContent='⏳ Joining all bots... this may take ~30s';
  document.getElementById('inviteResults').innerHTML='';
  const d=await(await fetch('/join-invite',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({invite:inv})})).json();
  const ok=d.results?.filter(r=>r.success)||[];
  const failed=d.results?.filter(r=>!r.success)||[];
  document.getElementById('imsg').textContent=d.error||(ok.length+'/'+d.results?.length+' bots joined');
  // Show verification panel for failed bots
  let html='';
  if(failed.length>0){
    html+='<div style="margin-top:14px;padding:14px;background:#1e1030;border:1px solid #7c3aed;border-radius:12px">';
    html+='<div style="color:#a78bfa;font-weight:bold;margin-bottom:8px">⚠️ '+failed.length+' bot(s) need manual verification</div>';
    html+='<p style="color:#94a3b8;font-size:.85rem;margin:0 0 10px">These bots hit a captcha or verification wall. Open them in the <strong>Electron Grid View</strong> and complete verification manually, then click Rejoin.</p>';
    html+='<div style="display:flex;flex-wrap:wrap;gap:8px">';
    failed.forEach(r=>{
      html+='<div style="background:#2d1f50;border:1px solid #7c3aed;border-radius:8px;padding:8px 12px;font-size:.85rem">';
      html+='<strong style="color:#c4b5fd">Bot '+r.bot+'</strong><br>';
      html+='<span style="color:#f87171">'+(r.error||'Unknown error')+'</span>';
      html+='</div>';
    });
    html+='</div></div>';
  }
  if(ok.length>0){
    html+='<div style="margin-top:10px;color:#4ade80;font-size:.85rem">✅ Bots joined: '+ok.map(r=>'#'+r.bot).join(', ')+'</div>';
  }
  document.getElementById('inviteResults').innerHTML=html;
  fetchStatus()};

// Mic Route — fixed: mono->stereo done server-side, use 4096 buffer for stability
const micBtn=document.getElementById('micBtn'),micmsg=document.getElementById('micmsg');
micBtn.onclick=async()=>{
  if(window.micWs){window.micWs.close();return}
  try{
    // Ask for 48kHz mono mic
    window.micStream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,sampleRate:48000,echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
    const proto=location.protocol==='https:'?'wss:':'ws:';
    window.micWs=new WebSocket(proto+'//'+location.host);
    window.micWs.binaryType='arraybuffer';
    window.micWs.onopen=()=>{
      micBtn.textContent='🔴 Stop Mic Route';micBtn.classList.add('active');
      micmsg.textContent='🎤 Live! Speaking through all bots in VC.';
      window.audioCtx=new (window.AudioContext||window.webkitAudioContext)({sampleRate:48000,latencyHint:'interactive'});
      window.micSrc=window.audioCtx.createMediaStreamSource(window.micStream);
      
      // Keep AudioContext alive aggressively (Chrome/Safari suspending fix)
      window.silentOsc=window.audioCtx.createOscillator();
      window.silentOsc.type='sine';
      window.silentGain=window.audioCtx.createGain();
      window.silentGain.gain.value=0; // Absolutely silent
      window.silentOsc.connect(window.silentGain);
      window.silentGain.connect(window.audioCtx.destination);
      window.silentOsc.start();

      // 4096 samples = ~85ms chunks — stable on Render
      window.scriptNode=window.audioCtx.createScriptProcessor(4096,1,1);
      window.scriptNode.onaudioprocess=(e)=>{
        if(window.micWs.readyState!==1)return;
        const input=e.inputBuffer.getChannelData(0);
        const pcm=new Int16Array(input.length);
        for(let i=0;i<input.length;i++) pcm[i]=Math.max(-32768,Math.min(32767,input[i]*32767));
        window.micWs.send(pcm.buffer);
      };
      // Connect: src -> scriptNode -> destination
      window.micSrc.connect(window.scriptNode);
      window.scriptNode.connect(window.audioCtx.destination);
    };
    window.micWs.onclose=()=>{
      micBtn.textContent='🎤 Start Mic Route';micBtn.classList.remove('active');micmsg.textContent='Mic stopped.';
      if(window.scriptNode){try{window.scriptNode.disconnect();}catch(e){} window.scriptNode=null}
      if(window.audioCtx){window.audioCtx.close();window.audioCtx=null}
      if(window.micStream){window.micStream.getTracks().forEach(t=>t.stop());window.micStream=null}
      window.micWs=null;
    };
    window.micWs.onerror=(e)=>{micmsg.textContent='WebSocket error — check console';console.error(e)};
  }catch(e){micmsg.textContent='Error: '+e.message}
};

// Shuklacord God Volume Control
const godVolSlider = document.getElementById('godVolSlider');
const godVolDisplay = document.getElementById('godVolDisplay');
let currentGodVol = 2500;

function updateGodVolDisplay() {
  if (godVolDisplay) godVolDisplay.textContent = currentGodVol.toFixed(1) + 'x';
}

if (godVolSlider) {
  godVolSlider.oninput = (e) => {
    currentGodVol = parseFloat(e.target.value);
    updateGodVolDisplay();
  };
}

window.setGodVol = (val) => {
  currentGodVol = val;
  if (godVolSlider) godVolSlider.value = val;
  updateGodVolDisplay();
};

const applyGodVolBtn = document.getElementById('applyGodVolBtn');
if (applyGodVolBtn) {
  applyGodVolBtn.onclick = async () => {
    const godVolMsg = document.getElementById('godVolMsg');
    try {
      const res = await fetch('/audio/volume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volume: currentGodVol })
      });
      if(res.ok) {
        godVolMsg.textContent = '✅ Gain Applied!';
        godVolMsg.style.color = '#4ade80';
        godVolMsg.style.display = 'block';
        setTimeout(() => godVolMsg.style.display = 'none', 3000);
      } else {
        godVolMsg.textContent = '❌ Failed to apply gain';
        godVolMsg.style.color = '#ef4444';
        godVolMsg.style.display = 'block';
      }
    } catch(e) { console.error(e); }
  };
}
</script>
</body></html>`);
    return;
  }

  // Serve Shuklacord extension assets dynamically
  if (req.url.startsWith('/shuklacord/')) {
    const filePath = path.join(__dirname, decodeURIComponent(req.url));
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', bots: bots.length }));
    return;
  }

  if (req.url === '/audio/upload' && req.method === 'POST') {
    const fileStream = fs.createWriteStream('./shared_audio.mp3');
    req.pipe(fileStream);
    fileStream.on('finish', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'uploaded' }));
    });
    fileStream.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  if (req.url === '/audio/play' && req.method === 'POST') {
    if (!fs.existsSync('./shared_audio.mp3')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No audio uploaded yet' }));
      return;
    }
    try {
      const success = await playGlobalAudio();
      if (!success) throw new Error('Failed to start audio');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'playing' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.url === '/audio/stop' && req.method === 'POST') {
    if (globalAudioProcess) { globalAudioProcessKilled = true; try { globalAudioProcess.kill(); } catch(e) {} }
    playGlobalSilence();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'stopped' }));
    return;
  }

  if (req.url === '/audio/volume' && req.method === 'POST') {
    try {
      const body = await parseJSONBody(req);
      const newVol = parseFloat(body.volume);
      if (!isNaN(newVol) && newVol >= 0) {
        globalVolume = newVol;
        if (isPlaying) playGlobalAudio();
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'volume updated', volume: globalVolume }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  const updateVoiceState = (mute, deaf) => {
    globalMute = mute;
    globalDeaf = deaf;
    for (const bot of bots) {
      if (bot.channelId && bot.guildId && bot.voiceState === 'connected') {
        const guild = bot.client.guilds.cache.get(bot.guildId);
        if (guild) {
          const vc = joinVoiceChannel({ channelId: bot.channelId, guildId: bot.guildId, adapterCreator: guild.voiceAdapterCreator, group: bot.client.user.id, selfDeaf: globalDeaf, selfMute: globalMute });
          vc.subscribe(globalAudioPlayer);
        }
      }
    }
  };

  if (req.url === '/audio/mute' && req.method === 'POST') { updateVoiceState(true, globalDeaf); res.writeHead(200); res.end(JSON.stringify({ status: 'muted all bots' })); return; }
  if (req.url === '/audio/unmute' && req.method === 'POST') { updateVoiceState(false, globalDeaf); res.writeHead(200); res.end(JSON.stringify({ status: 'unmuted all bots' })); return; }
  if (req.url === '/audio/deafen' && req.method === 'POST') { updateVoiceState(globalMute, true); res.writeHead(200); res.end(JSON.stringify({ status: 'deafened all bots' })); return; }
  if (req.url === '/audio/undeafen' && req.method === 'POST') { updateVoiceState(globalMute, false); res.writeHead(200); res.end(JSON.stringify({ status: 'undeafened all bots' })); return; }

  if (req.url === '/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      isPlaying,
      bots: bots.map((bot, index) => ({
        index: index + 1,
        ready: bot.status === 'ready',
        connected: bot.voiceState === 'connected',
        voiceState: bot.voiceState,
        channelId: bot.channelId,
        guildId: bot.guildId,
        lastError: bot.lastError,
      })),
      joinedAll: bots.length > 0 && bots.every((bot) => bot.voiceState === 'connected')
    }));
    return;
  }

  if (req.url === '/stay' && req.method === 'POST') {
    for (const bot of bots) {
      if (bot.channelId && bot.guildId) bot.joinChannel(bot.channelId, bot.guildId);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'staying in vc' }));
    return;
  }

  if (req.url === '/join' && req.method === 'POST') {
    try {
      const body = await parseJSONBody(req);
      const targetChannelId = body.channelId || body.channel || null;
      const targetGuildId = body.guildId || body.guild || null;
      if (!targetChannelId) { res.writeHead(400); res.end(JSON.stringify({ error: 'channelId is required' })); return; }

      const results = await Promise.all(bots.map(async (bot, i) => {
        if (bot.status !== 'ready') return { bot: i + 1, success: false, error: 'Bot is offline' };
        const success = await bot.joinChannel(targetChannelId, targetGuildId);
        return { bot: i + 1, success, connected: bot.voiceState === 'connected', error: bot.lastError };
      }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'joining', results }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (req.url === '/leave' && req.method === 'POST') {
    for (const bot of bots) bot.leaveChannel();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'left' }));
    return;
  }

  // Accept a discord.gg invite link and make all bots join that server+channel
  if (req.url === '/join-invite' && req.method === 'POST') {
    try {
      const body = await parseJSONBody(req);
      const inviteUrl = body.invite || '';
      const codeMatch = inviteUrl.match(/discord(?:\.gg|(?:app)?\.com\/invite)\/([a-zA-Z0-9\-]+)/);
      if (!codeMatch) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid invite link. Use discord.gg/XXXX format.' }));
        return;
      }
      const code = codeMatch[1];
      const results = await Promise.all(bots.map(async (bot, i) => {
        if (bot.status !== 'ready') return { bot: i+1, success: false, error: 'offline' };
        try {
          const invite = await bot.client.fetchInvite(code);
          await bot.client.acceptInvite(code);
          // Wait briefly then join the voice channel if we know one
          await new Promise(r => setTimeout(r, 2000));
          if (invite.channelId) {
            const ok = await bot.joinChannel(invite.channelId, invite.guild?.id);
            return { bot: i+1, success: ok, channel: invite.channelId };
          }
          return { bot: i+1, success: true, note: 'Joined server, no voice channel in invite' };
        } catch(e) {
          return { bot: i+1, success: false, error: e.message };
        }
      }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'done', results }));
    } catch(e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(port, () => {
  console.log(`\uD83C\uDF10 HTTP server listening on port ${port}`);
});

// ============================================================
// WEBSOCKET — Mic Route: browser streams PCM -> all bots play it
// ============================================================
const micPlayer = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
micPlayer.on('error', e => console.error('Mic player error:', e.message));
let micActive = false;
let micPassThrough = null;

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('\uD83C\uDFA4 Mic client connected');
  micPassThrough = new InfinitePCMStream();
  const micResource = createAudioResource(micPassThrough, { inputType: StreamType.Raw, inlineVolume: false });
  micPlayer.play(micResource);
  // Subscribe all connected bots to mic player
  for (const bot of bots) {
    if (bot.voiceConnection && bot.voiceConnection.state?.status === VoiceConnectionStatus.Ready) {
      bot.voiceConnection.subscribe(micPlayer);
    }
  }
  micActive = true;
  ws.on('message', (data) => {
    if (!micPassThrough || micPassThrough.destroyed) return;
    
    // CRITICAL FIX: data is a Node.js Buffer. Using data.buffer reads the shared memory pool, causing garbage static.
    // We must read exactly the bytes sent and convert to 2-channel stereo.
    const sampleCount = data.length / 2;
    const stereoBuffer = Buffer.alloc(sampleCount * 4); // 2 channels * 2 bytes (16-bit)
    
    for (let i = 0; i < sampleCount; i++) {
      const sample = data.readInt16LE(i * 2); // Read mono sample
      stereoBuffer.writeInt16LE(sample, i * 4);       // Left channel
      stereoBuffer.writeInt16LE(sample, i * 4 + 2);   // Right channel
    }
    
    micPassThrough.addAudio(stereoBuffer);
  });
  ws.on('close', () => {
    console.log('\uD83C\uDFA4 Mic client disconnected');
    micActive = false;
    if (micPassThrough) { micPassThrough.end(); micPassThrough = null; }
    // Re-subscribe bots to main audio player
    for (const bot of bots) {
      if (bot.voiceConnection && bot.voiceConnection.state?.status === VoiceConnectionStatus.Ready) {
        bot.voiceConnection.subscribe(globalAudioPlayer);
      }
    }
  });
  ws.on('error', (e) => console.error('WS error:', e.message));
});

// ============================================================
// JOIN INVITE — resolve invite code and make all bots join
// ============================================================
server.on('request', () => {}); // already handled above

setInterval(() => { process.stdout.write('.'); }, 60000);