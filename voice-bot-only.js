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

  async function joinChannel(targetChannelId) {
    try {
      const channel = await client.channels.fetch(targetChannelId);
      if (!channel || !channel.isVoice?.()) {
        console.error(`❌ [Bot ${index + 1}] Channel ${targetChannelId} was not found or is not a voice channel`);
        return;
      }

      const guild = channel.guild || await client.guilds.fetch(channel.guildId || channel.guild?.id);
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

      voiceConnection.on('stateChange', (oldState, newState) => {
        console.log(`🔌 [Bot ${index + 1}] Voice state: ${oldState.status} -> ${newState.status}`);
        if (newState.status === 'disconnected' || newState.status === 'destroyed') {
          console.error(`❌ [Bot ${index + 1}] Voice disconnected, attempting reconnect...`);
          setTimeout(() => joinChannel(targetChannelId), 5000);
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
      console.error(`❌ [Bot ${index + 1}] Auto-join failed: ${error.message}`);
    }
  }

  client.on('ready', async () => {
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

    await joinChannel(targetChannelId);
  });

  client.on('error', (error) => {
    console.error(`❌ [Bot ${index + 1}] Client error:`, error);
  });

  return { client, token, shutdown: () => {
    try {
      if (voiceConnection) voiceConnection.destroy();
      if (audioPlayer) audioPlayer.stop();
      client.destroy();
    } catch (e) {}
  } };
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

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', bots: bots.length }));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('voice-bot-running');
  }
});

server.listen(port, () => {
  console.log(`🌐 Health server listening on port ${port}`);
});

setInterval(() => {
  process.stdout.write('.');
}, 60000);
