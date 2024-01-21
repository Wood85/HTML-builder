const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

function copyDir() {
  const pathToFiles = path.join(__dirname, 'files');
  const pathToCopy = path.join(__dirname, 'files-copy');
  fsPromises.mkdir(pathToCopy, { recursive: true }).then(() => {
    fs.readdir(pathToCopy, (err, files) => {
      if (err) return console.error(err.message);
      files.forEach((file) => {
        fs.unlink(path.join(pathToCopy, file), (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    });
    fs.readdir(pathToFiles, (err, files) => {
      if (err) return console.error(err.message);
      files.forEach((file) => {
        fs.copyFile(
          path.join(pathToFiles, file),
          path.join(pathToCopy, file),
          (err) => {
            if (err) {
              console.error(err);
            }
          },
        );
      });
    });
  });
}

copyDir();
