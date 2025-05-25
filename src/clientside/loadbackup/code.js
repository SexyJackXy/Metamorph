async function loadExsistingsBackup() {
    var backupplans = await electron.readAllFiles('src/meta/backups');
    var planListUl = document.getElementById('planListUl');
    var list = [];

    backupplans.forEach(plan => {
        var listEntry = "<li><a id=\"backupplan\" href=\"" + plan.fullPath + "\">" + plan.fileName + "</a></li>";
        list.push(listEntry);
    })

    planListUl.innerHTML = list.join('');

    console.log(list);
}