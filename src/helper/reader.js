import { createWorker } from 'tesseract.js';

export async function readText(imagePath) {
    const worker = await createWorker('eng');
    const result = await worker.recognize(imagePath);
    await worker.terminate();
    return result.data.text;
}