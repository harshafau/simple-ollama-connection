const { contextBridge, ipcRenderer, shell } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    // App info
    getAppVersion: () => process.env.npm_package_version || '1.0.0',

    // External links
    openExternal: (url) => shell.openExternal(url),

    // System info
    getPlatform: () => process.platform,

    // IPC communication
    send: (channel, data) => {
      // Whitelist channels
      const validChannels = ['get-models', 'save-settings', 'get-settings'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      const validChannels = ['models-result', 'settings-saved', 'settings-result'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    removeAllListeners: (channel) => {
      const validChannels = ['models-result', 'settings-saved', 'settings-result'];
      if (validChannels.includes(channel)) {
        ipcRenderer.removeAllListeners(channel);
      }
    }
  }
);
