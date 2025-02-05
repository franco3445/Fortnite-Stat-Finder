import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import fs from 'fs';
import path from 'node:path';
import sharp from 'sharp';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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
    return await createScreenshot();
});

async function createScreenshot() {
    const screen = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: {width: 1980, height: 1080} });
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await fs.writeFileSync(screenshotPath, screen[0].thumbnail.toJPEG(1080));
    return cropScreenshot(screenshotPath)
    // return screenshotPath; // Send path back to renderer
}

async function cropScreenshot(imagePath){
    const croppedPath = path.join(__dirname, 'screenshot_crop.png');
    await sharp(imagePath)
        .extract({ width: 500, height: 50, left: 700, top: 50 }) // Crop starting from (50,50)
        .toFile(croppedPath);

    return croppedPath
}