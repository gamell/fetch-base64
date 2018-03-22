const mime = require('mime-types');
const uriMatcher = require('./lib/uri-matcher.js');
const remote = require('./lib/fetch-remote.js');
const local = require('./lib/fetch-local.js');

let api = {};
let headers = {};

function checkMimeType(path) {
  const promise = new Promise((resolve, reject) => {
    try {
      resolve(mime.lookup(path));
    } catch (e) {
      reject(e);
    }
  });
  return promise;
}

function calculatePrefix(mimeType) {
  return `data:${mimeType};base64,`;
}

function fetchLocal(path) {
  return checkMimeType(path)
    .then(mimeType => calculatePrefix(mimeType))
    .then(prefix => local.fetch(path).then(base64 => [base64, prefix + base64]))
}

function fetchRemote(path, headers) {
  return checkMimeType(path)
    .then(mimeType => calculatePrefix(mimeType))
    .then(prefix => remote.fetch(path, headers).then(base64 => [base64, prefix + base64]))
}

function auto(path, headers) {
  try {
    return (uriMatcher.isRemote(path)) ? fetchRemote(path, headers) : fetchLocal(path);
  } catch (e) {
    return Promise.reject(e);
  }
}

function setHeaders(headersParam) {
  headers = headersParam;
  return api;
}

api = {
  local: fetchLocal,
  remote: fetchRemote,
  auto,
  isRemote: uriMatcher.isRemote,
  isLocal: uriMatcher.isLocal,
  setHeaders
};

module.exports = {
  ...api,
};
