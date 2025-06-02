async function pageLoad() {
    var dir = 'src/meta/backups';

    var backupplanCounter = document.getElementById("backupplansCounter");
    var count = await electron.countFilesInDir(dir);
    console.log(count);

    backupplanCounter.innerHTML = count;
}