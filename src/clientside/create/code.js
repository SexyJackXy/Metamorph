const dialogConfig_Folder = {
    properties: ['openDirectory']
};

function openFolderDialog() {
    var srcFolder_tbx = document.getElementById('srcFolder_tbx');
    electron.openDialog('showOpenDialog', dialogConfig_Folder)
        .then(result => {
            if (result && !result.canceled) {
                folderPaths = result.filePaths
                srcFolder_tbx.value += folderPaths + "\n"
            }
        })
}