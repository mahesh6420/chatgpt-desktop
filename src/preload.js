const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    savePage: (url, title) => ipcRenderer.send('save-page', { url, title }),
});