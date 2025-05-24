const { contextBridge, ipcRenderer } = require('electron');
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
  checkifDir: (path) => checkIfFileOrDir(path)
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
    folderPath = folderPath.trim(); // entfernt evtl. \n
    const files = fs.readdirSync(folderPath);
    
    const contents = files.map(file => {
      const fullPath = path.join(folderPath, file);
      if (fs.statSync(fullPath).isFile()) {
        return {
          fileName: file,
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

function copyFolder(sourcepaths,destinaionpath){
  console.log("Copy From Folder: ",sourcepaths,"to ", destinaionpath)

  sourcepaths.forEach(folder => {
    var allFiles = getFiles(folder);
    console.log(allFiles);
  });
}

function copyFile (sourcepath,destinaionpath){
  console.log("Copy From Files: ",sourcepath,"to ", destinaionpath)
  var allFiles = readAllFilesInFolder(sourcepath);
  console.log(allFiles);
}

function checkIfFileOrDir(path){
  fs.lstatSync(path).isDirectory() 
}