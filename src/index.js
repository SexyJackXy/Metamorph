const { app, BrowserWindow } = require('electron')
const { ipcMain, dialog } = require('electron');
const path = require('node:path');


if (require('electron-squirrel-startup')) {
  app.quit();
}

try {
  require('electron-reloader')(module)
} catch (_) {}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 675,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preloader.js'),
    },
  })

  mainWindow.loadFile(path.join(__dirname, 'clientside/landingpage/landingpage.html'));

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

ipcMain.handle('dialog', (event, method, params) => {       
  return dialog[method](params)
    .then(result => {
      console.log(result);
      return result; 
    })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})