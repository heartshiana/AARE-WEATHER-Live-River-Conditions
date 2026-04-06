/**
 * Aare Weather — main.js
 * Electron entry point. Creates the BrowserWindow and loads index.html.
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 780,
    minWidth: 400,
    minHeight: 600,
    title: 'Aare Weather',
    backgroundColor: '#060d1f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the app's HTML file
  win.loadFile(path.join(__dirname, 'index.html'));

  // Uncomment to open DevTools on launch:
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // macOS: re-create window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});