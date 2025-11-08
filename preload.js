const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getLogs: () => ipcRenderer.invoke('get-logs'),
  addLog: (log) => ipcRenderer.invoke('add-log', log),
  updateLog: (id, log) => ipcRenderer.invoke('update-log', id, log),
  deleteLog: (id) => ipcRenderer.invoke('delete-log', id)
});
