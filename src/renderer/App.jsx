import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SessionView from './components/SessionView';
import Dashboard from './components/Dashboard';
import GridView from './components/GridView';
import { Layout } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [sounds, setSounds] = useState([]); // New Sound Library State
  const [activeProfileId, setActiveProfileId] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [notification, setNotification] = useState(null);
  const [isGridView, setIsGridView] = useState(false);
  const [gridPage, setGridPage] = useState(0);
  const [veriyMode, setVeriyMode] = useState(false);
  const [loadedUpTo, setLoadedUpTo] = useState(1); // STAGGERED LOAD: how many bots have been mounted so far
  
  useEffect(() => {
    window.setAppGridPage = (page) => setGridPage(page);
  }, []);

  const toggleVeriyMode = () => {
    const next = !veriyMode;
    setVeriyMode(next);
    if (window.electronAPI && window.electronAPI.sendVeriyMode) {
      window.electronAPI.sendVeriyMode(next);
    }
    showNotification(next ? '🌋 VERIY MODE: ACTIVATED' : '🛑 VERIY MODE: DEACTIVATED', next ? 'success' : 'info');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (window.electronAPI) {

      let alreadyStarted = false;
      const startStagger = (allProfiles) => {
        if (allProfiles.length === 0) return;
        setProfiles(allProfiles);
        setActiveProfileId(allProfiles[0].id); // Bot 1 உடனே
        setLoadedUpTo(1);
        allProfiles.forEach(p => {
          if (p.token) window.electronAPI.registerToken(p.id, p.token);
        });
        // Stagger: Bot 2 onwards, ஒவ்வொன்றாக 300ms-ல்
        let idx = 1;
        const staggerTimer = setInterval(() => {
          if (idx >= allProfiles.length) { clearInterval(staggerTimer); return; }
          setLoadedUpTo(prev => prev + 1);
          idx++;
        }, 150);
      };

      // STEP 1: localStorage-ல் இருந்து INSTANT-ஆக load (sync, no wait)
      const cached = localStorage.getItem('backup_profiles');
      if (cached) {
        try {
          const cachedProfiles = JSON.parse(cached);
          if (cachedProfiles && cachedProfiles.length > 0) {
            alreadyStarted = true;
            const sliced = cachedProfiles.slice(0, 20);
            localStorage.setItem('backup_profiles', JSON.stringify(sliced));
            startStagger(sliced); // Bot 1 உடனே render!
          }
        } catch(e) {}
      }

      // STEP 2: IPC-ல் இருந்து background-ல் fetch (authoritative data)
      window.electronAPI.getProfiles().then(storeProfiles => {
        if (storeProfiles && storeProfiles.length > 0) {
          if (!alreadyStarted) {
            startStagger(storeProfiles);
          } else {
            // Silently update profiles state without restarting stagger
            setProfiles(storeProfiles);
            storeProfiles.forEach(p => {
              if (p.token) window.electronAPI.registerToken(p.id, p.token);
            });
          }
        }
      });

      // Listen for sniffed tokens
      const unregisterTokenSniffer = window.electronAPI.onTokenCaptured(({ id, token }) => {
        setProfiles(prev => {
          const updated = prev.map(p => {
            if (p.id === id || (id === null && p.token === '')) {
                if (p.token !== token) {
                    console.log(`🌋 TOKEN CAPTURED FOR ${p.name}`);
                    return { ...p, token };
                }
            }
            return p;
          });
          saveProfiles(updated);
          return updated;
        });
      });
      
      const savedSounds = localStorage.getItem('sound_library');
      if (savedSounds) setSounds(JSON.parse(savedSounds));

      return () => {
        unregisterTokenSniffer();
      };
    }
  }, []);

  const saveProfiles = (newProfiles) => {
    setProfiles(newProfiles);
    // Double Save for 100% Security
    if (window.electronAPI) window.electronAPI.saveProfiles(newProfiles);
    localStorage.setItem('backup_profiles', JSON.stringify(newProfiles));
  };

  const addSound = (file) => {
    const newSound = {
      id: Date.now().toString(),
      name: file.name,
      file: file, // Keep file for immediate playback
      dur: '0:00'
    };
    const newSounds = [...sounds, newSound];
    setSounds(newSounds);
    localStorage.setItem('sound_library', JSON.stringify(newSounds.map(s => ({ ...s, file: null }))));
    showNotification(`Sound "${file.name}" added to Soundpad`, 'success');
  };

  const removeSound = (id) => {
    const newSounds = sounds.filter(s => s.id !== id);
    setSounds(newSounds);
    localStorage.setItem('sound_library', JSON.stringify(newSounds.map(s => ({ ...s, file: null }))));
  };

  const addProfile = (name, color, bulkItems) => {
    if (bulkItems) {
      saveProfiles([...profiles, ...bulkItems]);
      bulkItems.forEach(p => {
        if (p.token) window.electronAPI.registerToken(p.id, p.token);
      });
      showNotification(`Bulk added ${bulkItems.length} sessions`, 'success');
      return;
    }
    const newProfile = {
      id: Date.now().toString(),
      name,
      color: color || '#5865f2',
      createdAt: new Date().toISOString(),
    };
    saveProfiles([...profiles, newProfile]);
    setActiveProfileId(newProfile.id);
    showNotification(`Session "${name}" created`, 'success');
  };

  const removeProfile = (id) => {
    const profileToRemove = profiles.find(p => p.id === id);
    const newProfiles = profiles.filter(p => p.id !== id);
    saveProfiles(newProfiles);
    if (activeProfileId === id) setActiveProfileId(null);
    showNotification(`Session "${profileToRemove?.name}" removed`, 'info');
  };

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const joinAllProfiles = (link) => {
    if (!link) return showNotification('Please enter an invite link', 'info');
    if (profiles.length === 0) return showNotification('No sessions available to join', 'error');
    setInviteLink(link);
    setLoadedUpTo(profiles.length);
    setActiveProfileId(profiles[0]?.id || null);
    showNotification(`Join command sent to ${profiles.length} bots...`, 'success');
  };

  return (
    <div className="flex h-screen w-full bg-discord-darkest text-discord-text select-none overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        profiles={filteredProfiles}
        activeProfileId={activeProfileId}
        setActiveProfileId={(id) => {
          setActiveProfileId(id);
          setIsGridView(false);
        }}
        addProfile={addProfile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-discord-darker rounded-tl-lg overflow-hidden relative">
        {notification && (
          <div className={`absolute top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-2xl fade-in border border-white/10 ${
            notification.type === 'success' ? 'bg-discord-green text-white' : 'bg-discord-darkest text-discord-text'
          }`}>
            <div className="font-bold text-sm">{notification.message}</div>
          </div>
        )}

        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-discord-darker">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-discord-muted uppercase tracking-wider">Workspace Manager</h1>
            <div className="h-4 w-px bg-white/10" />
            <button 
              onClick={toggleVeriyMode}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-2",
                veriyMode 
                  ? "bg-discord-red text-white shadow-[0_0_15px_rgba(237,66,69,0.5)] animate-pulse" 
                  : "bg-discord-darkest text-discord-muted hover:text-white border border-white/5"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full", veriyMode ? "bg-white" : "bg-discord-muted")} />
              {veriyMode ? "🌋 VERIY MODE: ON" : "VERIY MODE: OFF"}
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-discord-darkest">
          {/* THE SINGLE SOURCE OF TRUTH WEBVIEWS */}
          <div className={cn(
            "absolute inset-0 w-full h-full transition-all duration-500",
            isGridView ? "pt-14 z-[60] bg-black/50 overflow-y-auto custom-scrollbar" : "z-10"
          )}>
            <div className={cn(
              "w-full h-full transition-all duration-300",
              isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6" : "relative"
            )}>
              {profiles.map((profile, idx) => {
                const itemsPerPage = 20;
                const isVisibleInGrid = idx >= gridPage * itemsPerPage && idx < (gridPage + 1) * itemsPerPage;
                const isActive = activeProfileId === profile.id;
                // Staggered: only render if this bot's turn has come (idx < loadedUpTo)
                const shouldRender = idx < loadedUpTo || isActive || isVisibleInGrid;
                
                return (
                  <div 
                    key={profile.id} 
                    className={cn(
                      "transition-all duration-300",
                      isGridView 
                        ? (isVisibleInGrid ? "relative w-full h-full block opacity-100 scale-100 z-10 pointer-events-auto" : "hidden opacity-0 scale-95 pointer-events-none")
                        : (isActive ? "absolute inset-0 w-full h-full opacity-100 z-10 scale-100 pointer-events-auto" : "absolute inset-0 w-full h-full opacity-0 -z-10 pointer-events-none scale-95")
                    )}
                  >
                    {shouldRender && (
                      <SessionView 
                        profile={profile}
                        inviteLink={inviteLink}
                        setInviteLink={setInviteLink}
                        onClose={() => setActiveProfileId(null)}
                        isGrid={isGridView}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid View Header Overlay */}
          {isGridView && (
            <GridView 
              profiles={profiles} 
              onClose={() => setIsGridView(false)} 
              inviteLink={inviteLink}
            />
          )}

          {/* Dashboard View (Persistent Overlay) */}
          <div className={cn(
            "absolute inset-0 w-full h-full bg-discord-darkest z-20 transition-transform duration-500",
            !activeProfileId && !isGridView ? "translate-x-0" : "translate-x-full"
          )}>
            <Dashboard 
              profiles={profiles} 
              setActiveProfileId={setActiveProfileId}
              addProfile={addProfile} 
              removeProfile={removeProfile} 
              inviteLink={inviteLink}
              setInviteLink={setInviteLink}
              onGridView={() => setIsGridView(true)}
              onJoinAll={joinAllProfiles}
              showNotification={showNotification}
              sounds={sounds}
              addSound={addSound}
              removeSound={removeSound}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
