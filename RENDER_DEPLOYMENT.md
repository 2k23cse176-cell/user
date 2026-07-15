# Deploying to Render

## Step 1: Prepare Your Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Prepare for Render deployment"
```

## Step 2: Push to GitHub
- Create a repo on GitHub
- Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/discord-workspace-manager.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Render
1. Go to [https://render.com](https://render.com)
2. Sign up/Log in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Fill in the settings:
   - **Name:** `discord-workspace-manager`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run build:renderer && node server.js`
   - **Plan:** Free (or upgrade for better performance)

6. Click **"Create Web Service"**
7. Wait for deployment (2-3 minutes)
8. Your app will be live at: `https://discord-workspace-manager-xxxx.onrender.com`

## Step 4: Share with 19 Users
Send them the public Render URL - they can access it from any browser!

## Environment Variables (if needed)
Go to **Settings** → **Environment** to add any API keys or secrets.

## Troubleshooting

**Build fails?**
```bash
npm install
npm run build:renderer
```

**Port errors?**
Render automatically uses `PORT` environment variable - already handled in `server.js`

**Need to update?**
Just push to GitHub - Render auto-deploys!
