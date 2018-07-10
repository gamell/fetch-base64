const mime = require('mime-types');
const uriMatcher = require('./lib/uri-matcher.js');
const remote = require('./lib/fetch-remote.js');
const local = require('./lib/fetch-local.js');

function checkMimeType(paths) {
  const path = (Array.isArray(paths)) ? paths[paths.length - 1] : paths;
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

function fetchLocal(...paths) {
  return checkMimeType(paths)
    .then(mimeType => calculatePrefix(mimeType))
    .then(prefix => local.fetch(...paths).then(base64 => [base64, prefix + base64]));
}

const remoteOptions = (...params) => {
  const isOptionObject = params.length === 1 && typeof params[0] === 'object';
  const getPaths = p => ((p.paths) ? p.paths : [p.url]);
  const getHeaders = p => ((p.headers) ? p.headers : {});
  return {
    paths: isOptionObject ? getPaths(params[0]) : params,
    headers: isOptionObject ? getHeaders(params[0]) : {}
  };
};

function fetchRemote(...params) {
  const options = remoteOptions(...params);
  return checkMimeType(options.paths)
    .then(mimeType => calculatePrefix(mimeType))
    .then(prefix => remote.fetch(options).then(base64 => [base64, prefix + base64]));
}

function auto(...paths) {
  try {
    return (uriMatcher.isRemote(paths[0])) ? fetchRemote(...paths) : fetchLocal(...paths);
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = {
  local: fetchLocal,
  remote: fetchRemote,
  auto,
  isRemote: uriMatcher.isRemote,
  isLocal: uriMatcher.isLocal,
};
