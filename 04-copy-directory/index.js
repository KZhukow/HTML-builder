const path = require('path');
const fs = require('fs').promises;

const originalFolderName = 'files';
const originalFolderPath = path.join(__dirname, originalFolderName);

copyFolderName = 'files-copy'
const copyFolderPath = path.join(__dirname, copyFolderName);

async function deleteFolderWithContent(folderPath) {
  await fs.mkdir(folderPath, { recursive: true });
  for (const file of await fs.readdir(folderPath)) {
    const curPath = path.join(folderPath, file);
    if ((await fs.lstat(curPath)).isDirectory()) {
        await deleteFolderWithContent(curPath);
    } else {
        await fs.unlink(curPath);
    }
  }
  await fs.rmdir(folderPath);
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });

  const entries = await fs.readdir(src, { withFileTypes: true });

  entries.forEach(async (entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  });
}

async function start() {
  await deleteFolderWithContent(copyFolderPath);
  await copyDir(originalFolderPath, copyFolderPath);
}

start();