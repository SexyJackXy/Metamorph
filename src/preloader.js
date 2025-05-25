const { contextBridge, ipcRenderer } = require('electron');
const { copyFullBackup } = require('./copy');
const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electron', {
  openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config),
  toJson: (fileName, data) => {
    fs.writeFile('src/meta/backups/' + fileName, data, function (err) {
      if (err) throw err;
      console.log('Results Received');
      console.log('hat geklappt');
    });
  },
  getFiles: (folderPath) => getAllFilesAsList(folderPath),
  copyFolder: (sourcepaths, destinationpath) => copyFolder(sourcepaths, destinationpath),
  copyFile: (sourcepath, destinationpath) => copyFile(sourcepath, destinationpath),
  checkifDir: (filepath) => checkIfFileOrDir(filepath),
});

function getAllFilesAsList(dirname) {
  var path = dirname;

  var allFiles = fs.readdirSync(path, function (err) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
  });

  return allFiles
}

function readAllFilesInFolder(folderPath) {
  try {
    folderPath = folderPath.trim();
    const files = fs.readdirSync(folderPath);

    const contents = files.map(file => {
      const fullPath = path.join(folderPath, file);
      if (fs.statSync(fullPath).isFile()) {
        return {
          fileName: file,
          fullPath: fullPath,
          content: fs.readFileSync(fullPath, 'utf-8')
        };
      }
    }).filter(Boolean); // filtert mögliche `undefined` (z. B. wenn es kein File war)

    return contents;
  } catch (err) {
    console.error('Fehler beim Lesen des Ordners:', err);
    return null;
  }
}

function copyFolder(pathsToBackup, destinationPath) {
  console.log("Backup... Started");
  (async () => {
    try {
      await copyFullBackup(pathsToBackup, destinationPath);
      console.log('Backup erfolgreich abgeschlossen.');
    } catch (err) {
      console.error('Fehler beim Backup:', err);
    }
  })();
}

function copyFile(sourcepath, destinaionpath) {
  console.log("Copy From Files: ", sourcepath, "to ", destinaionpath)
  var allFiles = readAllFilesInFolder(sourcepath);
  console.log(allFiles);
}

function checkIfFileOrDir(filepath) {
  const path = filepath.trim();
  return fsp.stat(path)
    .then(stats => {
      if (stats.isFile()) {
        return false; // es ist eine Datei
      } else if (stats.isDirectory()) {
        return true; // es ist ein Verzeichnis
      }
    })
    .catch(err => {
      console.error('Fehler beim Prüfen:', err.message);
      return null; // falls der Pfad nicht existiert oder ein Fehler auftritt
    });
}