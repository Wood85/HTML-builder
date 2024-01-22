const fs = require('fs');
const path = require('path');

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
  if (err) {
    console.error(err.message);
  }
});

const pathToStyles = path.join(__dirname, 'styles');
fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
  if (err) return console.error(err.message);
  files.forEach((obj) => {
    fs.stat(`${obj.path}\\${obj.name}`, (err, stats) => {
      if (err) return console.error(err.message);
      if (stats.isFile() && path.extname(obj.name) === '.css') {
        fs.readFile(`${obj.path}\\${obj.name}`, 'utf8', (err, fileContent) => {
          if (err) return console.error(err.message);
          fs.appendFile(
            path.join(__dirname, 'project-dist', 'bundle.css'),
            fileContent,
            (err) => {
              if (err) {
                console.error(err.message);
              }
            },
          );
        });
      }
    });
  });
});
