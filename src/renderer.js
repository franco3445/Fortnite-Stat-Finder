document.getElementById('screenshotBtn').addEventListener('click', async () => {
    const statusText = document.getElementById('status');
    statusText.textContent = "Capturing screenshot...";

    try {
        const filePath = await window.electron.captureScreenshot();
        statusText.textContent = `Screenshot saved: ${filePath}`;
    } catch (error) {
        statusText.textContent = 'Failed to capture screenshot.';
        console.error(error);
    }
});
