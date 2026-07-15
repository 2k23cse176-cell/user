import React from 'react';
import { Plus, Layout, Trash2, Globe, LayoutGrid, Terminal, X, ShieldAlert, Cpu, Zap } from 'lucide-react';

export default function Dashboard({ 
  profiles = [], 
  setActiveProfileId, 
  addProfile, 
  removeProfile,
  inviteLink,
  setInviteLink,
  onGridView,
  onJoinAll,
  showNotification,
  sounds = [],
  addSound,
  removeSound
}) {
  const safeProfiles = profiles || [];
  const [logs, setLogs] = React.useState([]);
  const [showLogModal, setShowLogModal] = React.useState(false);
  const [massInvite, setMassInvite] = React.useState('');
  const [massMsg, setMassMsg] = React.useState('');
  const [sysStats, setSysStats] = React.useState({ cpu: 45, ram: 62 });

  // Mock stats update
  React.useEffect(() => {
    const timer = setInterval(() => {
      setSysStats({
        cpu: Math.floor(Math.random() * 20) + 40,
        ram: Math.floor(Math.random() * 10) + 60
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const logEndRef = React.useRef(null);

  React.useEffect(() => {
    if (window.electronAPI && window.electronAPI.onAppLog) {
      const cleanup = window.electronAPI.onAppLog((log) => {
        setLogs(prev => [...prev.slice(-49), log]);
      });
      return cleanup;
    }
  }, []);

  React.useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-8 bg-[#1e1f22]">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">CONTROL TOWER</h1>
          <p className="text-discord-muted font-medium uppercase tracking-widest text-[10px]">VEERA ON TOP ΓÇó Advanced Multi-Session Manager</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowLogModal(true)}
            className="bg-discord-dark hover:bg-discord-darker text-discord-muted px-6 py-3 rounded-2xl font-black flex items-center gap-3 transition-all border border-white/5 shadow-lg relative overflow-hidden"
          >
            <Terminal className="w-5 h-5" />
            LIVE LOGS
            {logs.length > 0 && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-discord-red rounded-full animate-pulse" />}
          </button>
          <div className="bg-discord-darkest px-6 py-3 rounded-2xl border border-discord-dark shadow-lg">
            <div className="text-[10px] uppercase font-bold text-discord-muted mb-1">Active Sessions</div>
            <div className="text-2xl font-black text-discord-green">{safeProfiles.length} <span className="text-xs text-discord-muted">Bots Online</span></div>
          </div>
          <button 
            onClick={() => {
              const newStatus = !window.godMicMode;
              window.godMicMode = newStatus;
              if (window.electronAPI && window.electronAPI.send) {
                window.electronAPI.send('veriy-mode-trigger', newStatus);
              }
              showNotification(`GOD MIC MODE: ${newStatus ? 'ON' : 'OFF'}`, 'success');
            }}
            className={`px-8 py-3 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-lg ${window.godMicMode ? 'bg-discord-red shadow-discord-red/20' : 'bg-discord-dark border border-white/10 text-discord-muted'}`}
          >
            <ShieldAlert className="w-5 h-5" />
            MASTER GOD MIC: {window.godMicMode ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={onGridView}
            className="bg-discord-blurple hover:bg-discord-blurple/80 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-discord-blurple/20"
          >
            <LayoutGrid className="w-5 h-5" />
            GRID VIEW
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Soundpad & Command Center */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* ≡ƒ¢í∩╕Å NATIVE HARDWARE MODE ACTIVE - SOUNDPAD REMOVED ≡ƒ¢í∩╕Å */}

          {/* Bulk Command Center */}
          <section className="bg-discord-darkest rounded-3xl border border-discord-dark shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-discord-green rounded-xl shadow-lg shadow-discord-green/20">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Bulk Command Center</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-discord-muted uppercase tracking-widest">Manual Guild ID</p>
                <input 
                  type="text" 
                  id="target-guild-id"
                  placeholder="GUILD ID"
                  className="w-full bg-discord-darker border border-discord-dark px-4 py-3 rounded-xl text-white font-mono text-xs outline-none focus:ring-1 focus:ring-discord-green transition-all"
                />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-discord-muted uppercase tracking-widest">Manual Channel ID</p>
                <input 
                  type="text" 
                  id="target-channel-id"
                  placeholder="CHANNEL ID"
                  className="w-full bg-discord-darker border border-discord-dark px-4 py-3 rounded-xl text-white font-mono text-xs outline-none focus:ring-1 focus:ring-discord-green transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-2 bg-discord-darker rounded-2xl border border-discord-dark shadow-inner">
                <input 
                  type="text" 
                  placeholder="Paste Invite Link (discord.gg/...) "
                  className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white font-medium placeholder:text-discord-muted"
                  value={inviteLink}
                  onChange={(e) => setInviteLink(e.target.value)}
                />
                <button 
                  onClick={() => onJoinAll(inviteLink)}
                  className="bg-discord-green hover:bg-discord-green/80 text-white px-10 py-4 rounded-xl font-black shadow-lg shadow-discord-green/20 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Join All Bots
                </button>
              </div>

              <div className="flex gap-4 p-2 bg-discord-darker rounded-2xl border border-discord-dark shadow-inner">
                <textarea 
                  placeholder="Global Broadcast Message... "
                  className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white font-medium placeholder:text-discord-muted h-20 resize-none"
                  value={massMsg}
                  onChange={(e) => setMassMsg(e.target.value)}
                />
                <button 
                  onClick={() => {
                    if (massMsg && window.electronAPI) {
                      window.electronAPI.send('mass-message', massMsg);
                      setMassMsg('');
                      showNotification('BROADCAST SENT', 'success');
                    }
                  }}
                  className="bg-discord-blurple hover:bg-discord-blurple/80 text-white px-10 py-4 rounded-xl font-black shadow-lg shadow-discord-blurple/20 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Blast Message
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Bot Factory & Stats */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-discord-darkest rounded-3xl border border-discord-dark shadow-2xl p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <Cpu className="w-4 h-4" /> System Health
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-discord-muted">CPU LOAD</span>
                    <span className={sysStats.cpu > 80 ? 'text-discord-red' : 'text-discord-green'}>{sysStats.cpu}%</span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-discord-blurple transition-all duration-1000" style={{ width: `${sysStats.cpu}%` }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-discord-muted">RAM USAGE</span>
                    <span className="text-discord-green">{sysStats.ram}%</span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-discord-green transition-all duration-1000" style={{ width: `${sysStats.ram}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap className="w-4 h-4" /> Global Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => window.electronAPI?.joinAllBotsToCurrentVC?.()} className="bg-discord-green/10 text-discord-green border border-discord-green/20 py-3 rounded-xl text-[10px] font-black hover:bg-discord-green hover:text-white transition-all active:scale-95">STAY IN VC</button>
                <button onClick={() => window.electronAPI?.leaveAllBotsFromVC?.()} className="bg-discord-red/10 text-discord-red border border-discord-red/20 py-3 rounded-xl text-[10px] font-black hover:bg-discord-red hover:text-white transition-all active:scale-95">LEAVE VC</button>
                <button onClick={() => window.electronAPI?.send('global-audio', 'unmute')} className="bg-discord-green/10 text-discord-green border border-discord-green/20 py-3 rounded-xl text-[10px] font-black hover:bg-discord-green hover:text-white transition-all active:scale-95">UNMUTE ALL</button>
                <button onClick={() => window.electronAPI?.send('global-audio', 'mute')} className="bg-discord-red/10 text-discord-red border border-discord-red/20 py-3 rounded-xl text-[10px] font-black hover:bg-discord-red hover:text-white transition-all active:scale-95">MUTE ALL</button>
                <button onClick={() => window.electronAPI?.send('global-audio', 'deafen')} className="bg-discord-blurple/10 text-discord-blurple border border-discord-blurple/20 py-3 rounded-xl text-[10px] font-black hover:bg-discord-blurple hover:text-white transition-all active:scale-95">DEAFEN ALL</button>
                <button onClick={() => window.location.reload()} className="bg-white/5 text-white/60 border border-white/10 py-3 rounded-xl text-[10px] font-black hover:bg-white/10 hover:text-white transition-all active:scale-95">RELOAD UI</button>
              </div>
            </div>
          </section>

          <section className="bg-discord-darkest rounded-3xl border border-discord-dark shadow-2xl p-8 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Army Activity Log
              </h3>
              <button onClick={() => setLogs([])} className="text-[10px] text-discord-muted hover:text-white transition-all uppercase font-bold">Clear Logs</button>
            </div>
            <div className="bg-black/40 rounded-2xl p-4 h-[300px] overflow-y-auto font-mono text-[10px] space-y-2 border border-white/5 scrollbar-hide">
              {logs.length === 0 ? (
                <div className="text-discord-muted/30 italic text-center pt-20">SYSTEM_IDLE: Awaiting Commands...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2">
                    <span className="text-discord-muted">[{new Date().toLocaleTimeString()}]</span>
                    <span className={log.type === 'error' ? 'text-discord-red' : log.type === 'success' ? 'text-discord-green' : 'text-discord-blurple'}>
                      {log.msg}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-discord-darkest rounded-3xl border border-discord-dark shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-discord-yellow rounded-xl shadow-lg shadow-discord-yellow/20">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Bot Factory</h2>
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] text-discord-muted font-black uppercase tracking-[0.2em]">Add Tokens to Initialize</p>
              <label className="cursor-pointer text-[10px] font-black text-discord-blurple hover:underline uppercase tracking-widest">
                Import .txt
                <input type="file" className="hidden" accept=".txt" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (re) => {
                      const tokens = re.target.result.split('\n').map(t => t.trim()).filter(t => t.length > 0);
                      const input = document.getElementById('token-input-tower');
                      input.value = tokens.join('\n');
                      showNotification(`Imported ${tokens.length} tokens`, 'success');
                    };
                    reader.readAsText(file);
                  }
                }} />
              </label>
            </div>
            <textarea
              placeholder="Paste tokens here (one per line)..."
              rows={8}
              id="token-input-tower"
              className="w-full bg-discord-darker border border-discord-dark text-discord-text py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-discord-yellow transition-all font-mono text-xs mb-4 scrollbar-hide shadow-inner"
            />
            
            <div className="space-y-3 mb-6">
              <p className="text-[10px] text-discord-muted font-black uppercase tracking-[0.2em]">Manual Login Vault (Optional)</p>
              <input 
                id="vault-email"
                type="text" 
                placeholder="Email Address"
                className="w-full bg-discord-darker border border-discord-dark text-white py-3 px-4 rounded-xl outline-none text-xs"
              />
              <input 
                id="vault-pass"
                type="password" 
                placeholder="Password"
                className="w-full bg-discord-darker border border-discord-dark text-white py-3 px-4 rounded-xl outline-none text-xs"
              />
            </div>

            <div className="flex gap-4 mb-6">
              <button 
                onClick={async () => {
                  const input = document.getElementById('token-input-tower');
                  const tokens = input.value.split('\n').map(t => t.trim()).filter(t => t.length > 0);
                  if (tokens.length === 0) return showNotification('No tokens to check', 'error');
                  
                  showNotification(`Checking ${tokens.length} tokens...`, 'info');
                  const validTokens = [];
                  for (const token of tokens) {
                    try {
                      const res = await fetch('https://discord.com/api/v9/users/@me', {
                        headers: { Authorization: token }
                      });
                      if (res.status === 200) validTokens.push(token);
                    } catch (e) {}
                  }
                  input.value = validTokens.join('\n');
                  showNotification(`Found ${validTokens.length} Valid Tokens!`, 'success');
                }}
                className="flex-1 bg-discord-dark hover:bg-discord-darker text-discord-muted py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-discord-dark transition-all"
              >
                Validate Tokens
              </button>
            </div>
            <button 
              onClick={async () => {
                const input = document.getElementById('token-input-tower');
                const emailInput = document.getElementById('vault-email');
                const passInput = document.getElementById('vault-pass');
                
                const tokens = input.value.split('\n').map(t => t.trim()).filter(t => t.length > 0);
                if (tokens.length === 0) return showNotification('No tokens found', 'error');
                
                input.value = '';
                showNotification(`Safety Loader Active: Initializing ${tokens.length} bots...`, 'info');

                for (let i = 0; i < tokens.length; i++) {
                  const newBot = {
                    id: `bot-${Date.now()}-${i}`,
                    name: `VEERA BOT ${safeProfiles.length + i + 1}`,
                    color: '#5865f2',
                    token: tokens[i],
                    email: emailInput.value, // Save for auto-login
                    password: passInput.value, // Save for auto-login
                    createdAt: new Date().toISOString()
                  };
                  
                  addProfile(null, null, [newBot]);
                  const delay = 2000 + Math.floor(Math.random() * 3000);
                  if (i < tokens.length - 1) await new Promise(r => setTimeout(r, delay));
                }
                
                emailInput.value = '';
                passInput.value = '';
                showNotification(`Successfully initialized ${tokens.length} bots with Vault Support!`, 'success');
              }}
              className="w-full bg-discord-yellow hover:bg-discord-yellow/80 text-discord-darkest py-5 rounded-2xl font-black shadow-lg shadow-discord-yellow/20 transition-all active:scale-95 text-sm uppercase tracking-widest"
            >
              Initialize All (Vault Mode)
            </button>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between p-4 bg-discord-darker rounded-2xl border border-discord-dark shadow-sm">
                <span className="text-[10px] font-black text-discord-muted uppercase tracking-widest">Security Mode</span>
                <span className="text-[10px] font-black text-discord-green uppercase">ISOLATED</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-discord-darker rounded-2xl border border-discord-dark shadow-sm">
                <span className="text-[10px] font-black text-discord-muted uppercase tracking-widest">Persistence</span>
                <span className="text-[10px] font-black text-discord-green uppercase">ACTIVE</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* MISSION LOG MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-black/80 backdrop-blur-xl animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-5xl h-full bg-discord-darkest border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-discord-red/20 rounded-2xl">
                  <Terminal className="w-6 h-6 text-discord-red" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Mission Control Console</h2>
                  <p className="text-[10px] text-discord-muted font-bold uppercase tracking-widest">Real-time system heartbeat & bot signals</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLogs([])}
                  className="px-6 py-2 rounded-xl text-[10px] font-black text-discord-muted hover:text-white transition-all uppercase tracking-widest border border-white/5"
                >
                  Purge Logs
                </button>
                <button 
                  onClick={() => setShowLogModal(false)}
                  className="p-4 bg-white/5 hover:bg-discord-red/20 hover:text-discord-red text-white rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar font-mono text-sm space-y-2 bg-black/40">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-discord-muted opacity-30 gap-4">
                  <Terminal className="w-16 h-16" />
                  <p className="font-black uppercase tracking-[0.4em] text-xs">Waiting for bot command signals...</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-6 py-2 border-b border-white/5 last:border-0 group">
                    <span className="text-discord-muted shrink-0 opacity-40 font-bold">[{log.time}]</span>
                    <span className={`font-medium ${log.type === 'error' ? 'text-discord-red bg-discord-red/10 px-2 rounded' : 'text-discord-green'}`}>
                      {log.msg}
                    </span>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
