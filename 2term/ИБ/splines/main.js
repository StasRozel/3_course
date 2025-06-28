// main.js - Главный процесс Electron
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  mainWindow.loadFile('index.html');
  
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC обработчики
ipcMain.handle('select-image', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'bmp'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('save-image', async (event, imageBuffer, defaultName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName || 'encrypted_image.png',
    filters: [
      { name: 'PNG Images', extensions: ['png'] }
    ]
  });
  
  if (!result.canceled) {
    fs.writeFileSync(result.filePath, imageBuffer);
    return result.filePath;
  }
  return null;
});

ipcMain.handle('process-image', async (event, imagePath, message, isEncrypt) => {
  try {
    const steganography = require('./steganography');
    
    if (isEncrypt) {
      const result = await steganography.encryptMessage(imagePath, message);
      return { success: true, data: result };
    } else {
      const result = await steganography.decryptMessage(imagePath);
      return { success: true, message: result };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});