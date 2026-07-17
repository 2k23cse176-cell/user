const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType, VoiceConnectionStatus, AudioPlayerStatus, entersState } = require('@discordjs/voice');
const { Readable } = require('stream');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const http = require('http');
const fs = require('fs');

function parseList(v) { return (v||'').split(',').map(s=>s.trim()).filter(Boolean); }
function parseJSONBody(req) {
  return new Promise((resolve,reject)=>{let d='';req.on('data',c=>d+=c);req.on('end',()=>{try{resolve(d?JSON.parse(d):{})}catch(e){reject(e)}});req.on('error',reject);});
}

const tokens = parseList(process.env.BOT_TOKENS||process.env.BOT_TOKEN||'');
const autoJoin = (process.env.AUTO_JOIN||'false').toLowerCase()==='true';
const channelIds = parseList(process.env.VOICE_CHANNEL_IDS||process.env.VOICE_CHANNEL_ID||process.env.CHANNEL_ID||'');
const port = Number(process.env.PORT||3000);
const keepAliveMs = Number(process.env.KEEPALIVE_MS||15000);
if(!tokens.length){console.error('❌ Missing BOT_TOKEN');process.exit(1);}

// ============================================================
// STATE
// ============================================================
let globalVolume = 1.0;
let globalMute = true;
let globalDeaf = false;
let isPlaying = false;

let globalPlayer = null;
let globalAudioProcess = null;
let globalAudioProcessKilled = false;

const bots = [];
const verificationQueue = [];

let micFfmpeg = null;
let micActive = false;
let micStreamReq = null; // single long-lived upload request

// ============================================================
// AUDIO
// ============================================================
globalPlayer = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
globalPlayer.on('error', e => console.error('❌ Player:', e.message));

function playSilence() {
  isPlaying = false;
  if (globalAudioProcess) { globalAudioProcessKilled=true; try{globalAudioProcess.kill()}catch(e){} globalAudioProcess=null; }
  const s = new Readable({read(sz){this.push(Buffer.alloc(1920));}});
  const r = createAudioResource(s, { inputType: StreamType.Raw, inlineVolume: false });
  globalPlayer.play(r);
}

async function playAudio() {
  if (!fs.existsSync('./shared_audio.mp3')) return false;
  if (globalAudioProcess) { globalAudioProcessKilled=true; try{globalAudioProcess.kill()}catch(e){} globalAudioProcess=null; }
  if (globalPlayer.state.status !== AudioPlayerStatus.Idle) globalPlayer.stop(true);
  isPlaying = true;

  globalAudioProcess = spawn(ffmpeg, [
    '-i','./shared_audio.mp3',
    '-af', `volume=${globalVolume}`,
    '-f','s16le','-ar','48000','-ac','2','-loglevel','error','pipe:1'
  ], {stdio:['ignore','pipe','pipe']});

  globalAudioProcess.stderr.on('data', d => { const t=d.toString().trim(); if(t&&!globalAudioProcessKilled) console.log('FFmpeg:',t); });
  globalAudioProcess.on('exit', (code,signal) => {
    globalAudioProcessKilled = false;
    if (code!==0 && signal!=='SIGTERM') console.error(`❌ FFmpeg exit: ${code}`);
    globalAudioProcess = null;
    if (isPlaying) setTimeout(()=>{ if(isPlaying) playAudio(); }, 200);
  });
  globalAudioProcess.on('error', e => { console.error('❌ FFmpeg:', e.message); globalAudioProcess=null; });

  const resource = createAudioResource(globalAudioProcess.stdout, { inputType: StreamType.Raw, inlineVolume: false });
  globalPlayer.play(resource);
  return true;
}

playSilence();

// ============================================================
// MIC ROUTING — SINGLE long-lived POST stream → single FFmpeg → all bots
// Browser opens one POST to /mic/upload, keeps it open, sends chunks
// Server pipes the entire request body to a single FFmpeg stdin
// This ensures FFmpeg gets ONE continuous webm stream, not separate files
// ============================================================
function startMicRouting() {
  if (micActive) return;
  micActive = true;
  // Single persistent FFmpeg process — reads webm from stdin, outputs raw PCM
  micFfmpeg = spawn(ffmpeg, [
    '-f', 'webm',   // explicitly tell FFmpeg input is webm
    '-i', 'pipe:0',
    '-af', 'volume=2.0',
    '-f', 's16le',
    '-ar', '48000',
    '-ac', '2',
    '-loglevel', 'error',
    'pipe:1'
  ], { stdio: ['pipe', 'pipe', 'pipe'] });

  micFfmpeg.stderr.on('data', d => { const t=d.toString().trim(); if(t) console.log('Mic FFmpeg:',t); });
  micFfmpeg.on('error', e => { console.error('❌ Mic FFmpeg:', e.message); });
  micFfmpeg.on('exit', () => { if (micActive) startMicRouting(); });
  
  const resource = createAudioResource(micFfmpeg.stdout, { inputType: StreamType.Raw, inlineVolume: false });
  globalPlayer.play(resource);
}

