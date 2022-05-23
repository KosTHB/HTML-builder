const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { stdout, stderr } = require('process');
const dir = 'secret-folder';
const fullURL = path.join(__dirname, dir);
const writeFileInfo = (file) => {
  const fullURL = path.join(__dirname, dir, file.name);

  fs.stat(fullURL, (err, stats) => {
    if (err) stderr.write(`there was an error: ${err}`);
    if (stats.isFile()) {
      let ext = path.extname(fullURL).slice(1);
      let info = `${file.name} - ${ext} - ${stats.size / 1024}kb`;
      stdout.write(info + '\r\n');
    }
  });
};

async function getInfo() {
  try {
    const files = await fsPromises.readdir(fullURL, { withFileTypes: true });
    for (const file of files) writeFileInfo(file);
  } catch (err) {
    stderr.write(`there was an error: ${err}`);
  }
}

getInfo();