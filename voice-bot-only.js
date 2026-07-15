const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType } = require('@discordjs/voice');
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
    async joinChannel(targetChannelId, targetGuildId) {
      if (!targetChannelId) return;
      if (voiceConnection && bot.channelId === targetChannelId) {
        console.log(`ℹ️ [Bot ${index + 1}] Already in channel ${targetChannelId}`);
        return;
      }

      if (voiceConnection) {
        try {
          voiceConnection.destroy();
          audioPlayer?.stop();
        } catch (e) {}
      }

      try {
        const channel = await client.channels.fetch(targetChannelId);
        if (!channel || !channel.isVoice?.()) {
          console.error(`❌ [Bot ${index + 1}] Channel ${targetChannelId} was not found or is not a voice channel`);
          return;
        }

        const guild = targetGuildId
          ? client.guilds.cache.get(targetGuildId) || await client.guilds.fetch(targetGuildId)
          : channel.guild || await client.guilds.fetch(channel.guildId || channel.guild?.id);
        if (!guild) {
          console.error(`❌ [Bot ${index + 1}] Could not resolve guild for ${channel.id}`);
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

        bot.channelId = channel.id;
        bot.guildId = guild.id;

        voiceConnection.on('stateChange', (oldState, newState) => {
          console.log(`🔌 [Bot ${index + 1}] Voice state: ${oldState.status} -> ${newState.status}`);
          if (newState.status === 'disconnected' || newState.status === 'destroyed') {
            console.error(`❌ [Bot ${index + 1}] Voice disconnected, attempting reconnect...`);
            setTimeout(() => bot.joinChannel(targetChannelId, targetGuildId), 5000);
          }
        });

        audioPlayer.on('error', error => {
          console.error(`❌ [Bot ${index + 1}] Audio player error:`, error.message);
        });

        setInterval(() => {
          if (voiceConnection && voiceConnection.state.status === 'ready') {
            console.log(`💚 [Bot ${index + 1}] Voice channel still active`);
          }
        }, keepAliveMs);
      } catch (error) {
        console.error(`❌ [Bot ${index + 1}] Join failed: ${error.message}`);
      }
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

const server = http.createServer(async (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
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
    button { cursor:pointer; border:none; padding:14px 18px; border-radius:14px; font-weight:700; letter-spacing:.02em; }
    .row { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px; }
    .card { background:rgba(17,24,39,.95); border:1px solid rgba(148,163,184,.15); border-radius:18px; padding:18px; min-width:280px; flex:1; }
    .bot { background:#111827; border:1px solid rgba(148,163,184,.12); border-radius:16px; padding:14px; margin-bottom:12px; }
    .bot span { display:inline-block; min-width:80px; color:#94a3b8; }
    .status-ready { color:#22c55e; }
    .status-offline { color:#f97316; }
    .status-vc { color:#38bdf8; }
    .actions { display:flex; flex-wrap:wrap; gap:10px; }
    .actions button { flex:1 1 160px; }
    a { color:#38bdf8; }
  </style>
</head>
<body>
  <h1>Render Bot Monitor</h1>
  <p>This page monitors the hosted voice bots on Render. Use the buttons to keep them in VC or make them leave.</p>
  <div class="actions">
    <button id="stay" style="background:#22c55e;color:#0f172a;">Stay in VC</button>
    <button id="leave" style="background:#ef4444;color:#fff;">Leave VC</button>
    <button id="refresh" style="background:#2563eb;color:#fff;">Refresh Status</button>
  </div>
  <div id="message" style="margin:18px 0 0;color:#cbd5e1;"></div>
  <div id="bots"></div>
  <script>
    const statusEl = document.getElementById('message');
    const botsEl = document.getElementById('bots');

    const renderStatus = (data) => {
      if (!data || !data.bots) {
        statusEl.textContent = 'Unable to load bot status.';
        return;
      }
      const count = data.bots.length;
      statusEl.textContent = 'Loaded ' + count + ' bot' + (count !== 1 ? 's' : '') + '.';
      botsEl.innerHTML = data.bots.map(function(bot) {
        return '<div class="bot">'
          + '<div><strong>Bot ' + bot.index + '</strong></div>'
          + '<div><span>Status:</span><span class="' + (bot.ready ? 'status-ready' : 'status-offline') + '">' + (bot.ready ? 'Ready' : 'Offline') + '</span></div>'
          + '<div><span>Channel:</span><span>' + (bot.channelId || 'None') + '</span></div>'
          + '<div><span>Guild:</span><span>' + (bot.guildId || 'None') + '</span></div>'
          + '</div>';
      }).join('');
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

    document.getElementById('stay').addEventListener('click', async () => {
      statusEl.textContent = 'Keeping bots in VC...';
      const res = await fetch('/stay', { method: 'POST' });
      const data = await res.json();
      statusEl.textContent = data.status || 'Stay in VC requested';
      fetchStatus();
    });

    document.getElementById('leave').addEventListener('click', async () => {
      statusEl.textContent = 'Leaving VC...';
      const res = await fetch('/leave', { method: 'POST' });
      const data = await res.json();
      statusEl.textContent = data.status || 'Leave requested';
      fetchStatus();
    });

    document.getElementById('refresh').addEventListener('click', fetchStatus);
    fetchStatus();
    setInterval(fetchStatus, 10000);
  </script>
</body>
</html>`);
    return;
  }

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', bots: bots.length }));
    return;
  }

  if (req.url === '/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      bots: bots.map((bot, index) => ({
        index: index + 1,
        ready: bot.status === 'ready',
        channelId: bot.channelId,
        guildId: bot.guildId,
      }))
    }));
    return;
  }

  if (req.url === '/stay' && req.method === 'POST') {
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
      const body = await parseJSONBody(req);
      const targetChannelId = body.channelId || body.channel || null;
      const targetGuildId = body.guildId || body.guild || null;
      if (!targetChannelId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'channelId is required' }));
        return;
      }

      for (const bot of bots) {
        bot.joinChannel(targetChannelId, targetGuildId);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'joining', channelId: targetChannelId, guildId: targetGuildId }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
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
