const path = require('path');
const fs = require('fs').promises;

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

async function createBundleCss(srcFolderPath, targetFolderPath, fileName = 'bundle') {
  const bundlePath = path.join(targetFolderPath, `${fileName}.css`);
  await fs.writeFile(bundlePath, '');

  const entries = await fs.readdir(srcFolderPath);

  for (const entry of entries) {
    if (path.extname(entry) === '.css') {
        const filePath = path.join(srcFolderPath, entry);
        const data = await fs.readFile(filePath, 'utf-8');
        await fs.appendFile(bundlePath, data);
    }
  }
}

async function createIndexHtml(srcFilePath, componentsFolderPath, dist, fileName = 'index') {
  const distFilePath = path.join(dist, `${fileName}.html`);
  let srcData = await fs.readFile(srcFilePath, 'utf-8');
  
  const components = await fs.readdir(componentsFolderPath, { withFileTypes: true });

  for (const component of components) {
    if (!component.isFile() && path.extname(component.name) !== '.html') continue;
    const compPath = path.join(componentsFolderPath, component.name);
    const compData = path.parse(compPath);
    const compContent = await fs.readFile(compPath, 'utf-8');
    srcData = srcData.replaceAll(`{{${compData.name}}}`, compContent);
  }
  await fs.writeFile(distFilePath, srcData);
}

async function buildProject() {
  const targetFolderName = 'project-dist';
  const targetFolderPath = path.join(__dirname, targetFolderName);
  const assetsFolderName = 'assets';
  const srcAssetsFolder = path.join(__dirname, assetsFolderName);
  const destAssetsFolder = path.join(targetFolderPath, assetsFolderName);
  const srcStylesPath = path.join(__dirname, 'styles');
  const srcTemplateHtmlPath = path.join(__dirname, 'template.html');
  const srcComponents = path.join(__dirname, 'components');

  await deleteFolderWithContent(targetFolderPath);

  await fs.mkdir(targetFolderPath, { recursive: true });

  await copyDir(srcAssetsFolder, destAssetsFolder);

  await createBundleCss(srcStylesPath, targetFolderPath, 'style');

  await createIndexHtml(srcTemplateHtmlPath, srcComponents, targetFolderPath);
}

buildProject();
