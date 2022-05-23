const path = require('path');
const fs = require('fs');
const { readdir, copyFile, writeFile, readFile, rm, mkdir } = require('fs/promises');
const stylesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');

async function buildHTML() {
  let templateFile = await readFile(path.join(__dirname, 'template.html'), 'utf8');
  const components = path.join(__dirname, 'components');
  const files = await readdir(components, { withFileTypes: true });
  files.forEach(async file => {
    const filePath = path.join(components, file.name);
    const fileExtansion = path.extname(file.name);
    const template = '{{' + file.name.split('.')[0] + '}}';
    const componentData = await readFile(filePath, 'utf8');
    if (templateFile.includes(template)
      && fileExtansion == '.html') {
      templateFile = templateFile.replace(template, componentData);
      await writeFile((path.join(__dirname, 'project-dist', 'index.html')), templateFile);
    }
  });
}

const pathIn = path.join(__dirname, 'project-dist', 'style.css');
let styles = [];

async function cssBundle(pathToFolder) {
  const files = await readdir(pathToFolder, { withFileTypes: true });
  for (let file of files) {
    const pathToFile = path.join(pathToFolder, file.name);
    const type = path.extname(pathToFile);
    const content = await readFile(pathToFile, 'utf8');
    if (type == '.css') {
      styles.push(content);
    }
  }
  await writeFile(pathIn, styles.join('\n'), 'utf8');
};

async function copyDir(mainFolder, copiedFolder) {
  await rm(copiedFolder, { recursive: true, force: true });
  await mkdir(copiedFolder);
  const files = await readdir(mainFolder, { withFileTypes: true });
  files.forEach(item => {
    if (item.isFile()) {
      copyFile(path.join(mainFolder, item.name), path.join(copiedFolder, item.name));
    }
    if (item.isDirectory()) {
      copyDir(path.join(mainFolder, item.name), path.join(copiedFolder, item.name));
    }
  });
}

async function pageBuild() {
  await rm(projectDir, { recursive: true, force: true });
  await mkdir(projectDir);
  buildHTML();
  cssBundle(stylesDir);
  copyDir(path.join(__dirname, 'assets'), path.join(projectDir, 'assets'));
}

pageBuild();