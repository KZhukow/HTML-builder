const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;

const pathToDist = path.join(__dirname, 'project-dist');
const pathToFolderWithStyles = path.join(__dirname, 'styles');

async function createBundleCss(folderWithStyles, folderWithBundle) {
  const bundlePath = path.join(folderWithBundle, 'bundle.css');
  await fsp.writeFile(bundlePath, '');
  const bundleWriteStream = fs.createWriteStream(bundlePath);

  const entries = await fsp.readdir(folderWithStyles);

  for (const entry of entries) {
    if (path.extname(entry) === '.css') {
        const filePath = path.join(folderWithStyles, entry);
        const data = (await fsp.readFile(filePath)).toString();
        bundleWriteStream.write(`${data}\n`);
    }
  }

  bundleWriteStream.end();
}

createBundleCss(pathToFolderWithStyles, pathToDist);
