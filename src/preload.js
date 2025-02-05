const { contextBridge, ipcRenderer } = require ('electron')
console.log('Preload script loaded');

contextBridge.exposeInMainWorld('electron', {
    captureScreenshot: () => ipcRenderer.invoke('capture-screenshot'),
});
