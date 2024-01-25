const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

function createDir() {
  fsPromises.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true,
  });
}

const pathToDistAssets = path.join(__dirname, 'project-dist', 'assets');
const pathToAssets = path.join(__dirname, 'assets');

async function copyDir(patnFrom = pathToAssets, pathTo = pathToDistAssets) {
  try {
    const files = await fsPromises.readdir(patnFrom, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        await fsPromises.copyFile(
          path.resolve(patnFrom, file.name),
          path.resolve(pathTo, file.name),
        );
      }
      if (file.isDirectory()) {
        await madeDirectory(path.resolve(pathToDistAssets, file.name));
        await cleanFolder(path.resolve(pathToDistAssets, file.name));
        copyDir(
          path.resolve(pathToAssets, file.name),
          path.resolve(pathToDistAssets, file.name),
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function madeDirectory(pathTo = pathToDistAssets) {
  try {
    await fsPromises.mkdir(pathTo, { recursive: true });
  } catch (error) {
    console.error(error);
  }
}

async function cleanFolder(dir) {
  try {
    const files = await fsPromises.readdir(dir, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        await fsPromises.unlink(path.resolve(dir, file.name));
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function createHtml() {
  fsPromises
    .readFile(path.join(__dirname, 'template.html'), 'utf-8')
    .then((data) => {
      return { data: data, selectors: data.match(/\{{[^}]*\}}/g) };
    })
    .then(async (data) => {
      let html = data.data;
      await data.selectors.forEach(async (item) => {
        const key = item.substring(2, item.length - 2);
        const component = await fsPromises.readFile(
          path.join(__dirname, 'components', `${key}.html`),
          'utf-8',
        );
        html = html.replaceAll(item, component);
        await writeHtml(html);
      });
    })
    .catch((err) => console.log(err));

  async function writeHtml(text) {
    try {
      const writeableStream = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'index.html'),
      );
      writeableStream.write(text);
    } catch (error) {
      console.error(error);
    }
  }
}

function createCss() {
  fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', (err) => {
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
          fs.readFile(
            path.resolve(obj.path, obj.name),
            'utf8',
            (err, fileContent) => {
              if (err) return console.error(err.message);
              fs.appendFile(
                path.join(__dirname, 'project-dist', 'style.css'),
                fileContent,
                (err) => {
                  if (err) {
                    console.error(err.message);
                  }
                },
              );
            },
          );
        }
      });
    });
  });
}

async function dist() {
  await createDir();
  await copyDir();
  await createHtml();
  await createCss();
}

dist();
