import React from 'react';
import { LayoutGrid, ArrowLeft, ArrowRight } from 'lucide-react';

export default function GridView({ profiles, inviteLink, onClose }) {
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(profiles.length / itemsPerPage);
  
  const currentProfiles = profiles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const [loadedCount, setLoadedCount] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(true);

  React.useEffect(() => {
    setLoadedCount(0);
    const interval = setInterval(() => {
        setLoadedCount(prev => {
            if (prev >= currentProfiles.length) {
                clearInterval(interval);
                return prev;
            }
            return prev + 1;
        });
    }, 2000); // 🌋 INCREASED DELAY FOR STABILITY
    return () => clearInterval(interval);
  }, [currentPage, currentProfiles.length]);

  const toggleMuteAll = () => {
    const targetIsLive = isMuted; // If currently muted, next state is Live (Unmuted)
    
    const webviews = document.querySelectorAll('webview');
    webviews.forEach(wv => {
      // 1. Mute the local speaker output (so we don't hear 4x echo)
      wv.setAudioMuted(!targetIsLive);
      
      // 2. Programmatically toggle Discord's Microphone UI button
      wv.executeJavaScript(`
        (function() {
            const targetLive = ${targetIsLive};
            const btns = Array.from(document.querySelectorAll('button'));
            const unmuteBtn = btns.find(b => b.getAttribute('aria-label') && b.getAttribute('aria-label').includes('Unmute'));
            const muteBtn = btns.find(b => b.getAttribute('aria-label') && b.getAttribute('aria-label').includes('Mute'));
            
            if (targetLive && unmuteBtn) {
                unmuteBtn.click();
            } else if (!targetLive && muteBtn) {
                muteBtn.click();
            }
        })();
      `);
    });
    setIsMuted(!isMuted);
  };

  React.useEffect(() => {
    const webviews = document.querySelectorAll('webview');
    webviews.forEach(wv => {
      wv.addEventListener('dom-ready', () => {
        const profileId = wv.getAttribute('data-profile-id');
        const profile = profiles.find(p => p.id === profileId);
        const injectToken = () => {
          if (profile && profile.token) {
            wv.send('setup-session', profile.token);
          }
        };

        wv.addEventListener('dom-ready', injectToken);
        wv.addEventListener('did-navigate', injectToken);
        wv.addEventListener('did-navigate-in-page', injectToken);
      });
    });
  }, [currentPage]);

  return (
    <div className="absolute top-0 left-0 right-0 z-[70] pointer-events-none">
      {/* Grid Header */}
      <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-discord-darker/95 backdrop-blur-md shadow-xl pointer-events-auto">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-discord-blurple" />
            Grid View ({profiles.length} Sessions)
          </h2>
          <button 
            onClick={toggleMuteAll}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 pointer-events-auto ${
              isMuted ? 'bg-discord-dark text-discord-muted grayscale' : 'bg-discord-green text-white animate-pulse shadow-discord-green/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-discord-muted' : 'bg-white'}`} />
            {isMuted ? 'System: IDLE' : 'System: BLASTING'}
          </button>
          
          <button 
            onClick={() => {
                const gId = document.getElementById('target-guild-id')?.value;
                const cId = document.getElementById('target-channel-id')?.value;
                
                // 1. Trigger Headless Army (Priority)
                if (window.electronAPI && window.electronAPI.sendBroadcastAudio) {
                    window.electronAPI.sendBroadcastAudio({ manualGuildId: gId, manualChannelId: cId });
                }

                // 2. Trigger Browser Windows (Fallback)
                const webviews = document.querySelectorAll('webview');
                webviews.forEach(wv => {
                    wv.executeJavaScript(`
                        (function() {
                            const btns = Array.from(document.querySelectorAll('button'));
                            const joinBtn = btns.find(b => b.innerText && (b.innerText.includes('Join Voice') || b.innerText.includes('Join')));
                            if (joinBtn) joinBtn.click();
                        })();
                    `);
                });
            }}
            className="px-4 py-1.5 bg-discord-blurple text-white text-xs font-black rounded-full uppercase tracking-wider hover:brightness-125 transition-all shadow-lg flex items-center gap-2 pointer-events-auto"
          >
            🚀 Launch All Bots
          </button>
          
          <div className="text-xs font-bold text-discord-muted bg-black/20 px-3 py-1 rounded-full border border-white/5">
            READY: {profiles.length} SESSIONS
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setCurrentPage(prev => Math.max(0, prev - 1));
              if (window.setAppGridPage) window.setAppGridPage(currentPage - 1);
            }}
            disabled={currentPage === 0}
            className="p-2 rounded bg-discord-dark hover:bg-discord-darker disabled:opacity-30 pointer-events-auto"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
              if (window.setAppGridPage) window.setAppGridPage(currentPage + 1);
            }}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded bg-discord-dark hover:bg-discord-darker disabled:opacity-30 pointer-events-auto"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="ml-4 px-4 py-1.5 bg-discord-red/20 hover:bg-discord-red/40 text-discord-red text-sm font-bold rounded transition-all pointer-events-auto"
          >
            Exit Grid
          </button>
        </div>
      </div>
    </div>
  );
}
