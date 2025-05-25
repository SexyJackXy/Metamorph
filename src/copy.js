const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const maxConcurrent = 200;
let activeTasks = 0;
const taskQueue = [];

let backupRunning = false;

function runLimited(task) {
    return new Promise((resolve, reject) => {
        const wrapped = () => {
            activeTasks++;
            task()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    activeTasks--;
                    if (taskQueue.length > 0) {
                        const next = taskQueue.shift();
                        next();
                    }
                });
        };

        if (activeTasks < maxConcurrent) {
            wrapped();
        } else {
            taskQueue.push(wrapped);
        }
    });
}

async function copyDirectoryRecursive(source, target) {
    await fsPromises.mkdir(target, { recursive: true });
    const entries = await fsPromises.readdir(source, { withFileTypes: true });

    const tasks = entries.map(entry => {
        const sourcePath = path.join(source, entry.name);
        const targetPath = path.join(target, entry.name);

        if (entry.isDirectory()) {
            return copyDirectoryRecursive(sourcePath, targetPath);
        } else {
            return runLimited(() => {
                return new Promise((resolve, reject) => {
                    const sourceStream = fs.createReadStream(sourcePath);
                    const targetStream = fs.createWriteStream(targetPath);
                    sourceStream.pipe(targetStream)
                        .on('finish', resolve)
                        .on('error', reject);
                });
            });
        }
    });

    await Promise.all(tasks);
}

async function copyFullBackup(pathList, destinationPath) {
    backupRunning = true;

    try {
        const today = new Date();
        const dateString = today.toLocaleDateString('en-GB').replace(/\./g, '.');
        const newBackupFolder = path.join(destinationPath, `Backup ${dateString}`);

        await fsPromises.mkdir(newBackupFolder, { recursive: true });

        await Promise.all(pathList.map(async sourceDir => {
            if (!sourceDir) return;
            const dirName = path.basename(sourceDir);
            const targetDir = path.join(newBackupFolder, dirName);
            await copyDirectoryRecursive(sourceDir, targetDir);
        }));
    } finally {
        backupRunning = false;
    }
}

module.exports = {
    copyFullBackup
};
