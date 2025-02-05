import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Securely expose APIs
    },
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle screenshot capture from renderer
ipcMain.handle('capture-screenshot', async () => {
  const screen = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: {width: 1980, height: 1080} });
  const screenshotPath = path.join(__dirname, 'screenshot.png');
  fs.writeFileSync(screenshotPath, screen[0].thumbnail.toJPEG(1080));

  return screenshotPath; // Send path back to renderer
});
