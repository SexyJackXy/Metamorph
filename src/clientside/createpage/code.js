const date = new Date();
const dialogConfig = { folder: { properties: ['openDirectory'] }, file: { properties: ['openFile'] } };

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

async function save_btn_click(params) {
    var sourceList = document.getElementById('srcFolder_tbx').value;    //TextArea
    var destPath = document.getElementById('destFolder_tbx').value;     //Input
    var statusMessage = document.getElementsByClassName('feedback')[0];

    const date = new Date();
    let fielDate = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    const fileName = "Backup " + fielDate + ".json";

     statusMessage.style.display = "none"

    if (destPath == "") {
        statusMessage.textContent = `Destination muss ausgefüllt sein`;
        statusMessage.style.color = 'red';
        statusMessage.style.display = "block"
    }
    else if (sourceList == "") {
        statusMessage.textContent = `Sourcelist muss ausgefüllt sein`;
        statusMessage.style.color = 'red';
        statusMessage.style.display = "block"
    }
    else {
        const backupPlan = {
            destinationpath: destPath,
            sourcepaths: sourceList,
            compress: false,
            incremental: false,
        };

        try {
            const data = JSON.stringify(backupPlan);
            await electron.toJson(fileName, data);

            statusMessage.style.display = "block"
        } catch (error) {
            // Fehlerbehandlung
            statusMessage.textContent = `Fehler beim Speichern: ${error.message}`;
            statusMessage.style.color = 'red';
            statusMessage.style.display = "block"
        }
    }
}

async function copy_btn_click(params) {
    var sourceList = document.getElementById('srcFolder_tbx').value;    //TextArea
    var sourceArray = sourceList.split('\n').map(item => item.trim()).filter(item => item !== '');                         //Array
    var destPath = document.getElementById('destFolder_tbx').value;


    document.body.style.cursor = 'wait';

    electron.checkifDir(sourceList).then((result) => {
        if (result) {
            electron.copyFolder(sourceArray, destPath)
        }
        else {
            electron.copyFile(sourceList, destPath)
        }
    }
    );

}