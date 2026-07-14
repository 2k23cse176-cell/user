const { Client } = require('discord.js-selfbot-v13');

function parseList(value) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const rawTokens = process.env.BOT_TOKENS || process.env.BOT_TOKEN || '';
const tokens = parseList(rawTokens);
const autoJoin = (process.env.AUTO_JOIN || 'false').toLowerCase() === 'true';
const rawChannels = process.env.VOICE_CHANNEL_IDS || process.env.VOICE_CHANNEL_ID || process.env.CHANNEL_ID || '';
const channelIds = parseList(rawChannels);

if (tokens.length === 0) {
  console.error('❌ Missing BOT_TOKEN or BOT_TOKENS');
  process.exit(1);
}

const bots = tokens.slice(0, 20).map((token, index) => {
  const client = new Client({ checkUpdate: false });

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

    try {
      const channel = await client.channels.fetch(targetChannelId);
      if (!channel || !channel.isVoice?.()) {
        console.error(`❌ [Bot ${index + 1}] Channel ${targetChannelId} was not found or is not a voice channel`);
        return;
      }

      console.log(`✅ [Bot ${index + 1}] Auto-join requested for ${channel.name} (${channel.id})`);
    } catch (error) {
      console.error(`❌ [Bot ${index + 1}] Auto-join failed: ${error.message}`);
    }
  });

  client.on('error', (error) => {
    console.error(`❌ [Bot ${index + 1}] Client error:`, error);
  });

  return { client, token, shutdown: () => client.destroy() };
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
console.log('🧠 Worker mode: keeping bot sessions alive without exposing an HTTP port');
setInterval(() => {
  process.stdout.write('.');
}, 60000);
