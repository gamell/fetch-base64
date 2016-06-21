'use strict';

const url = require('url');
const http = require('http');
const ua = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';

module.exports = {
  fetch: (...paths) => {
    const promise = new Promise((resolve, reject) => {
      const uri = (paths.length > 1) ? url.resolve(...paths) : paths[0];
      let options;
      try {
        options = url.parse(uri);
      } catch (e) {
        reject(`URL Parse error: ${e}`);
      }
      options.method = 'GET'; // add http method
      options.headers = { // Spoof user agent
        'User-Agent': ua,
      };
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
        reject(`HTTP Request error: ${e}`);
      });
      req.end();
    });
    return promise;
  },
};