function stopMicRouting() {
  micActive = false;
  if (micStreamReq) {
    try { micStreamReq.destroy(); } catch(e) {}
    micStreamReq = null;
  }
  if (micFfmpeg) {
    try { micFfmpeg.stdin.end(); } catch(e) {}
    try { micFfmpeg.kill(); } catch(e) {}
    micFfmpeg = null;
  }
  playSilence();
}

// ============================================================
// BOTS
// ============================================================
const botsArray = tokens.slice(0,20).map((token,index)=>{
  const client=new Client({checkUpdate:false});
  let vc=null,rp=null,rt=null,kt=null;
  const wfr=()=>{
    if(rp)return rp;
    if(bot.status==='ready'||client.readyTimestamp||client.isReady?.())return Promise.resolve();
    rp=new Promise((res,rej)=>{const o=()=>{c();res();},e=(er)=>{c();rej(er);},c=()=>{client.off('ready',o);client.off('error',e);};client.once('ready',o);client.once('error',e);});return rp;
  };
  const bot={
    client,token,channelId:null,guildId:null,voiceConnection:null,status:'offline',voiceState:'disconnected',lastError:null,needsVerification:false,verificationType:null,
    async joinChannel(tch,tgu){
      if(!tch)return false;
      if(rt){clearTimeout(rt);rt=null;}
      if(vc&&bot.channelId===tch&&vc.state?.status===VoiceConnectionStatus.Ready){bot.voiceState='connected';return true;}
      if(vc){try{vc.destroy()}catch(e){}vc=null;}
      bot.voiceState='connecting';bot.lastError=null;bot.channelId=null;bot.guildId=null;bot.needsVerification=false;bot.verificationType=null;
      try{
        await wfr();
        const ch=await client.channels.fetch(tch);
        if(!ch||!ch.isVoice?.()){bot.lastError='Not voice';bot.voiceState='failed';return false;}
        const gu=tgu?client.guilds.cache.get(tgu)||await client.guilds.fetch(tgu):ch.guild||await client.guilds.fetch(ch.guildId||ch.guild?.id);
        if(!gu){bot.lastError='No guild';bot.voiceState='failed';return false;}
        console.log(`✅ [Bot ${index+1}] Joining ${ch.name}`);
        for(let a=1;a<=3;a++){
          try{
            vc=joinVoiceChannel({channelId:ch.id,guildId:gu.id,adapterCreator:gu.voiceAdapterCreator,group:client.user.id,selfDeaf:globalDeaf,selfMute:globalMute});
            bot.voiceConnection=vc;vc.subscribe(globalPlayer);
            await entersState(vc,VoiceConnectionStatus.Ready,30000);break;
          }catch(e){vc?.destroy();vc=null;if(a===3)throw e;await new Promise(r=>setTimeout(r,2000));}
        }
        bot.channelId=ch.id;bot.guildId=gu.id;bot.voiceState='connected';bot.lastError=null;
        vc.on('stateChange',(o,n)=>{
          if(n.status===VoiceConnectionStatus.Disconnected||n.status===VoiceConnectionStatus.Destroyed){
            bot.voiceState='disconnected';
            const j=Math.floor(Math.random()*5000)+3000;
            rt=setTimeout(()=>{if(bot.channelId&&bot.guildId)bot.joinChannel(bot.channelId,bot.guildId).catch(()=>{});},j);
          }
        });
        if(kt)clearInterval(kt);
        kt=setInterval(()=>{if(vc&&vc.state.status===VoiceConnectionStatus.Ready)console.log(`💚 [Bot ${index+1}] Active`);},keepAliveMs);
        return true;
      }catch(e){bot.lastError=e?.message||String(e);bot.voiceState='failed';return false;}
    },
    leaveChannel(){if(rt){clearTimeout(rt);rt=null;}if(kt){clearInterval(kt);kt=null;}if(vc){vc.destroy();vc=null;}bot.channelId=null;bot.guildId=null;bot.voiceState='disconnected';},
    shutdown(){if(rt){clearTimeout(rt);rt=null;}if(kt){clearInterval(kt);kt=null;}try{if(vc)vc.destroy();client.destroy();}catch(e){}}
  };
  client.on('ready',async()=>{
    bot.status='ready';
    console.log(`✅ [Bot ${index+1}] ${client.user.tag} ready`);
    if(!autoJoin)return;
    const tc=channelIds[index]||channelIds[0]||null;
    if(!tc)return;
    await bot.joinChannel(tc);
  });
  client.on('error',e=>console.error(`❌ [Bot ${index+1}] Client:`,e));
  bots.push(bot);
  return bot;
});

