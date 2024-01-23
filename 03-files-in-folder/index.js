const fs = require('fs');
const path = require('path');

const pathToSecretDir = path.join(__dirname, 'secret-folder');
fs.readdir(pathToSecretDir, { withFileTypes: true }, (err, files) => {
  if (err) return console.error(err.message);
  files.forEach((obj) => {
    fs.stat(`${obj.path}\\${obj.name}`, (err, stats) => {
      if (err) return console.error(err.message);
      if (stats.isFile()) {
        console.log(
          `${obj.name.split('.')[0]}-${obj.name.split('.')[1]}-${
            stats['size']
          }bites`,
        );
      }
    });
  });
});
