const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

function parseList(value) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const keepAliveMs = parseInt(process.env.KEEPALIVE_MS || '15000', 10);
const rawTokens = process.env.BOT_TOKENS || process.env.BOT_TOKEN || '';
const rawChannels = process.env.VOICE_CHANNEL_IDS || process.env.VOICE_CHANNEL_ID || process.env.CHANNEL_ID || '';
const tokens = parseList(rawTokens);
const channelIds = parseList(rawChannels);

if (tokens.length === 0) {
  console.error('❌ Missing BOT_TOKEN or BOT_TOKENS');
  process.exit(1);
}

const bots = tokens.slice(0, 20).map((token, index) => {
  const client = new Client({ checkUpdate: false });
  let activeConnection = null;
  let keepAliveTimer = null;

  function clearKeepAlive() {
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
  }

  function startKeepAlive() {
    clearKeepAlive();
    keepAliveTimer = setInterval(() => {
      if (activeConnection && activeConnection.state.status === VoiceConnectionStatus.Ready) {
        try {
          activeConnection.setSpeaking(true);
          setTimeout(() => activeConnection?.setSpeaking(false), 100);
        } catch (err) {
          console.warn(`⚠️ [Bot ${index + 1}] Keepalive warning: ${err.message}`);
        }
      }
    }, keepAliveMs);
  }

  async function joinTargetChannel() {
    const targetChannelId = channelIds[index] || channelIds[0] || null;

    if (!targetChannelId) {
      console.error(`❌ [Bot ${index + 1}] Missing voice channel ID`);
      return;
    }

    try {
      const channel = await client.channels.fetch(targetChannelId);

      if (!channel || !channel.isVoice?.()) {
        console.error(`❌ [Bot ${index + 1}] Channel ${targetChannelId} was not found or is not a voice channel`);
        return;
      }

      activeConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      });

      activeConnection.on(VoiceConnectionStatus.Disconnected, () => {
        console.warn(`⚠️ [Bot ${index + 1}] Voice connection disconnected; waiting before retry...`);
        clearKeepAlive();
      });

      activeConnection.on(VoiceConnectionStatus.Destroyed, () => {
        clearKeepAlive();
      });

      startKeepAlive();
      console.log(`✅ [Bot ${index + 1}] Joined voice channel ${channel.name} (${channel.id})`);
    } catch (error) {
      console.error(`❌ [Bot ${index + 1}] Failed to join voice channel: ${error.message}`);
      setTimeout(() => joinTargetChannel(), 5000);
    }
  }

  client.on('ready', async () => {
    console.log(`✅ [Bot ${index + 1}] ${client.user.tag} is ready`);
    await joinTargetChannel();
  });

  client.on('error', (error) => {
    console.error(`❌ [Bot ${index + 1}] Client error:`, error);
  });

  return { client, token, shutdown: () => { clearKeepAlive(); if (activeConnection) activeConnection.destroy(); client.destroy(); } };
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
});

process.on('SIGTERM', () => {
  bots.forEach((bot) => bot.shutdown());
  process.exit(0);
});

bots.forEach((bot, index) => {
  bot.client.login(bot.token).catch((error) => {
    console.error(`❌ [Bot ${index + 1}] Login failed:`, error.message);
  });
});

console.log(`🚀 Starting ${bots.length} voice bot(s) from BOT_TOKENS/BOT_TOKEN`);
