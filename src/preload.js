const { contextBridge, ipcRenderer } = require ('electron')
console.log('Preload script loaded');

contextBridge.exposeInMainWorld('electron', {
    updateUserName: (callback) => ipcRenderer.on(
        'got-user-name',
        (_event, value) => callback(value)
    ),
    updateUserInfo: (callback) => ipcRenderer.on(
        'got-user-info',
        (_event, value) => callback(value)
    ),
});

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel,data)
})
