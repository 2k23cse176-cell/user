@echo off
REM Local Bot Testing Script for Windows

echo 🤖 Discord Bot 24/7 - Local Test
echo ================================

REM Check if Discord tokens are set
if "%DISCORD_TOKENS%"=="" (
  echo ❌ Error: DISCORD_TOKENS environment variable not set
  echo.
  echo Set it like this:
  echo   set DISCORD_TOKENS=token1,token2,token3
  echo   node bot-launcher.js
  echo.
  pause
  exit /b 1
)

REM Check if whitelisted users are set
if "%WHITELISTED_USERS%"=="" (
  echo ⚠️  Warning: WHITELISTED_USERS not set. All users can control bots.
  echo.
  echo Set it like this:
  echo   set WHITELISTED_USERS=userid1,userid2,userid3
  echo.
)

echo ✅ Environment variables set
echo.
echo Starting bot launcher...
echo Hit Ctrl+C to stop
echo.

set NODE_ENV=development
node bot-launcher.js

pause
