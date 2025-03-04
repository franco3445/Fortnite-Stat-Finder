import { createWorker } from 'tesseract.js';

export async function readText(imagePath) {
    if (!imagePath) {
        throw Error('An `imagePath` is required');
    }

    const worker = await createWorker('eng');
    const result = await worker.recognize(imagePath);
    await worker.terminate();

    return result.data.text;
}
