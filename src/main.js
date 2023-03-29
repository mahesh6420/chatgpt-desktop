const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow;
const createAboutWindow = require('electron-about-window').default;

let aboutWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            allowTextSelection: true,

        }
    });
    mainWindow.loadURL('https://chat.openai.com');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        if (errorCode === -105 || errorCode === -106) {
            // ERR_NAME_NOT_RESOLVED or ERR_INTERNET_DISCONNECTED
            mainWindow.loadFile('src/offline.html');
        }
    });
}

function readUrls() {
    const urls = JSON.parse(fs.readFileSync('urls.json', 'utf-8'));
    return urls;
}

function writeUrl(url) {
    const urls = readUrls();
    urls.push({ url: url, timestamp: Date.now() });
    fs.writeFileSync('urls.json', JSON.stringify(urls));
}

function deleteOldUrls() {
    const urls = readUrls();
    const threshold = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days
    const newUrls = urls.filter(url => url.timestamp >= threshold);
    fs.writeFileSync('urls.json', JSON.stringify(newUrls));
}

function loadSavedUrls() {
    mainWindow.webContents.executeJavaScript(`
    if (navigator.onLine) {
      ${urls.map(url => `window.postMessage({ type: 'load-url', url: '${url.url}' }, '*');`).join('\n')}
    } else {
      location.href = 'offline.html';
    }
  `);
}

function updateSavedUrls() {
    const urls = readUrls();
    urls.forEach(url => {
        // Check if URL has been updated online and update if necessary
    });
    fs.writeFileSync('urls.json', JSON.stringify(urls));
}



app.on('ready', () => {
    createWindow();
});

// Set the "About" information for the app
app.setAboutPanelOptions({
    applicationName: 'ChatGPT - Desktop',
    applicationVersion: '1.0.0',
    version: '1.0.0',
    credits: 'Machine Learning Dev https://machinelearningdev.com',
    copyright: 'Icon copyright by Icons8 https://icons8.com'
  });

ipcMain.on('switch-offline', () => {
    loadSavedUrls();
});

ipcMain.on('switch-online', () => {
    updateSavedUrls();
});

ipcMain.on('save-url', (event, url) => {
    writeUrl(url);
});

setInterval(deleteOldUrls, 24 * 60 * 60 * 1000); // Run once a day