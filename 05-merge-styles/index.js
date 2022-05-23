const path = require('path');
const { writeFile, readdir, readFile } = require('fs').promises;
let styles = [];
const pathIn = path.join(__dirname, 'project-dist', 'bundle.css');
const pathOut = path.join(__dirname, 'styles');

(async () => {
  const files = await readdir(pathOut, { withFileTypes: true });
  for (let file of files) {
    const pathToFile = path.join(pathOut, file.name);
    const type = path.extname(pathToFile);
    const content = await readFile(pathToFile, 'utf8');

    if (type == '.css') {
      styles.push(content);
    }
  }
  await writeFile(pathIn, styles.join('\n'), 'utf8');
})();