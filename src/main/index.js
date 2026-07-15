const { app, BrowserWindow, ipcMain, session, webContents, protocol } = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512');
app.commandLine.appendSwitch('disable-background-timer-throttling');

// OVERRIDE CONSOLE FOR UI LOGS
const originalLog = console.log;
const originalError = console.error;
const broadcastLog = (msg, type = 'info') => {
  if (mainWindow) {
    mainWindow.webContents.send('app-log', { msg, type, time: new Date().toLocaleTimeString() });
  }
};
console.log = (...args) => {
  originalLog(...args);
  broadcastLog(args.join(' '), 'info');
};
console.error = (...args) => {
  originalError(...args);
  broadcastLog(args.join(' '), 'error');
};

// Register protocol as privileged BEFORE app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'veriy-audio', privileges: { secure: true, standard: true, supportFetchAPI: true, bypassCSP: true } }
]);

// --- STABLE NATIVE MODE ---
app.commandLine.appendSwitch('disable-audio-processing');
app.commandLine.appendSwitch('disable-audio-output-resampler');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
// Fake device switches removed to allow real microphone access.

let mainWindow;
let lastVoiceContext = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    backgroundColor: '#1e1f22',
    frame: true
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:3001');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }
}

app.on('ready', () => {
  // 1. REGISTER INDIVIDUAL DRIVER PROTOCOL
  protocol.registerFileProtocol('veriy-audio', (request, callback) => {
    const url = request.url.replace('veriy-audio://', '');
    try {
      return callback({ path: path.normalize(path.join(__dirname, '../../headless', url)) });
    } catch (e) { console.error(e); }
  });

  createWindow();

  // Allow Global Media Injection
  session.defaultSession.setPermissionCheckHandler(() => true);
  session.defaultSession.setPermissionRequestHandler((wc, p, cb) => cb(true));

  // 🌋 NUCLEAR CSP BYPASS: Ensure nothing stops the God Mic injection
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    // Remove CSP headers that might block executeJavaScript
    Object.keys(responseHeaders).forEach(header => {
      if (header.toLowerCase() === 'content-security-policy') {
        delete responseHeaders[header];
      }
    });
    callback({ responseHeaders });
  });

  ipcMain.handle('get-profiles', () => store.get('profiles', []));
  ipcMain.handle('save-profiles', (event, profiles) => {
    store.set('profiles', profiles);
    return true;
  });

  // Handle manual token registration from webviews
  ipcMain.handle('register-token', (event, token) => {
    const t = typeof token === 'string' ? token : (token?.token || '');
    console.log(`🌋 Token Registered: ${t.substring(0, 10)}...`);
    return true; 
  });

  // --- SOUNDPAD BROADCASTER (The Nuclear 4-Bot Fix!) ---
  const { spawn } = require('child_process');
  const activeInjectors = new Map(); // token -> childProcess

  const launchVoiceInjector = (token, channelId, guildId) => {
    if (!token || !channelId || !guildId) return;

    const current = activeInjectors.get(token);
    if (current && current.channelId === channelId) return;

    if (current) {
      try { current.process.kill(); } catch (e) {}
      activeInjectors.delete(token);
    }

    console.log(`🌋 STUTTER-FREE BLAST: Launching for ${token.substring(0, 10)}...`);
    const injector = spawn('node', [
      path.join(__dirname, '../../headless/voice_injector.js'),
      token,
      channelId,
      guildId
    ]);

    activeInjectors.set(token, { process: injector, channelId });

    injector.stdout.on('data', (data) => console.log(`[Bot-Headless]: ${data}`));
    injector.stderr.on('data', (data) => console.error(`[Bot-Headless Error]: ${data}`));
  };

  const joinAllProfilesToCurrentChannel = async (channelId, guildId) => {
    const profiles = store.get('profiles', []);
    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      if (profile.token) {
        launchVoiceInjector(profile.token, channelId, guildId);
        await new Promise(r => setTimeout(r, 1800));
      }
    }
  };

  ipcMain.on('broadcast-audio', async (event, manualData) => {
    // 1. Browser-based sync (Lightweight)
    webContents.getAllWebContents().forEach(wc => {
        if (wc.getType() === 'webview') wc.send('webview-broadcast-audio-trigger');
    });

    // 2. NUCLEAR STAGGERED HEADLESS SYNC
    const profiles = store.get('profiles', []);
    const lastCtx = Array.from(activeInjectors.values()).pop(); // Auto context

    const targetChannel = manualData?.manualChannelId || lastCtx?.channelId;
    const targetGuild = manualData?.manualGuildId || lastCtx?.guildId;

    if (!targetChannel || targetChannel === 'MANUAL') {
        console.error(`🌋 ERROR: No Target Channel ID found! Please enter it in the Dashboard.`);
        return;
    }

    console.log(`🌋 INITIATING STAGGERED BLAST: Target -> ${targetChannel}`);
    
    for (let i = 0; i < profiles.length; i++) {
        const profile = profiles[i];
        if (profile.token) {
            console.log(`🚀 [${i+1}/${profiles.length}] MISSION DEPLOYMENT: Initializing ${profile.name}...`);
            const injector = spawn('node', [
                path.join(__dirname, '../../headless/voice_injector.js'),
                profile.token,
                targetChannel,
                targetGuild || 'MANUAL'
            ], {
                detached: true,
                stdio: 'ignore'
            });
            injector.unref();

            // If the UI closes, the detached headless bot will remain running
            
            // WAIT 3 SECONDS BEFORE NEXT BOT (Gateway Protection)
            await new Promise(r => setTimeout(r, 3000));
        }
    }
  });

  ipcMain.on('vc-context-update', (event, ctx) => {
    if (!ctx.token || !ctx.channelId || !ctx.guildId) return;
    lastVoiceContext = { token: ctx.token, guildId: ctx.guildId, channelId: ctx.channelId };
    launchVoiceInjector(ctx.token, ctx.channelId, ctx.guildId);
  });

  ipcMain.on('join-all-bots-to-current-vc', async () => {
    if (!lastVoiceContext?.channelId || !lastVoiceContext?.guildId) {
      console.error('🌋 No current voice context available.');
      return;
    }
    await joinAllProfilesToCurrentChannel(lastVoiceContext.channelId, lastVoiceContext.guildId);
  });

  ipcMain.on('leave-all-bots-from-vc', () => {
    for (const entry of activeInjectors.values()) {
      try { entry.process.kill(); } catch (e) {}
    }
    activeInjectors.clear();
  });

  ipcMain.on('stop-headless-bots', () => {
    for (const [token, entry] of activeInjectors.entries()) {
      try {
        entry.process.kill();
      } catch (e) {
        console.error(`❌ Failed to kill headless bot for ${token.substring(0,10)}...`, e.message);
      }
    }
    activeInjectors.clear();
  });

  app.on('before-quit', () => {
    for (const entry of activeInjectors.values()) {
      try {
        entry.process.kill();
      } catch (e) {}
    }
    activeInjectors.clear();
  });

  // HYBRID SYNC: Broadcast 'Veriy Mode' to all webviews
  // 🌋 NUCLEAR ARMY SYNC: Single Source of Truth
  let globalGodMicActive = false;

  const syncAllBots = async (status) => {
    globalGodMicActive = status;
    const allWebContents = webContents.getAllWebContents();
    let webviewCount = 0;
    
    broadcastLog(`🌋 INITIATING ${status ? 'NUCLEAR' : 'DEACTIVATE'} SEQUENCE FOR ${allWebContents.filter(c => c.getType() === 'webview').length} BOTS...`, 'info');

    for (const contents of allWebContents) {
      if (contents.getType() === 'webview') {
        webviewCount++;
        try {
          // Send sync signal to Preload (Preload handles the actual injection)
          contents.send('veriy-mode-sync', status);
          broadcastLog(`✅ SYNCED: BOT [${webviewCount}] READY`, 'success');
        } catch (e) {
          broadcastLog(`❌ FAILED: BOT [${webviewCount}] SYNC ERROR: ${e.message}`, 'error');
        }
        await new Promise(r => setTimeout(r, 200));
      }
    }
    broadcastLog(`🌋 ARMY SYNC COMPLETE: ${webviewCount} BOTS ACTIVE`, 'success');
  };

  ipcMain.on('veriy-mode-trigger', (event, status) => {
    syncAllBots(status);
  });

  ipcMain.on('sync-army-audio', () => {
    syncAllBots(globalGodMicActive);
  });

  ipcMain.on('mass-message', (event, text) => {
    const allWebContents = webContents.getAllWebContents();
    allWebContents.forEach(contents => {
      if (contents.getType() === 'webview') {
        contents.send('mass-message-inject', text);
      }
    });
  });

  app.on('web-contents-created', (event, contents) => {
    if (contents.getType() === 'webview') {
        contents.on('dom-ready', () => {
            if (globalGodMicActive) {
                contents.send('veriy-mode-sync', true);
                console.log(`🌋 SYNCED GOD MIC: BOT [${contents.id}]`);
            }
        });
    }

    contents.on('will-attach-webview', (event, webPreferences, params) => {
      webPreferences.preload = path.join(__dirname, 'webview-preload.js');
      webPreferences.nodeIntegration = false;
      webPreferences.contextIsolation = true;
    });
  });

});

