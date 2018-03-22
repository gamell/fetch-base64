// content of index.js
const http = require('http');

const port = 3456;
let server;
let lastReq = {};

const requestHandler = (request, response) => {
  lastReq = request;
  response.end('OK');
};

function start() {
  server = http.createServer(requestHandler);

  server.listen(port, (err) => {
    if (err) {
      console.log('something bad happened', err);
    }
    console.log(`test server is listening on ${port}`);
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
