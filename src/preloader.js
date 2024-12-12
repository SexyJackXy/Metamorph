const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld('electron', {
  openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config),
  toJson: (fileName, data) => fs.writeFile('src/meta/backups/' + fileName, data, function (err) {
    if (err) throw err; console.log('Results Received');
    console.log("hat geklappt");
  }),
});
