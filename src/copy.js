const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

function createBinData(targetDir, mode) {
    console.log(`BinData für ${mode} erstellt in ${targetDir}`);
}

async function copyDirectoryRecursive(source, target) {
    await fsPromises.mkdir(target, { recursive: true });
    const entries = await fsPromises.readdir(source, { withFileTypes: true });

    const tasks = entries.map(async entry => {
        const sourcePath = path.join(source, entry.name);
        const targetPath = path.join(target, entry.name);

        if (entry.isDirectory()) {
            await copyDirectoryRecursive(sourcePath, targetPath);
        } else {
            const sourceStream = fs.createReadStream(sourcePath);
            const targetStream = fs.createWriteStream(targetPath);
            await new Promise((resolve, reject) => {
                sourceStream.pipe(targetStream)
                    .on('finish', resolve)
                    .on('error', reject);
            });
        }
    });

    await Promise.all(tasks);
}

async function copyFullBackup(pathList, destinationPath) {
    const today = new Date();
    const dateString = today.toLocaleDateString('de-DE').replace(/\./g, '-');
    const newBackupFolder = path.join(destinationPath, `Backup ${dateString}`);

    await fsPromises.mkdir(newBackupFolder, { recursive: true });
    createBinData(newBackupFolder, "Full");

    await Promise.all(pathList.map(async sourceDir => {
        if (!sourceDir) return;

        const dirName = path.basename(sourceDir);
        const targetDir = path.join(newBackupFolder, dirName);
        await copyDirectoryRecursive(sourceDir, targetDir);
    }));
}

// Exportieren für andere Dateien
module.exports = { copyFullBackup };
