const dialogConfig = {
    folder: { properties: ['openDirectory'] },
    file: { properties: ['openFile'] }
};

async function openDialog(type) {
    try {
        const result = await electron.openDialog('showOpenDialog', dialogConfig[type]);
        return result && !result.canceled ? result.filePaths : null;
    } catch (error) {
        console.error(`Fehler beim Öffnen des ${type}:`, error);
        return null;
    }
}

async function addFolder(type, elementId) {
    const paths = await openDialog(type);
    if (paths) {
        const element = document.getElementById(elementId);
        element.value += paths + '\n'; 
    }
}

async function addDestionationFolder() {
    await addFolder('folder', 'destFolder_tbx');
}

async function addSourceFolder() {
    await addFolder('folder', 'srcFolder_tbx');
}

async function addSourceFile() {
    await addFolder('file', 'srcFolder_tbx');
}

function saveBackup(){
    var destiantionPath = getElementById("destFolder_tbx");
    var sourceList = getElementById("srcFolder_tbx");

    console.log(destiantionPath);
    console.log(sourceList);
}