// 🌋 THE NUCLEAR ERYACHAL SCRIPT (Stored in Main Process)
const GOD_MIC_NUCLEAR_CODE = `
    (function() {
        if (window.__GOD_MIC_ACTIVE) return;
        window.__GOD_MIC_ACTIVE = true;

        console.log('🌋 NUCLEAR ENGINE: SILENT DEPLOYMENT INITIATED...');
        
        // 🛡️ HACKER THEME INJECTION (Silent)
        const style = document.createElement('style');
        style.innerHTML = \`
            [class*="guilds_"], [class*="sidebar_"], [class*="container_"], [class*="chat_"] { background: #020000 !important; }
            [class*="wordmark_"] { color: #ff0000 !important; }
            [class*="selected_"] [class*="name_"] { color: #ff0000 !important; font-weight: 900 !important; }
            ::-webkit-scrollbar-thumb { background: #ff0000 !important; }
        \`;
        document.head.appendChild(style);

        const hijackAudio = () => {
            const originalGUM = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
            navigator.mediaDevices.getUserMedia = async (constraints) => {
                if (constraints && constraints.audio) {
                    constraints.audio.echoCancellation = false;
                    constraints.audio.noiseSuppression = false;
                    constraints.audio.autoGainControl = false;
                }
                
                const stream = await originalGUM(constraints);
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const source = ctx.createMediaStreamSource(stream);
                const dest = ctx.createMediaStreamDestination();
                
                // --- V4 HYBRID MIXER (SILENT) ---
                const voiceGain = ctx.createGain();
                voiceGain.gain.value = 10.0; // 🔥 ULTRA VOICE BOOST
                
                const masterGain = ctx.createGain();
                masterGain.gain.value = 1800; // 🚀 MAXIMUM NUCLEAR OUTPUT

                const osc = ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.value = 110;
                const noiseGain = ctx.createGain();
                noiseGain.gain.value = 0.3;
                
                osc.connect(noiseGain);
                osc.start();

                // Connect everything (NO analyzer - saves huge CPU)
                source.connect(voiceGain);
                voiceGain.connect(masterGain);
                noiseGain.connect(masterGain);
                masterGain.connect(dest);

                // Resume once - no setInterval loop needed
                const resumeOnce = () => { if(ctx.state === 'suspended') ctx.resume(); };
                setTimeout(resumeOnce, 500);
                setInterval(resumeOnce, 30000); // Check every 30s instead of 1s

                return dest.stream;
            };
        };

        hijackAudio();
        // NO re-hijack interval - saves CPU for 40 bots

        // 🤖 AUTO-PILOT: unmute only (no mousemove spam)
        setInterval(() => {
            const unmuteBtn = document.querySelector('button[aria-label="Unmute"]');
            if (unmuteBtn) unmuteBtn.click();
        }, 10000); // 10s instead of 3s
    })();
`;
