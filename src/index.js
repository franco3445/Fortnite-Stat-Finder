import {
    app,
    BrowserWindow,
    globalShortcut,
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

if (started) {
    app.quit();
}

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(directoryName, 'preload.js'),
        },
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
        console.log('registration failed')
    }

    console.log(globalShortcut.isRegistered('Ctrl+Shift+K'))
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

async function main() {
    try {
        const screenshotPath = await captureScreenshot(directoryName);

        const croppedPath = await cropScreenshot(directoryName, screenshotPath);

        const userName = await readText(croppedPath);

        const userInformation = await getUserInformationByUserName(userName);
        
        if (!userInformation) {
            mainWindow.webContents.send('got-user-name', userName);
            await deleteAsync(path.join(directoryName, '/tempScreenshots'));
            return;
        }
        mainWindow.webContents.send('got-user-name', userName);
        mainWindow.webContents.send('got-user-info', userInformation);
        await deleteAsync(path.join(directoryName, '/tempScreenshots'));
    } catch (error) {
        console.log(error);
    }

}
