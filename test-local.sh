#!/bin/bash
# Local Bot Testing Script

echo "🤖 Discord Bot 24/7 - Local Test"
echo "================================"

# Check if Discord tokens are set
if [ -z "$DISCORD_TOKENS" ]; then
  echo "❌ Error: DISCORD_TOKENS environment variable not set"
  echo ""
  echo "Set it like this:"
  echo "  export DISCORD_TOKENS=token1,token2,token3"
  echo ""
  exit 1
fi

# Check if whitelisted users are set
if [ -z "$WHITELISTED_USERS" ]; then
  echo "⚠️  Warning: WHITELISTED_USERS not set. All users can control bots."
  echo ""
  echo "Set it like this:"
  echo "  export WHITELISTED_USERS=userid1,userid2,userid3"
fi

echo "✅ Environment variables set"
echo ""
echo "Starting bot launcher..."
echo "Hit Ctrl+C to stop"
echo ""

NODE_ENV=development node bot-launcher.js
