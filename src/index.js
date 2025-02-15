import { app, BrowserWindow, desktopCapturer, globalShortcut, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import 'dotenv/config';
import fs from 'fs';
import path from 'node:path';
import { createWorker } from 'tesseract.js';
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
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    const ret = globalShortcut.register('Ctrl+Shift+K', () => {
        main()
            .then();
    })

    if (!ret) {
        console.log('registration failed')
    }

    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered('Ctrl+Shift+K'))
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle screenshot capture from renderer
ipcMain.handle('capture-screenshot', async () => {
    return await main();
});

async function main() {
    console.log('Starting main function...')
    const screenshotPath = await captureScreenshot();
    const croppedPath = await cropScreenshot(screenshotPath);
    const userName = await readText(croppedPath);
    console.log(`Found text: ${userName}`);
    const userInformation = await getUserInformationByUserName(userName);
    if (!userInformation) {
        console.log('Could not find a name...');
        return;
    }
    mainWindow.webContents.send("got-user-name", userInformation);
    // fs.writeFileSync(path.join(__dirname, 'response.json'), JSON.stringify(userInformation));
    console.log(`Current Level: ${userInformation.battlePass.level}`);
    console.log(`Overall K/D: ${userInformation.stats.all.overall.kd}`);
    console.log(`Win Rate: ${userInformation.stats.all.overall.winRate}`);
}

async function captureScreenshot() {
    console.log('Capturing screenshot...');
    const screen = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: {width: 1980, height: 1080} });
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await fs.writeFileSync(screenshotPath, screen[0].thumbnail.toJPEG(1080));
    return screenshotPath
}

async function cropScreenshot(imagePath){
    console.log('Cropping screenshot...');
    const croppedPath = path.join(__dirname, 'screenshot_crop.png');
    await sharp(imagePath)
        .extract({ width: 500, height: 75, left: 700, top: 40 }) // Crop starting from (700,50)
        .toFile(croppedPath);

    return croppedPath
}

async function getUserInformationByUserName(userName) {
    const url = `https://fortnite-api.com/v2/stats/br/v2?name=${userName}`;
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.FORTNITE_API_KEY,
            }
        });
        if (!response.ok) {
            new Error(`Response status: ${response.status}`);
        }

        const responseJson = await response.json();
        return responseJson.data;
    } catch (error) {
        console.log(error);
    }
}

async function readText(imagePath) {
    console.log('Recognizing text...')
    const worker = await createWorker('eng');
    const result = await worker.recognize(imagePath);
    await worker.terminate();
    return result.data.text;
}
