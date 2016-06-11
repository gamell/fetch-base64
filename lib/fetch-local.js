'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  fetch: (path1, ...pathN) => {
    const promise = new Promise((resolve, reject) => {
      const p = path.resolve(path1, ...pathN);
      fs.readFile(p, (err, data) => {
        if (err) reject(`Error reading local file: ${err}`);
        else resolve(data.toString('base64')); // buffer
      });
    });
    return promise;
  },
};
