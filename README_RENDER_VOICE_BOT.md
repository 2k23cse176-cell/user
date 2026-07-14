# Render Voice Bot Deployment

This repo now includes a standalone voice-only bot entrypoint.

## What runs on Render
Render should run:
- node voice-bot-only.js

## Required environment variables
Set these in Render > Environment (do not put real tokens in GitHub):
- BOT_TOKENS: your Discord tokens separated by commas
- AUTO_JOIN: set to false if you want the bots to stay online without joining a channel automatically
- KEEPALIVE_MS: optional, default 15000

If you later want a bot to join a specific channel from Render, you can add:
- VOICE_CHANNEL_IDS: optional voice channel IDs separated by commas

For local testing, copy .env.example to .env and fill the values there.

## Render setup
1. Create a new Worker Service on Render.
2. Connect this GitHub repository.
3. Use build command:
   - npm install
4. Use start command:
   - node voice-bot-only.js
5. Add environment variables:
   - BOT_TOKENS
   - AUTO_JOIN
   - KEEPALIVE_MS
6. Deploy.

## Notes
- This deploys only the voice bot process.
- It does not require the full Electron app to run.
- If the process restarts, the account will reconnect automatically when the bot starts again.
