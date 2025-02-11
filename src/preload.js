const { contextBridge, ipcRenderer } = require ('electron')
console.log('Preload script loaded');

contextBridge.exposeInMainWorld('electron', {
    updateUserName: (callback) => ipcRenderer.on('got-user-name', (_event, value) => callback(value)),
});
