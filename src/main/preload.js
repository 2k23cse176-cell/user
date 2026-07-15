const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getProfiles: () => ipcRenderer.invoke('get-profiles'),
  saveProfiles: (profiles) => ipcRenderer.invoke('save-profiles', profiles),
  clearSessionData: (partitionId) => ipcRenderer.invoke('clear-session-data', partitionId),
  onBroadcastAudio: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('broadcast-audio', subscription);
    return () => ipcRenderer.removeListener('broadcast-audio', subscription);
  },
  onTokenCaptured: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('token-captured', subscription);
    return () => ipcRenderer.removeListener('token-captured', subscription);
  },
  sendBroadcastAudio: (data) => ipcRenderer.send('broadcast-audio', data),
  joinAllBotsToCurrentVC: () => ipcRenderer.send('join-all-bots-to-current-vc'),
  leaveAllBotsFromVC: () => ipcRenderer.send('leave-all-bots-from-vc'),
  stopHeadlessBots: () => ipcRenderer.send('stop-headless-bots'),
  sendVeriyMode: (status) => ipcRenderer.send('veriy-mode-trigger', status),
  registerToken: (id, token) => ipcRenderer.invoke('register-token', { id, token }),
  onAppLog: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('app-log', subscription);
    return () => ipcRenderer.removeListener('app-log', subscription);
  },
  send: (channel, data) => ipcRenderer.send(channel, data)
});



// Persistence & Token Logic
ipcRenderer.on('setup-session', (event, token) => {
  if (token) {
    window.localStorage.setItem('token', '"' + token + '"');
    window.localStorage.setItem('multi-account-tokens', JSON.stringify({ [token]: token }));
    if (window.location.href.includes('/login')) window.location.href = '/app';
  }
});
