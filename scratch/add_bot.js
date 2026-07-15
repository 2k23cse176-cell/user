const Store = require('electron-store');
const path = require('path');
const os = require('os');

const userDataPath = path.join(os.homedir(), 'AppData/Roaming/discord-workspace-manager');
const store = new Store({ cwd: userDataPath });

// Get token from environment or prompt user
const newToken = process.env.DISCORD_TOKEN || 'YOUR_TOKEN_HERE';
if (newToken === 'YOUR_TOKEN_HERE') {
  console.log('❌ Error: Set DISCORD_TOKEN environment variable');
  process.exit(1);
}
const profiles = store.get('profiles', []);

// Avoid duplicates
if (profiles.some(p => p.token === newToken)) {
    console.log('🌋 ERROR: Token already exists!');
    process.exit(0);
}

const newBot = {
    id: `bot-${Date.now()}`,
    name: `VEERA BOT ${profiles.length + 1}`,
    color: '#5865f2',
    token: newToken,
    email: '',
    password: '',
    createdAt: new Date().toISOString()
};

profiles.push(newBot);
store.set('profiles', profiles);

console.log(`🌋 SUCCESS: Added 5th Bot (${newBot.name})`);
console.log(`🌋 Total Bots now: ${profiles.length}`);
