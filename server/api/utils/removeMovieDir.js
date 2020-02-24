const rimarf = require('rimraf');
const fs = require('fs');

function removeMovieDir(imdbid) {
  return new Promise((resolve, reject) => {
    const path = `${process.env.MOVIES_PATH}/${imdbid}`;
    if (fs.existsSync(path)) {
      return rimarf(path, { glob: false }, err => {
        if (err) return reject(err);

        resolve();
      });
    }
    resolve();
  });
}

module.exports = removeMovieDir;
