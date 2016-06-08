'use strict';

const fs = require('fs');
const url = require('url');
const http = require('http');
const ua = `Mozilla/5.0 (Windows NT 6.1)
            AppleWebKit/537.36 (KHTML, like Gecko)
            Chrome/41.0.2228.0
            Safari/537.36`;


function local(path) {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data.toString('base64')); // buffer
    });
  });
  return promise;
}

function remote(uri) {
  const options = url.parse(uri);
  options.method = 'GET'; // add http method
  options.headers = { // Spoof user agent */
    'User-Agent': ua,
  };

  const promise = new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(`Status code ${res.statusCode} returned when trying to fetch image`);
        return false;
      }
      res.setEncoding('base64');
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(body);
        req.end();
      });
      res.resume();
      return true;
    }).on('error', (e) => {
      reject(e);
    });
    req.end();
  });
  return promise;
}

module.exports = {
  local,
  remote,
};
