const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    // We'll add any needed IPC methods here in the future
    // For now, we don't need any as our proxy server handles the communication
  }
);
