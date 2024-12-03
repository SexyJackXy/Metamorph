const { app, BrowserWindow } = require('electron')
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
    height: 563,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
      // preload: path.join(__dirname, 'scripts/preload.js'),
    },
  })

  mainWindow.loadFile(path.join(__dirname, 'clientside/landingpage/index.html'));

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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})