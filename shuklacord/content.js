(function () {
  if (window.__SHUKLACORD_LOADED__) return;
  window.__SHUKLACORD_LOADED__ = true;

  if (window.location.hostname.includes('discord.com')) {
    // -------------------------------------------------------
    // Listen for token injection from the bot-frame bridge page
    // -------------------------------------------------------
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SHUKLACORD_INJECT_TOKEN' && event.data.token) {
        try {
          // Inject token into Discord's local storage and trigger reload
          window.localStorage.setItem('token', JSON.stringify(event.data.token));
          window.location.href = 'https://discord.com/channels/@me';
        } catch (e) {
          console.warn('[Shuklacord] Token injection failed:', e.message);
        }
      }
    });

    // Also check if token is already present — skip login page if so
    const existingToken = window.localStorage.getItem('token');
    if (!existingToken && window.location.pathname === '/login') {
      // Check if parent posted a token for us (in case we loaded before the message)
      try {
        window.parent.postMessage({ type: 'SHUKLACORD_READY' }, '*');
      } catch (e) {}
    }

    // Inject the main Shuklacord UI into Discord natively
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('injector.js');
    s.onload = () => s.remove();
    document.documentElement.appendChild(s);

  } else {
    // We are on the Dashboard page — hook the Mic Route button
    const checkDashboard = setInterval(() => {
      const micBtn = document.getElementById('micBtn');
      if (micBtn) {
        clearInterval(checkDashboard);
        setupExtensionMicRoute(micBtn);
      }
    }, 500);
  }

  function setupExtensionMicRoute(micBtn) {
    let micWs = null;
    let micStream = null;
    let audioCtx = null;
    let scriptNode = null;
    let silentOsc = null;
    let silentGain = null;

    micBtn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const micmsg = document.getElementById('micmsg');
      if (micWs) {
        micWs.close();
        return;
      }

      try {
        if (micmsg) micmsg.textContent = 'Requesting mic access via Shuklacord...';
        micStream = await navigator.mediaDevices.getUserMedia({
          audio: { channelCount: 1, sampleRate: 48000, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
          video: false
        });

        const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
        micWs = new WebSocket(proto + '//' + location.host);
        micWs.binaryType = 'arraybuffer';

        micWs.onopen = () => {
          micBtn.textContent = '🔴 Stop Mic Route';
          micBtn.classList.add('active');
          if (micmsg) micmsg.textContent = '🎤 Live! Routed via Shuklacord Extension.';

          audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000, latencyHint: 'interactive' });
          const micSrc = audioCtx.createMediaStreamSource(micStream);

          silentOsc = audioCtx.createOscillator();
          silentOsc.type = 'sine';
          silentGain = audioCtx.createGain();
          silentGain.gain.value = 0;
          silentOsc.connect(silentGain);
          silentGain.connect(audioCtx.destination);
          silentOsc.start();

          scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);
          scriptNode.onaudioprocess = (evt) => {
            if (micWs && micWs.readyState === 1) {
              const input = evt.inputBuffer.getChannelData(0);
              const pcm = new Int16Array(input.length);
              for (let i = 0; i < input.length; i++) {
                pcm[i] = Math.max(-32768, Math.min(32767, input[i] * 32767));
              }
              micWs.send(pcm.buffer);
            }
          };

          micSrc.connect(scriptNode);
          scriptNode.connect(audioCtx.destination);
        };

        micWs.onclose = () => {
          micBtn.textContent = '🎤 Start Mic Route';
          micBtn.classList.remove('active');
          if (micmsg) micmsg.textContent = 'Mic stopped.';
          if (scriptNode) { try { scriptNode.disconnect(); } catch (e) {} scriptNode = null; }
          if (audioCtx) { audioCtx.close(); audioCtx = null; }
          if (micStream) { micStream.getTracks().forEach(t => t.stop()); micStream = null; }
          micWs = null;
        };

        micWs.onerror = () => {
          if (micmsg) micmsg.textContent = 'WebSocket error — check console';
        };
      } catch (err) {
        if (micmsg) micmsg.textContent = 'Error: ' + err.message;
      }
    };
  }
})();
