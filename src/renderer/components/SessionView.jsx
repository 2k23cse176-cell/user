import React, { useRef, useEffect, useState } from 'react';
import { ExternalLink, RotateCcw, Shield, Trash2, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';

export default function SessionView({ profile, inviteLink, setInviteLink, onClose, isGrid }) {
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    let lastSentChannel = null;

    const sendChannelContext = () => {
      try {
        const url = webview.getURL();
        const match = url.match(/discord\.com\/channels\/(\d+)\/(\d+)/);
        if (match && profile.token) {
          const guildId = match[1];
          const channelId = match[2];
          const channelKey = `${guildId}:${channelId}`;
          if (lastSentChannel !== channelKey) {
            lastSentChannel = channelKey;
            window.electronAPI.send('vc-context-update', {
              token: profile.token,
              guildId,
              channelId
            });
          }
        }
      } catch (e) {
        console.error('Channel sync failed:', e);
      }
    };

    const handleNavigation = () => {
      setCanGoBack(webview.canGoBack());
      setCanGoForward(webview.canGoForward());
      sendChannelContext();
    };

    const handleStartLoading = () => setIsLoading(true);
    const handleStopLoading = () => {
      setIsLoading(false);
      handleNavigation();
    };

    webview.addEventListener('did-navigate', handleNavigation);
    webview.addEventListener('did-navigate-in-page', handleNavigation);
    webview.addEventListener('did-start-loading', handleStartLoading);
    webview.addEventListener('did-stop-loading', handleStopLoading);
    
    // Auto Token Login
    const injectToken = () => {
      if (profile.token) {
        window.electronAPI.registerToken(profile.id, profile.token);
        webview.send('setup-session', profile.token);
      }
      if (profile.email && profile.password) {
        webview.send('setup-vault', { email: profile.email, password: profile.password });
      }
      sendChannelContext();
    };

    webview.addEventListener('dom-ready', injectToken);
    // Removed other listeners to prevent session corruption

    return () => {
      webview.removeEventListener('did-navigate', handleNavigation);
      webview.removeEventListener('did-navigate-in-page', handleNavigation);
      webview.removeEventListener('did-start-loading', handleStartLoading);
      webview.removeEventListener('did-stop-loading', handleStopLoading);
    };
  }, [profile.id, profile.token, profile.email, profile.password]);


  useEffect(() => {
    if (inviteLink && webviewRef.current) {
      if (inviteLink.includes('discord.gg/') || inviteLink.includes('discord.com/invite/') || inviteLink.includes('discord.com/channels/')) {
        // Prevent infinite reload if already on the page
        if (!webviewRef.current.getURL().includes(inviteLink)) {
            webviewRef.current.loadURL(inviteLink);
        }
      }
    }
  }, [inviteLink]);

  const handleApplyInvite = () => {
    if (inviteLink && webviewRef.current) {
      if (inviteLink.includes('discord.gg/') || inviteLink.includes('discord.com/invite/') || inviteLink.includes('discord.com/channels/')) {
        webviewRef.current.loadURL(inviteLink);
      }
    }
  };

  const handleClearData = async () => {
    if (confirm('Clear all session data for this account? You will be logged out.')) {
      if (window.electronAPI) {
        await window.electronAPI.clearSessionData(profile.id);
        webviewRef.current?.reload();
      } else {
        alert('Clear data is only available in Desktop mode.');
      }
    }
  };

  return (
    <div className={isGrid ? "relative flex flex-col bg-discord-dark rounded-2xl overflow-hidden border border-white/5 h-[380px] shadow-2xl transition-transform hover:scale-[1.02]" : "flex flex-col h-full bg-discord-dark"}>
      {/* Session Header */}
      {!isGrid ? (
        <div className="h-14 border-b border-discord-darkest px-4 flex items-center justify-between gap-4 bg-discord-darker shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => webviewRef.current?.goBack()}
              disabled={!canGoBack}
              className="p-1.5 rounded hover:bg-discord-dark disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => webviewRef.current?.goForward()}
              disabled={!canGoForward}
              className="p-1.5 rounded hover:bg-discord-dark disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => webviewRef.current?.reload()}
              className="p-1.5 rounded hover:bg-discord-dark"
            >
              <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <button 
            onClick={() => {
              if (webviewRef.current && profile.token) {
                webviewRef.current.executeJavaScript(`
                  (function() {
                    let i = document.createElement('iframe');
                    document.body.appendChild(i);
                    i.contentWindow.localStorage.setItem('token', '"${profile.token}"');
                    setTimeout(() => window.location.reload(), 500);
                  })();
                `);
              }
            }}
            className="ml-2 px-3 py-1 bg-discord-green hover:bg-discord-green/80 text-white text-xs font-bold rounded flex items-center gap-1 shadow-[0_0_10px_rgba(87,242,135,0.3)]"
          >
            ⚡ LOGIN
          </button>
          
          <button 
            onClick={() => {
              if (webviewRef.current) {
                webviewRef.current.executeJavaScript(`
                  (async()=>{  if(window.__CLEARBOOST_V2__) return; window.__CLEARBOOST_V2__=true;  const oldGUM= navigator.mediaDevices.getUserMedia.bind( navigator.mediaDevices );  navigator.mediaDevices.getUserMedia= async function(cons){  if(cons&&cons.audio){  cons.audio.echoCancellation=false; cons.audio.noiseSuppression=false; cons.audio.autoGainControl=false;  }  const real= await oldGUM(cons);  const ctx= new( window.AudioContext|| window.webkitAudioContext )();  await ctx.resume();  const src= ctx.createMediaStreamSource(real);  const dst= ctx.createMediaStreamDestination();  /* =========================    VOICE ========================= */  const voiceGain= ctx.createGain();  voiceGain.gain.value=110;  const voiceBoost= ctx.createGain();  voiceBoost.gain.value=85;  const rawVoice= ctx.createGain();  rawVoice.gain.value=35;  const rawVoice2= ctx.createGain();  rawVoice2.gain.value=55;  /* =========================    BASS ========================= */  const bass= ctx.createBiquadFilter();  bass.type="lowshelf";  bass.frequency.value=90;  bass.gain.value=12;  /* =========================    MID ========================= */  const midCut= ctx.createBiquadFilter();  midCut.type="peaking";  midCut.frequency.value=1200;  midCut.Q.value=0.8;  midCut.gain.value=-2;  /* =========================    PRESENCE ========================= */  const presence= ctx.createBiquadFilter();  presence.type="peaking";  presence.frequency.value=2600;  presence.Q.value=0.6;  presence.gain.value=28;  /* =========================    AIR ========================= */  const air= ctx.createBiquadFilter();  air.type="highshelf";  air.frequency.value=9000;  air.gain.value=22;  /* =========================    ENHANCER ========================= */  const enhancer= ctx.createBiquadFilter();  enhancer.type="peaking";  enhancer.frequency.value=1800;  enhancer.Q.value=0.5;  enhancer.gain.value=10;  /* =========================    COMPRESSOR ========================= */  const comp= ctx.createDynamicsCompressor();  comp.threshold.value=-20;  comp.knee.value=14;  comp.ratio.value=4;  comp.attack.value=0.004;  comp.release.value=0.12;  /* =========================    PHASER ========================= */  const phaser= ctx.createBiquadFilter();  phaser.type="allpass";  phaser.frequency.value=2200;  const lfo= ctx.createOscillator();  lfo.type="triangle";  lfo.frequency.value=1.2;  const lfoGain= ctx.createGain();  lfoGain.gain.value=250;  lfo.connect(lfoGain);  lfoGain.connect(phaser.frequency);  lfo.start();  /* =========================    DISTORTION ========================= */  const dist= ctx.createWaveShaper();  function curve(a){  const n=44100;  const c= new Float32Array(n);  for(let i=0;i<n;i++){  const x=i*2/n-1;  c[i]=Math.tanh(a*x);  }  return c;  }  dist.curve=curve(3);  dist.oversample="4x";  /* =========================    DIRTY ========================= */  const dirty= ctx.createGain();  dirty.gain.value=2;  /* =========================    SATURATION ========================= */  const sat= ctx.createWaveShaper();  const satCurve= new Float32Array(65536);  for(let i=0;i<65536;i++){  let x=i*2/65536-1;  satCurve[i]= Math.tanh(x*4);  }  sat.curve=satCurve;  /* =========================    STATIC ========================= */  const noiseBuffer= ctx.createBuffer( 1, ctx.sampleRate*2, ctx.sampleRate );  const data= noiseBuffer.getChannelData(0);  for(let i=0;i<data.length;i++){  data[i]= (Math.random()*2-1)*0.005;  }  const noise= ctx.createBufferSource();  noise.buffer=noiseBuffer;  noise.loop=true;  const noiseGain= ctx.createGain();  noiseGain.gain.value=0.008;  /* =========================    MAIN ECHO ========================= */  const echoDelay= ctx.createDelay(5.0);  echoDelay.delayTime.value=0.25;  const echoFB= ctx.createGain();  echoFB.gain.value=0.18;  echoDelay.connect(echoFB);  echoFB.connect(echoDelay);  const echoWet= ctx.createGain();  echoWet.gain.value=0.18;  /* =========================    EXTRA ECHO ========================= */  const echo2= ctx.createDelay(5.0);  echo2.delayTime.value=0.12;  const echo2FB= ctx.createGain();  echo2FB.gain.value=0.08;  echo2.connect(echo2FB);  echo2FB.connect(echo2);  const echo2Wet= ctx.createGain();  echo2Wet.gain.value=0.08;  /* =========================    CAVE ========================= */  const caveDelay= ctx.createDelay(5.0);  caveDelay.delayTime.value=0.45;  const caveFB= ctx.createGain();  caveFB.gain.value=0.12;  caveDelay.connect(caveFB);  caveFB.connect(caveDelay);  const caveWet= ctx.createGain();  caveWet.gain.value=0.06;  /* =========================    CAVE FILTER ========================= */  const caveEQ= ctx.createBiquadFilter();  caveEQ.type="bandpass";  caveEQ.frequency.value=1300;  caveEQ.Q.value=0.7;  /* =========================    SUB ========================= */  const subOsc= ctx.createOscillator();  subOsc.type="sine";  subOsc.frequency.value=42;  const subGain= ctx.createGain();  subGain.gain.value=0.08;  /* =========================    MASTER ========================= */  const master= ctx.createGain();  master.gain.value=120;  /* =========================    CLIP ========================= */  const clip= ctx.createWaveShaper();  const cc= new Float32Array(65536);  for(let i=0;i<65536;i++){  let x=i*2/65536-1;  cc[i]= Math.max(-0.82, Math.min(0.82,x));  }  clip.curve=cc;  clip.oversample="4x";  /* =========================    CONNECTIONS ========================= */  src.connect(voiceGain);  voiceGain.connect(voiceBoost);  voiceBoost.connect(master);  src.connect(rawVoice);  rawVoice.connect(master);  src.connect(rawVoice2);  rawVoice2.connect(master);  voiceGain.connect(bass);  bass.connect(midCut);  midCut.connect(presence);  presence.connect(air);  air.connect(enhancer);  enhancer.connect(comp);  comp.connect(phaser);  phaser.connect(dist);  dist.connect(dirty);  dirty.connect(sat);  sat.connect(master);  noise.connect(noiseGain);  noiseGain.connect(master);  dist.connect(echoDelay);  echoDelay.connect(echoWet);  echoWet.connect(master);  dist.connect(echo2);  echo2.connect(echo2Wet);  echo2Wet.connect(master);  dist.connect(caveDelay);  caveDelay.connect(caveWet);  caveWet.connect(caveEQ);  caveEQ.connect(master);  subOsc.connect(subGain);  subGain.connect(master);  master.connect(clip);  clip.connect(dst);  /* START */  noise.start();  subOsc.start();  /* KEEP ALIVE */  setInterval(()=>{  if(ctx.state==="suspended"){  ctx.resume();  }  },100);  console.log( "CLEAR BOOST V2 ACTIVE" );  
                        if(!document.getElementById('god-mic-banner')){
                            const b = document.createElement('div');
                            b.id = 'god-mic-banner';
                            b.innerHTML = '🎤 GOD MIC ACTIVE 🎤';
                            b.style.cssText = 'position:fixed;top:0;left:0;right:0;background:linear-gradient(90deg, #ff6600, #ff8c00);color:#fff;padding:12px;text-align:center;font-weight:900;z-index:999999;border-bottom:3px solid #000;letter-spacing:4px;font-size:14px;text-shadow:0 0 15px #000;pointer-events:none;';
                            document.body.appendChild(b);
                        }
  return dst.stream;  };  })();
                `);
              }
            }}
            className="ml-2 px-3 py-1 bg-discord-red hover:bg-discord-red/80 text-white text-xs font-black rounded flex items-center gap-1 shadow-[0_0_15px_rgba(255,0,0,0.5)] tracking-widest uppercase"
          >
            💀 INJECT
          </button>

          <div className="flex-1 max-w-md relative group ml-4">
            <input
              type="text"
              placeholder="Paste invite link here..."
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              className="w-full bg-discord-darkest text-sm py-1.5 px-3 rounded outline-none focus:ring-1 focus:ring-discord-blurple border border-transparent"
            />
            <button 
              onClick={handleApplyInvite}
              className="absolute right-2 top-1.5 text-xs bg-discord-blurple hover:bg-discord-blurple/80 px-2 py-0.5 rounded transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-discord-darkest border border-discord-dark">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: profile.color }} />
            <span className="text-sm font-medium">{profile.name}</span>
          </div>
          <button 
            onClick={handleClearData}
            title="Clear Session Data"
            className="p-2 rounded hover:bg-discord-red/20 text-discord-muted hover:text-discord-red transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      ) : (
        <div className="px-4 py-2 bg-discord-darker flex items-center justify-between border-b border-black/20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: profile.color }} />
            <span className="text-[11px] font-black uppercase tracking-widest text-white/90">{profile.name}</span>
          </div>
          <button onClick={handleClearData} className="text-discord-muted hover:text-discord-red transition-colors"><Trash2 className="w-3 h-3" /></button>
        </div>
      )}

      {/* Webview Container */}
      <div className={isGrid ? "flex-1 bg-discord-darkest relative overflow-hidden" : "flex-1 relative bg-discord-darkest"}>
        <webview 
          ref={webviewRef}
          src="https://discord.com/app"
          partition={`persist:${profile.id}`}
          data-profile-id={profile.id}
          useragent={`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`}
          className={isGrid ? "w-full h-full transform origin-top-left scale-[0.75]" : "w-full h-full"}
          style={isGrid ? { width: '133.33%', height: '133.33%', backgroundColor: '#1e1f22' } : { backgroundColor: '#1e1f22' }}
          allowpopups="true"
          disableblinkfeatures="AutomationControlled"
          webpreferences="backgroundThrottling=false, javascript=yes, images=yes"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-discord-darkest/50 pointer-events-none">
            <div className="w-8 h-8 border-2 border-discord-blurple border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
