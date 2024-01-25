const path = require('path');
const fs = require('fs');
const { stdin, stdout, exit } = process;
const pathToRecords = path.resolve(__dirname, 'text.txt');
let body = '';

function init() {
  fs.writeFile(pathToRecords, body, (error) => {
    if (error) return console.error(error.message);
  });
}

fs.access(pathToRecords, fs.constants.F_OK, (err) => {
  if (err) {
    init();
  } else {
    fs.readFile(pathToRecords, (error, data) => {
      if (error) return console.error(error.message);
      body = data;
    });
  }
});

stdout.write('Hello, enter something:\n');

stdin.on('data', (data) => {
  if (data.toString().split('').slice(0, -2).join('') === 'exit') {
    exit();
  }
  body += data.toString();
  init();
  stdout.write('Enter something else:\n');
});

process.on('SIGINT', () => exit());
process.on('exit', () => stdout.write('Goodbye friend!'));
