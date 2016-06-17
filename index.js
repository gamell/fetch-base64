'use strict';

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
  return checkMimeType(paths).then(
    (mimeType) => calculatePrefix(mimeType)
  ).then(
    (prefix) => local.fetch(...paths).then(
      (base64) => [base64, prefix + base64]
    )
  );
}

function fetchRemote(url) {
  return checkMimeType(url).then(
    (mimeType) => calculatePrefix(mimeType)
  ).then(
    (prefix) => remote.fetch(url).then(
      (base64) => [base64, prefix + base64]
    )
  );
}

function auto(...paths) {
  return new Promise((resolve) => {
    const path = paths[paths.length - 1];
    if (uriMatcher.isRemote(path)) {
      resolve(fetchRemote(paths[0]));
    } else {
      resolve(fetchLocal(...paths));
    }
  });
}

module.exports = {
  local: fetchLocal,
  remote: fetchRemote,
  auto,
  isRemote: uriMatcher.isRemote,
  isLocal: () => !uriMatcher.isRemote(),
};