process.on('unhandledRejection',e=>console.error('❌ Unhandled:',e));
process.on('SIGTERM',()=>{if(globalAudioProcess){globalAudioProcessKilled=true;try{globalAudioProcess.kill()}catch(e){}}stopMicRouting();bots.forEach(b=>b.shutdown());process.exit(0);});
process.on('SIGINT',()=>{if(globalAudioProcess){globalAudioProcessKilled=true;try{globalAudioProcess.kill()}catch(e){}}stopMicRouting();bots.forEach(b=>b.shutdown());process.exit(0);});

Promise.all(bots.map((b,i)=>b.client.login(b.token).then(()=>console.log(`🔐 [Bot ${i+1}] Login`)).catch(e=>{console.error(`❌ [Bot ${i+1}] Login:`,e.message);throw e;}))).catch(()=>{});
console.log(`🚀 ${bots.length} bot(s) on port ${port}`);

// ============================================================
// HTTP SERVER
// ============================================================
const server=http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Transfer-Encoding');
  if(req.method==='OPTIONS'){res.writeHead(200);res.end();return;}

  if(req.url==='/'&&req.method==='GET'){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Multi-Bot Controller</title>
<style>
*{box-sizing:border-box}body{background:#0b1220;color:#e5e7eb;font-family:system-ui,sans-serif;margin:0;padding:24px}
h1{margin:0 0 4px}p{margin:4px 0 16px;color:#9ca3af}input,button{font:inherit}
input[type="text"]{width:100%;max-width:420px;border:1px solid #334155;border-radius:12px;padding:12px 14px;background:#0f172a;color:#e2e8f0;margin-top:10px}
button{cursor:pointer;border:none;padding:12px 16px;border-radius:12px;font-weight:700}
.card{background:rgba(15,23,42,.95);border:1px solid rgba(148,163,184,.15);border-radius:18px;padding:20px;max-width:960px;margin-bottom:20px}
.card h2{margin:0 0 12px;font-size:1.2rem}.row{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0}
.bot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.bot-card{background:#111827;border:1px solid rgba(148,163,184,.12);border-radius:14px;padding:12px;font-size:.85rem}
.bot-card .tag{color:#94a3b8;display:inline-block;min-width:60px}
.ready{color:#22c55e;font-weight:700}.offline{color:#f97316}.connected{color:#38bdf8}.failed{color:#ef4444}
.slider-row{display:flex;align-items:center;gap:14px;margin:10px 0}
.slider-row input[type="range"]{flex:1;accent-color:#f43f5e;height:6px}
.vol-label{font-weight:700;color:#f43f5e;min-width:60px;text-align:right}.msg{margin:12px 0 0;color:#cbd5e1;font-size:.9rem}
  .verify-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin-top:12px}
  .verify-card{background:#111827;border:1px solid rgba(148,163,184,.12);border-radius:14px;padding:16px;font-size:.85rem}
  .verify-card h3{margin:0 0 8px;font-size:1rem;color:#e5e7eb}
  .verify-card .bot-status{color:#94a3b8;font-size:12px;margin-bottom:8px}
  .verify-card .guild{color:#38bdf8;font-size:12px;margin-bottom:10px}
  .verify-card textarea{width:100%;min-height:50px;margin-top:8px;background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:8px;font-family:inherit;font-size:12px;resize:vertical}
  .verify-card button{margin-top:8px;width:100%}
.btn-green{background:#22c55e;color:#0f172a}.btn-blue{background:#0ea5e9;color:#fff}.btn-red{background:#ef4444;color:#fff}
.btn-purple{background:#8b5cf6;color:#fff}.btn-gray{background:#475569;color:#fff}.btn-teal{background:#14b8a6;color:#0f172a}
</style></head><body>
<h1>🎧 Multi-Bot Controller</h1><p>${bots.length} bots</p>
<div class="card"><h2>📡 Voice Channel</h2>
<input id="guildInput" type="text" placeholder="Guild ID"/><input id="channelInput" type="text" placeholder="Voice Channel ID"/>
<div class="row"><button class="btn-green" id="joinBtn">Join</button><button class="btn-blue" id="stayBtn">Rejoin</button><button class="btn-red" id="leaveBtn">Leave All</button><button class="btn-gray" id="refreshBtn">Refresh</button></div>
<div class="msg" id="vcMsg"></div></div>
<div class="card"><h2>🎵 Audio <span class="badge" id="playState">Silence</span></h2>
<input type="file" id="audioFile" accept="audio/*" style="background:#1e293b;border:1px solid #475569;border-radius:10px;padding:10px;width:100%;color:#e2e8f0;"/>
<div class="slider-row"><span>Volume</span><input type="range" id="volSlider" min="0" max="200" step="1" value="100"/><span class="vol-label" id="volDisplay">1.0x</span></div>
<div class="row">
<button class="btn-purple" id="uploadPlayBtn">⬆ Upload & Play</button>
<button class="btn-blue" id="playSavedBtn">▶ Play Saved</button>
<button class="btn-red" id="stopBtn">⏹ Stop</button>
</div>
<div class="row">
<button class="btn-gray" id="muteBtn">🔇 Mute All</button>
<button class="btn-teal" id="unmuteBtn">🔊 Unmute All</button>
<button class="btn-gray" id="deafBtn">🙉 Deafen</button>
<button class="btn-blue" id="undeafBtn">🙊 Undeafen</button>
</div>
<div class="msg" id="audioMsg"></div></div>
<div class="card"><h2>🤖 Bots <span class="badge" id="botCount">0/0</span></h2><div class="bot-grid" id="botGrid"></div></div>
<div class="card"><h2>🎤 Mic Routing <span class="badge" id="micStatusBadge">Stopped</span></h2>
<div class="row">
<button class="btn-green" id="startMic">▶ Start Mic</button>
<button class="btn-red" id="stopMic">⏹ Stop Mic</button>
</div>
<div class="msg" id="micMsg"></div>
</div>
<div class="card"><h2>🔐 Verification Sessions</h2>
<p>Click a bot session button below to open a dedicated verification page.</p>
<div class="msg">Each bot gets its own verification session grid.</div>
</div>
<script>
const vcMsg=document.getElementById('vcMsg'),audioMsg=document.getElementById('audioMsg'),botGrid=document.getElementById('botGrid'),botCount=document.getElementById('botCount'),playState=document.getElementById('playState');
const guildInput=document.getElementById('guildInput'),channelInput=document.getElementById('channelInput');
const micMsg=document.getElementById('micMsg'),micStatusBadge=document.getElementById('micStatusBadge');
let mediaRecorder=null;let mediaStream=null;let uploadController=null;
function render(d){if(!d||!d.bots){vcMsg.textContent='No data';return}
botCount.textContent=d.bots.filter(b=>b.ready).length+'/'+d.bots.length;playState.textContent=d.isPlaying?'🔊 Playing':'🔇 Silence';micStatusBadge.textContent=d.micActive?'Active':'Stopped';
botGrid.innerHTML=d.bots.map(b=>{const sc=b.ready?'ready':'offline';const vc=b.connected?'connected':(b.voiceState==='failed'?'failed':'');
return '<div class="bot-card"><div><strong>#'+b.index+'</strong> <span class="'+sc+'">'+(b.ready?'ON':'OFF')+'</span></div><div><span class="tag">VC:</span><span class="'+vc+'">'+(b.connected?'✅':(b.voiceState==='failed'?'❌':'⏳'))+'</span></div><div><span class="tag">Ch:</span>'+(b.channelId?b.channelId.slice(0,8)+'..':'-')+'</div><div><span class="tag">Verif:</span>'+(b.needsVerification?'<span class="failed">Needed</span>':'<span class="ready">OK</span>')+'</div>'+(b.lastError?'<div style="color:#ef4444;font-size:.75rem;margin-top:4px;">'+b.lastError.slice(0,40)+'</div>':'')+'<div class="row"><button class="btn-gray" onclick="openSession('+b.index+')">Session</button></div></div>'}).join('')}
async function fetchStatus(){try{const r=await fetch('/status');const d=await r.json();render(d)}catch(e){vcMsg.textContent='Fetch failed'}}
document.getElementById('joinBtn').onclick=async()=>{const ch=channelInput.value.trim();if(!ch){vcMsg.textContent='Enter channel ID';return}
vcMsg.textContent='Joining...';const r=await fetch('/join',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({channelId:ch,guildId:guildInput.value.trim()})});const d=await r.json();vcMsg.textContent=d.status||'Done';fetchStatus()}
document.getElementById('stayBtn').onclick=async()=>{vcMsg.textContent='Rejoining...';const r=await fetch('/stay',{method:'POST'});const d=await r.json();vcMsg.textContent=d.status;fetchStatus()}
document.getElementById('leaveBtn').onclick=async()=>{vcMsg.textContent='Leaving...';const r=await fetch('/leave',{method:'POST'});const d=await r.json();vcMsg.textContent=d.status;fetchStatus()}
document.getElementById('refreshBtn').onclick=fetchStatus;
const vs=document.getElementById('volSlider'),vd=document.getElementById('volDisplay')
vs.oninput=()=>{vd.textContent=(vs.value/100).toFixed(2)+'x'}
vs.onchange=async()=>{const v=vs.value/100;await fetch('/audio/volume',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({volume:v})})}
document.getElementById('uploadPlayBtn').onclick=async()=>{const f=document.getElementById('audioFile').files[0];if(!f){audioMsg.textContent='Select a file';return}
audioMsg.textContent='Uploading...';const up=await fetch('/audio/upload',{method:'POST',body:f});if(!up.ok){audioMsg.textContent='Upload failed';return}
audioMsg.textContent='Playing...';const pl=await fetch('/audio/play',{method:'POST'});const pd=await pl.json();audioMsg.textContent=pd.status||pd.error;fetchStatus()}
document.getElementById('playSavedBtn').onclick=async()=>{audioMsg.textContent='Playing...';const r=await fetch('/audio/play',{method:'POST'});const d=await r.json();audioMsg.textContent=d.status||d.error;fetchStatus()}
document.getElementById('stopBtn').onclick=async()=>{audioMsg.textContent='Stopping...';const r=await fetch('/audio/stop',{method:'POST'});const d=await r.json();audioMsg.textContent=d.status;fetchStatus()}
async function va(u,m){audioMsg.textContent=m;const r=await fetch(u,{method:'POST'});const d=await r.json();audioMsg.textContent=d.status||d.error;fetchStatus()}
document.getElementById('muteBtn').onclick=()=>va('/audio/mute','Muting...')
document.getElementById('unmuteBtn').onclick=()=>va('/audio/unmute','Unmuting...')
document.getElementById('deafBtn').onclick=()=>va('/audio/deafen','Deafening...')
document.getElementById('undeafBtn').onclick=()=>va('/audio/undeafen','Undeafening...')
document.getElementById('startMic').onclick=async()=>{try{const startRes=await fetch('/mic/start',{method:'POST'});if(!startRes.ok){micMsg.textContent='Server mic start failed';return}mediaStream=await navigator.mediaDevices.getUserMedia({audio:true});mediaRecorder=new MediaRecorder(mediaStream,{mimeType:'audio/webm;codecs=opus'});const stream=new ReadableStream({start(controller){mediaRecorder.ondataavailable=async(e)=>{if(e.data.size>0){try{const buffer=await e.data.arrayBuffer();controller.enqueue(new Uint8Array(buffer));}catch(err){console.error('Mic chunk enqueue failed',err);}}};mediaRecorder.onstop=()=>controller.close();mediaRecorder.onerror=(event)=>{console.error('MediaRecorder error',event.error);controller.error(event.error);};},cancel(reason){console.log('Mic stream cancelled',reason);if(mediaRecorder&&mediaRecorder.state!=='inactive')mediaRecorder.stop();}});uploadController=new AbortController();fetch('/mic/upload',{method:'POST',headers:{'Content-Type':'audio/webm'},body:stream,signal:uploadController.signal}).catch(err=>{if(err.name!=='AbortError')console.error('Mic upload failed',err);});mediaRecorder.start(1000);micMsg.textContent='🔴 Mic streaming continuously...';}catch(e){micMsg.textContent='❌ Error: '+e.message;}} 
document.getElementById('stopMic').onclick=async()=>{if(mediaRecorder){mediaRecorder.stop();if(mediaStream){mediaStream.getTracks().forEach(t=>t.stop());mediaStream=null;}}if(uploadController){uploadController.abort();uploadController=null;}micMsg.textContent='⏹ Stopped';await fetch('/mic/stop',{method:'POST'});}
function openSession(idx){window.open('/session/'+idx,'_blank')}
fetchStatus();setInterval(fetchStatus,10000)
</script></body></html>`);
    return;
  }

  if(req.url==='/health'&&req.method==='GET'){res.writeHead(200);res.end(JSON.stringify({status:'ok',bots:bots.length}));return;}

  if(req.url==='/audio/upload'&&req.method==='POST'){
    const ws=fs.createWriteStream('./shared_audio.mp3');
    req.pipe(ws);ws.on('finish',()=>{res.writeHead(200);res.end(JSON.stringify({status:'uploaded'}));});
    ws.on('error',err=>{res.writeHead(500);res.end(JSON.stringify({error:err.message}));});return;
  }

  if(req.url==='/audio/play'&&req.method==='POST'){
    if(!fs.existsSync('./shared_audio.mp3')){res.writeHead(400);res.end(JSON.stringify({error:'No audio'}));return;}
    try{if(!await playAudio())throw new Error('Failed');res.writeHead(200);res.end(JSON.stringify({status:'playing'}));}catch(err){res.writeHead(500);res.end(JSON.stringify({error:err.message}));}
    return;
  }

  if(req.url==='/audio/stop'&&req.method==='POST'){playSilence();res.writeHead(200);res.end(JSON.stringify({status:'stopped'}));return;}

  if(req.url==='/audio/volume'&&req.method==='POST'){
    try{const b=await parseJSONBody(req);const v=parseFloat(b.volume);if(!isNaN(v)&&v>=0&&v<=2.0){globalVolume=v;if(isPlaying)playAudio();}res.writeHead(200);res.end(JSON.stringify({status:'ok',volume:globalVolume}));}
    catch(e){res.writeHead(500);res.end(JSON.stringify({error:e.message}));}return;
  }

  const updateVS=(mute,deaf)=>{globalMute=mute;globalDeaf=deaf;for(const b of bots){if(b.channelId&&b.guildId&&b.voiceState==='connected'&&b.voiceConnection){try{const g=b.client.guilds.cache.get(b.guildId);if(g){const vc=joinVoiceChannel({channelId:b.channelId,guildId:b.guildId,adapterCreator:g.voiceAdapterCreator,group:b.client.user.id,selfDeaf:globalDeaf,selfMute:globalMute});b.voiceConnection=vc;vc.subscribe(globalPlayer);}}catch(e){}}}};
  if(req.url==='/audio/mute'&&req.method==='POST'){updateVS(true,globalDeaf);res.writeHead(200);res.end(JSON.stringify({status:'muted'}));return;}
  if(req.url==='/audio/unmute'&&req.method==='POST'){updateVS(false,globalDeaf);res.writeHead(200);res.end(JSON.stringify({status:'unmuted'}));return;}
  if(req.url==='/audio/deafen'&&req.method==='POST'){updateVS(globalMute,true);res.writeHead(200);res.end(JSON.stringify({status:'deafened'}));return;}
  if(req.url==='/audio/undeafen'&&req.method==='POST'){updateVS(globalMute,false);res.writeHead(200);res.end(JSON.stringify({status:'undeafened'}));return;}

  if(req.url==='/status'&&req.method==='GET'){
    res.writeHead(200,{'Content-Type':'application/json'});
    res.end(JSON.stringify({isPlaying,globalVolume,bots:bots.map((b,i)=>({index:i+1,ready:b.status==='ready',connected:b.voiceState==='connected',voiceState:b.voiceState,channelId:b.channelId,guildId:b.guildId,lastError:b.lastError,needsVerification:b.needsVerification,verificationType:b.verificationType})),verifications:verificationQueue.map(v=>({botIndex:v.botIndex,type:v.type,guildName:v.guildName})),micActive}));
    return;
  }

  if(req.url==='/stay'&&req.method==='POST'){for(const b of bots){if(b.channelId&&b.guildId)b.joinChannel(b.channelId,b.guildId);}res.writeHead(200);res.end(JSON.stringify({status:'rejoining'}));return;}

  if(req.url==='/join'&&req.method==='POST'){
    try{const b=await parseJSONBody(req);const ch=b.channelId||b.channel||null;const gu=b.guildId||b.guild||null;if(!ch){res.writeHead(400);res.end(JSON.stringify({error:'channelId required'}));return;}
    const results=await Promise.all(bots.map(async(bot,i)=>{if(bot.status!=='ready')return{bot:i+1,success:false,error:'Offline'};const s=await bot.joinChannel(ch,gu);return{bot:i+1,success:s,connected:bot.voiceState==='connected',error:bot.lastError};}));
    res.writeHead(200);res.end(JSON.stringify({status:'done',results}));}catch(e){res.writeHead(500);res.end(JSON.stringify({error:e.message}));}return;
  }

  const sessionMatch = req.url.match(/^\/session\/(\d+)(?:\/(invite|solve|skip))?$/);
  if(sessionMatch){
    const idx = Number(sessionMatch[1]) - 1;
    if(idx < 0 || idx >= bots.length){res.writeHead(404);res.end(JSON.stringify({error:'Invalid session'}));return;}
    const bot = bots[idx];
    const method = sessionMatch[2];

    if(!method && req.method==='GET'){
      const queued = verificationQueue.find(v=>v.botIndex===idx+1);
      res.writeHead(200,{'Content-Type':'text/html'});
      res.end(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Bot Session ${idx+1}</title>
<style>*{box-sizing:border-box}body{background:#0b1220;color:#e5e7eb;font-family:system-ui,sans-serif;margin:0;padding:24px}h1{margin:0 0 12px}p{margin:6px 0 12px;color:#cbd5e1}input,button,textarea{font:inherit}input[type="text"],textarea{width:100%;max-width:420px;border:1px solid #334155;border-radius:12px;padding:12px 14px;background:#0f172a;color:#e2e8f0;margin-top:10px}button{cursor:pointer;border:none;padding:12px 16px;border-radius:12px;font-weight:700;margin-top:10px} .card{background:rgba(15,23,42,.95);border:1px solid rgba(148,163,184,.15);border-radius:18px;padding:20px;max-width:960px;margin-bottom:20px}.btn-green{background:#22c55e;color:#0f172a}.btn-blue{background:#0ea5e9;color:#fff}.btn-red{background:#ef4444;color:#fff}.msg{margin:12px 0 0;color:#cbd5e1;font-size:.9rem}</style></head><body>
<h1>Bot Session ${idx+1}</h1>
<div class="card"><p>Status: ${bot.status}</p><p>Voice state: ${bot.voiceState}</p><p>Channel: ${bot.channelId || 'N/A'}</p><p>Guild: ${bot.guildId || 'N/A'}</p><p>Verification: ${queued ? 'Needed' : (bot.needsVerification ? 'Needed' : 'OK')}</p><p>Queue target: ${queued ? queued.guildName : 'N/A'}</p></div>
<div class="card"><h2>Invite / Captcha</h2>
<input id="inviteInput" type="text" placeholder="discord.gg/xxxxxx"/>
<div class="row"><button class="btn-green" id="joinInviteBtn">Invite Bot</button></div>
<div class="row"><textarea id="captchaSolution" placeholder="Paste captcha solution"></textarea></div>
<div class="row"><button class="btn-blue" id="solveBtn">Solve Captcha</button><button class="btn-red" id="skipBtn">Skip</button></div>
<div class="msg" id="sessionMsg"></div>
</div>
<script>
const sessionMsg=document.getElementById('sessionMsg');
document.getElementById('joinInviteBtn').onclick=async()=>{const inv=document.getElementById('inviteInput').value.trim();if(!inv){sessionMsg.textContent='Enter invite';return}sessionMsg.textContent='Inviting...';const r=await fetch('/session/${idx+1}/invite',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({invite:inv})});const d=await r.json();sessionMsg.textContent=d.status||d.error;};
document.getElementById('solveBtn').onclick=async()=>{const txt=document.getElementById('captchaSolution').value.trim();if(!txt){sessionMsg.textContent='Enter solution';return}sessionMsg.textContent='Solving...';const r=await fetch('/session/${idx+1}/solve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({solution:txt})});const d=await r.json();sessionMsg.textContent=d.status||d.error;};
document.getElementById('skipBtn').onclick=async()=>{sessionMsg.textContent='Skipping...';const r=await fetch('/session/${idx+1}/skip',{method:'POST'});const d=await r.json();sessionMsg.textContent=d.status||d.error;};
</script>
</body></html>`);
      return;
    }

    if(method==='invite'&&req.method==='POST'){
      try{
        const b=await parseJSONBody(req);
        const inviteCode=extractInviteCode(b.invite);
        if(!inviteCode){res.writeHead(400);res.end(JSON.stringify({error:'Invalid invite'}));return;}
        if(bot.status!=='ready'){res.writeHead(400);res.end(JSON.stringify({error:'Bot offline'}));return;}
        try{
          if(!bot.client.api) throw new Error('Discord API not available');
          await bot.client.api.invites(inviteCode).post();
          res.writeHead(200);res.end(JSON.stringify({status:'Invite sent'}));
        }catch(err){
          const message=(err?.message||String(err)).slice(0,120);
          if(!verificationQueue.some(v=>v.botIndex===idx+1)){
            verificationQueue.push({botIndex:idx+1,type:'Captcha Needed',guildName:'discord.gg/'+inviteCode});
          }
          bot.needsVerification=true;bot.verificationType='Captcha';
          res.writeHead(200);res.end(JSON.stringify({status:'Captcha needed',error:message}));
        }
      }catch(e){res.writeHead(500);res.end(JSON.stringify({error:e.message}));}
      return;
    }

    if(method==='solve'&&req.method==='POST'){
      try{const b=await parseJSONBody(req);const qi=verificationQueue.findIndex(v=>v.botIndex===idx+1);if(qi>=0)verificationQueue.splice(qi,1);bot.needsVerification=false;bot.verificationType=null;res.writeHead(200);res.end(JSON.stringify({status:'Solved'}));}
      catch(e){res.writeHead(500);res.end(JSON.stringify({error:e.message}));}
      return;
    }

    if(method==='skip'&&req.method==='POST'){
      try{const qi=verificationQueue.findIndex(v=>v.botIndex===idx+1);if(qi>=0)verificationQueue.splice(qi,1);bot.needsVerification=false;bot.verificationType=null;res.writeHead(200);res.end(JSON.stringify({status:'Skipped'}));}
      catch(e){res.writeHead(500);res.end(JSON.stringify({error:e.message}));}
      return;
    }
  }

  if(req.url==='/leave'&&req.method==='POST'){for(const b of bots)b.leaveChannel();res.writeHead(200);res.end(JSON.stringify({status:'left'}));return;}

  // ================================================================
  // MIC PAGE — SINGLE continuous POST stream to server
  // Browser opens ONE POST request and keeps it open
  // MediaRecorder writes chunks to this single request
  // ================================================================
  if(req.url==='/mic'&&req.method==='GET'){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Mic Routing</title>
<style>
*{box-sizing:border-box}body{background:#0b1220;color:#e5e7eb;font-family:system-ui,sans-serif;margin:0;padding:24px}
h1{margin:0 0 16px}p{margin:4px 0 16px;color:#9ca3af}button{font:inherit;cursor:pointer;border:none;padding:12px 16px;border-radius:12px;font-weight:700}
.card{background:rgba(15,23,42,.95);border:1px solid rgba(148,163,184,.15);border-radius:18px;padding:20px;max-width:960px;margin-bottom:20px}
.btn-green{background:#22c55e;color:#0f172a}.btn-red{background:#ef4444;color:#fff}.btn-blue{background:#0ea5e9;color:#fff}.msg{margin:12px 0 0;color:#cbd5e1;font-size:.9rem}
</style></head><body>
<h1>🎤 Mic Routing</h1>
<div class="card">
<p>Your mic audio streams continuously through ONE connection to all bots.</p>
<div class="row">
<button class="btn-green" id="startMic">▶ Start Mic</button>
<button class="btn-red" id="stopMic">⏹ Stop Mic</button>
</div>
<div class="msg" id="micMsg"></div>
<div class="msg" id="micStatus"></div>
</div>
<script>
const micMsg=document.getElementById('micMsg'),micStatus=document.getElementById('micStatus');
let mediaRecorder=null;let mediaStream=null;let uploadController=null;
document.getElementById('startMic').onclick=async()=>{
  try{
    const startRes=await fetch('/mic/start',{method:'POST'});
    if(!startRes.ok){micMsg.textContent='Server mic start failed';return}

    mediaStream=await navigator.mediaDevices.getUserMedia({audio:true});
    mediaRecorder=new MediaRecorder(mediaStream,{mimeType:'audio/webm;codecs=opus'});

    const stream = new ReadableStream({
      start(controller) {
        mediaRecorder.ondataavailable = async(e) => {
          if (e.data.size > 0) {
            try {
              const buffer = await e.data.arrayBuffer();
              controller.enqueue(new Uint8Array(buffer));
            } catch (err) {
              console.error('Mic chunk enqueue failed', err);
            }
          }
        };
        mediaRecorder.onstop = () => controller.close();
        mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error', event.error);
          controller.error(event.error);
        };
      },
      cancel(reason) {
        console.log('Mic stream cancelled', reason);
        if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      }
    });

    uploadController = new AbortController();
    fetch('/mic/upload',{
      method:'POST',
      headers:{'Content-Type':'audio/webm'},
      body: stream,
      signal: uploadController.signal
    }).catch(err=>{if(err.name !== 'AbortError') console.error('Mic upload failed',err);});

    mediaRecorder.start(1000);
    micMsg.textContent='🔴 Mic streaming continuously...';
  }catch(e){micMsg.textContent='❌ Error: '+e.message;}
};
document.getElementById('stopMic').onclick=async()=>{
  if(mediaRecorder){mediaRecorder.stop();if(mediaStream){mediaStream.getTracks().forEach(t=>t.stop());mediaStream=null;}}
  if(uploadController){uploadController.abort();uploadController=null;}
  micMsg.textContent='⏹ Stopped';await fetch('/mic/stop',{method:'POST'});
};
async function fetchStatus(){try{const r=await fetch('/status');const d=await r.json();micStatus.textContent='Mic: '+(d.micActive?'🔴 Active':'⏹ Stopped')}catch(e){}}
fetchStatus();setInterval(fetchStatus,2000)
</script></body></html>`);
    return;
  }

  // ================================================================
  // MIC START — spawn single persistent FFmpeg
  // ================================================================
  if(req.url==='/mic/start'&&req.method==='POST'){
    startMicRouting();
    res.writeHead(200);res.end(JSON.stringify({status:'mic started'}));return;
  }

  // ================================================================
  // MIC STOP — kill FFmpeg
  // ================================================================
  if(req.url==='/mic/stop'&&req.method==='POST'){
    stopMicRouting();
    res.writeHead(200);res.end(JSON.stringify({status:'mic stopped'}));return;
  }

  // ================================================================
  // MIC UPLOAD — continuous stream, pipe directly to FFmpeg stdin
  // Browser sends continuous webm data through a single long-lived POST
  // ================================================================
  if(req.url==='/mic/upload'&&req.method==='POST'){
    if(!micActive){startMicRouting();}
    if(micFfmpeg&&micFfmpeg.stdin&&!micFfmpeg.stdin.destroyed){
      req.pipe(micFfmpeg.stdin,{ end:false });
    }
    req.on('end',()=>{
      if(!res.writableEnded){
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify({status:'streaming'}));
      }
    });
    req.on('error',(err)=>{
      if(!res.writableEnded){
        res.writeHead(500,{'Content-Type':'application/json'});
        res.end(JSON.stringify({error:err.message}));
      }
    });
    return;
  }

  res.writeHead(404);res.end(JSON.stringify({error:'not found'}));
});

server.listen(port,()=>console.log(`🌐 HTTP on port ${port}`));
setInterval(()=>process.stdout.write('.'),60000);

function extractInviteCode(input){
  if(!input)return null;
  if(input.includes('discord.gg/'))return input.split('discord.gg/')[1].split('?')[0].trim();
  if(input.includes('discord.com/invite/'))return input.split('discord.com/invite/')[1].split('?')[0].trim();
  return input.trim();
}