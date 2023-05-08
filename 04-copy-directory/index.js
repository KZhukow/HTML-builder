const path = require('path');
const fs = require('fs').promises;

const originalFolderName = 'files';
const originalFolderPath = path.join(__dirname, originalFolderName);

copyFolderName = 'files-copy'
const copyFolderPath = path.join(__dirname, copyFolderName);

async function deleteFolderWithContent(folderPath) {
  await fs.mkdir(folderPath, { recursive: true });
  const files = await fs.readdir(folderPath, { withFileTypes: true })
  for (const file of files) {
    const curPath = path.join(folderPath, file.name);
    if (file.isDirectory()) {
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
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function copyFolder(src, dest) {
  await deleteFolderWithContent(dest);
  await copyDir(src, dest);
}

copyFolder(originalFolderPath, copyFolderPath);