# 🤖 Deploy Discord Bot 24/7 on Render

## Step 1: Prepare Your Discord Bot Tokens

You need one Discord token per bot account. Get your tokens:
- Each bot account must be created separately  
- Go to Discord Developer Portal for each
- Copy the token

**Example with 19 tokens:**
```
token1,token2,token3,token4,token5,token6,token7,token8,token9,token10,token11,token12,token13,token14,token15,token16,token17,token18,token19
```

## Step 2: Get Whitelisted User IDs

Only whitelisted users can control the bots via Discord messages.

**How to get a user ID:**
- In Discord, enable Developer Mode (Settings → Advanced → Developer Mode)
- Right-click on a username → Copy User ID

**Example with 19 users:**
```
userid1,userid2,userid3,...,userid19
```

## Step 3: Push to GitHub

```bash
# Initialize git if needed
git init
git add .
git commit -m "Setup Discord bot for Render 24/7 hosting"
git remote add origin https://github.com/YOUR_USERNAME/discord-workspace-manager.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy on Render

1. Go to https://render.com
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your repository
5. Fill in settings:
   - **Name:** `discord-bot-24-7`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node bot-launcher.js`
   - **Plan:** `Free` (or upgrade for better uptime)

## Step 5: Set Environment Variables

In Render dashboard, go to **Environment**:

### Add these variables:

**DISCORD_TOKENS** (comma-separated, no spaces)
```
token1,token2,token3,token4,token5,token6,token7,token8,token9,token10,token11,token12,token13,token14,token15,token16,token17,token18,token19
```

**WHITELISTED_USERS** (comma-separated user IDs, no spaces)
```
userid1,userid2,userid3,userid4,userid5,userid6,userid7,userid8,userid9,userid10,userid11,userid12,userid13,userid14,userid15,userid16,userid17,userid18,userid19
```

6. Click **"Create Web Service"**
7. Wait for deployment (2-3 minutes)
8. Your bot will be **LIVE 24/7** ✅

## Step 6: Bot Commands

Once running, users can send these commands in Discord:

```
!join <inviteLink> <voiceChannelId>   # Join a voice channel
!play or !start or !s                 # Play audio
!stop or !d                           # Stop and disconnect
!status                               # Check bot status
```

## Step 7: Monitor Bot Health

Check if bots are running:
```
https://your-app-name.onrender.com/health
https://your-app-name.onrender.com/bots
```

## Troubleshooting

### Bot not responding?
- ✅ Check that your Discord tokens are correct
- ✅ Ensure user IDs are in WHITELISTED_USERS
- ✅ Check Render logs for errors

### Bot keeps crashing?
- Render automatically restarts crashed bots
- Check for rate limiting (stagger is built-in)
- Verify tokens haven't been invalidated

### Need to add more bots?
1. Get new Discord tokens
2. Update DISCORD_TOKENS variable on Render
3. Redeploy (push to GitHub)

## Scaling Up

On free plan: Max 1 instance, auto-sleeps after 15 min inactivity
- Upgrade to **Starter+** for 24/7 operation without sleep

To upgrade:
1. Go to your service in Render
2. Click **"Settings"** → **"Plan"**
3. Select **Starter+** ($7/month)

## Auto-Redeploy

Every time you push to GitHub, Render auto-deploys! 🚀
```bash
git push origin main
```

---

**Your Discord bot army is now 24/7 live on Render!** 🎉
