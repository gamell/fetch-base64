'use strict';

const { URL } = require('url');
const legacyUrl = require('url');
const http = require('http');
const https = require('https');
const ua = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';

module.exports = {
  fetch: (...paths) => {
    const promise = new Promise((resolve, reject) => {
      const uri = (paths.length > 1) ? legacyUrl.resolve(...paths) : paths[0];
      let myUrl;
      try {
        myUrl = new URL(uri);
      } catch (e) {
        reject(`URL Parse error: ${e}`);
      }
      myUrl.method = 'GET'; // add http method
      myUrl.headers = { // Spoof user agent
        'User-Agent': ua,
      };
      const agent = (myUrl.protocol === 'https:') ? https : http;
      const req = agent.request(myUrl, (res) => {
        if (res.statusCode !== 200) {
          reject(`Status code ${res.statusCode} returned when trying to fetch file`);
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
