import { desktopCapturer } from 'electron';
import path from 'node:path';
import fs from 'fs';
import sharp from 'sharp';

export async function captureScreenshot(directoryName) {
    if (!directoryName) {
        throw Error('A `directoryName` is required');
    }

    const screen = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
            height: 1080,
            width: 1980,
        }
    });
    const screenshotPath = path.join(directoryName, '/tempScreenshots/screenshot.png');

    await fs.writeFileSync(
        screenshotPath,
        screen[0].thumbnail.toJPEG(1080)
    );

    return screenshotPath;
}

export async function cropScreenshot(directoryName, imagePath){
    if (!directoryName) {
        throw Error('A `directoryName` is required');
    }

    if (!imagePath) {
        throw Error('An `imagePath` is required');
    }

    const croppedPath = path.join(directoryName, 'tempScreenshots/screenshot_crop.png');
    await sharp(imagePath)
        .extract({
            width: 500,
            height: 75,
            left: 700,
            top: 40
        })
        .toFile(croppedPath);

    return croppedPath;
}
