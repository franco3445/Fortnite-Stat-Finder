import {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
} from 'electron';
import started from 'electron-squirrel-startup';
import 'dotenv/config';
import { deleteAsync } from 'del';
import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { getUserInformationByUserName } from './helper/caller.js';
import { readText } from './helper/reader.js';
import {
    captureScreenshot,
    cropScreenshot,
} from './helper/screenshot.js'

const __filename = fileURLToPath(import.meta.url);
const directoryName = dirname(__filename);

const tempUserInformation = {
    wins: '...',
    kdRatio: '...',
    winRate: '...',
    level: '...',
}

if (started) {
    app.quit();
}

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        frame: false,
        height: 400,
        webPreferences: {
            preload: path.join(directoryName, 'preload.js'),
        },
        maxHeight: 400,
        maxWidth: 600,
        minHeight: 400,
        minWidth: 600,
        transparent: true,
        alwaysOnTop: true,
        width: 600,
    });

    mainWindow.loadFile(path.join(directoryName, 'index.html'));
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
        console.log('Key bind registration failed.')
    }

    mainWindow.webContents.send('got-user-info', tempUserInformation);
});

async function main() {
    try {
        // Set window to "loading"
        mainWindow.webContents.send('got-user-info', tempUserInformation);

        const screenshotPath = await captureScreenshot(directoryName);

        const croppedPath = await cropScreenshot(directoryName, screenshotPath);

        const userName = await readText(croppedPath);

        const userInformation = await getUserInformationByUserName(userName);
        
        await displayResults(userName, userInformation);
    } catch (error) {
        console.log(error);
    }
}

async function displayResults(userName, userInformation) {
    if (!userInformation) {
        mainWindow.webContents.send('got-user-name', userName);
        mainWindow.webContents.send('got-user-info', tempUserInformation);
        await deleteAsync(path.join(directoryName, '/tempScreenshots'));
        return;
    }
    mainWindow.webContents.send('got-user-name', userName);
    mainWindow.webContents.send('got-user-info', userInformation);
    await deleteAsync(path.join(directoryName, '/tempScreenshots'));
}

ipcMain.on('close-app', () => {
    app.quit();
});

ipcMain.on('userInput',(event, userName) => {
    mainWindow.webContents.send('got-user-info', tempUserInformation);
    getUserInformationByUserName(userName).then(requestedInformation => {
        displayResults(userName, requestedInformation).then(r => {
            console.log('User input complete.')
        })
    });
})
