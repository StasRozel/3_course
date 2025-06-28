const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');

// Получаем аргументы командной строки
const args = process.argv.slice(2);
// Устанавливаем путь к HTML файлу из аргумента или используем дефолтный
const choise = args.length > 0 ? args[0] : 'BBS';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Загружаем HTML файл из переданного пути
  mainWindow.loadFile(`./${choise}/index.html`);
  require('@electron/remote/main').enable(mainWindow.webContents);
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  require('@electron/remote/main').initialize();
  
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});