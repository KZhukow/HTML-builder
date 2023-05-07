const fs = require('fs');
const path = require('path');

const folderName = 'secret-folder';
const pathToFolder = path.join(__dirname, folderName);

const filesData = [];

fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (!file.isFile()) return;
    const { name: fileName } = file;
    const pathToFile = path.join(pathToFolder, fileName);
    const fileData = path.parse(pathToFile);
    fs.stat(pathToFile, (err, stats) => {
      if (err) throw err;
      filesData.push({
        name: fileData.name,
        ext: fileData.ext.slice(1),
        size: `${stats.size} bite`,
      });
    });
  })
});

process.on('exit', () => {
  if (filesData.length) {
    // Красивый вывод в консоль
    console.table(filesData);

    // Вывод по примеру из требований
    // (можно раскомментировать и будет вывод как в примере)
    // filesData.forEach((fileData) => {
    //   console.table(`${fileData.name} - ${fileData.ext} - ${fileData.size}`)
    // });
  } else {
    console.log(`\nThere are no files in folder "${folderName}"\n`)
  }
});
