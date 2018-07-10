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

function fetchRemoteVanilla(...paths) {
  return checkMimeType(paths)
    .then(mimeType => calculatePrefix(mimeType))
    .then(prefix => remote.fetch({ paths }).then(base64 => [base64, prefix + base64]));
}

function fetchRemoteWithOptions({ url, paths = [], headers = {} }) {
  const ps = (paths.length === 0) ? [url] : paths;
  return checkMimeType(ps)
    .then(mimeType => calculatePrefix(mimeType))
    .then(prefix => remote.fetch({ paths: ps, headers }).then(base64 => [base64, prefix + base64]));
}

function fetchRemote(...params) {
  if (params.length === 1 && typeof params[0] === 'object') {
    return fetchRemoteWithOptions(params[0]);
  }
  // plain vanilla function to keep compatibility without tests
  return fetchRemoteVanilla(...params);
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
