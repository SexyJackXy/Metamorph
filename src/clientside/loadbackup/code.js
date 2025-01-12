async function loadExsistingsBackup() {
    var backupplans = await electron.getFiles('src/meta/backups');
    var treeView = document.getElementById('treeView');
    var newLine = "\r\n";
    backupplans.forEach(plans => {
        treeView.value += plans + newLine;
    });
    console.log(treeView);
}

async function loadBackupPlan() {

}