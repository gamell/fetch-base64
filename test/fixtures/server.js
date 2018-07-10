// content of index.js
const http = require('http');

let server;
let lastReq = {};

const requestHandler = (request, response) => {
  lastReq = request;
  response.end('OK');
};

function start(port) {
  return new Promise((resolve, reject) => {
    server = http.createServer(requestHandler);
    server.listen(port, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function stop() {
  return new Promise((resolve) => {
    server.close(resolve);
  });
}

function getLastRequest() {
  return lastReq;
}

module.exports = {
  start,
  stop,
  getLastRequest
};
