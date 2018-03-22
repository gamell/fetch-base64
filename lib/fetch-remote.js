const { URL } = require('url');
const http = require('http');
const https = require('https');

const ua = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';

module.exports = {
  fetch: (uri, headers = {}) => {
    const promise = new Promise((resolve, reject) => {
      let myUrl;
      try {
        myUrl = new URL(uri);
      } catch (e) {
        reject(`URL Parse error: ${e}`);
      }
      const agentOptions = {
        hostname: myUrl.host,
        path: myUrl.pathname + myUrl.search + myUrl.hash,
        method: 'GET',
        headers: {
          'User-Agent': ua,
          ...headers,
        }
      };
      const agent = (myUrl.protocol === 'https:') ? https : http;
      const req = agent.request(agentOptions, (res) => {
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
