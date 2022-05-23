const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const { stdin, stdout } = process;
const txtPath = path.join(__dirname, 'text.txt');
const input = fs.createReadStream(txtPath, 'utf-8');
const output = fs.createWriteStream(txtPath);
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Введите текст');

readline.on('SIGINT', (code) => {
  console.log('Удачи в изучении Node.js!');
  exit();
});

readline.on('line', text => {
  if (text.indexOf('exit') !== -1) {
    console.log('Удачи в изучении Node.js!');
    exit();
  }
  else fs.appendFile(txtPath, text + '\n', exit => { });
})


