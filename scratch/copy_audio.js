const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '../headless/mega_loud.wav');
for (let i = 1; i <= 4; i++) {
    const dest = path.join(__dirname, `../headless/mega_loud_${i}.wav`);
    fs.copyFileSync(base, dest);
    console.log(`🌋 Created individual driver: ${dest}`);
}
