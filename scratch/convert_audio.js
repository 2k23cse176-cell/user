const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const path = require('path');

try {
    const input = path.join(__dirname, '../headless/mega_loud.mp3');
    const output = path.join(__dirname, '../headless/mega_loud.wav');
    
    console.log(`🌋 Converting ${input} to ${output}...`);
    execSync(`"${ffmpeg}" -i "${input}" -ar 48000 -ac 1 "${output}" -y`);
    console.log('🌋 SUCCESS: WAV CREATED!');
} catch (e) {
    console.error('🌋 FAILED:', e.message);
}
