'use strict';

const mime = require('mime-types');
const uriMatcher = require('./lib/uri-matcher.js');
const fetch = require('./lib/fetch-tools.js');

function getMimeType(path) {
  try {
    const mimeType = mime.lookup(path);
    return (mimeType.indexOf('image') > -1) ? mimeType : false;
  } catch (e) { // if mimeType returns false
    return false;
  }
}

function checkMimeType(path) {
  const promise = new Promise((resolve, reject) => {
    const mimeType = getMimeType(path);
    if (!mimeType) {
      reject('The referenced file is not an image.');
    } else {
      resolve(mimeType);
    }
  });
  return promise;
}

function calculatePrefix(mimeType, includeMimeType) {
  if (includeMimeType) return `data:${mimeType};base64,`;
  return '';
}

function auto(includeMimeType, ...paths) {
  return checkMimeType(paths[paths.length - 1]).then(
    (mimeType) => Promise.resolve(calculatePrefix(mimeType, includeMimeType))
  ).then((prefix) => {
    const fetchImage = uriMatcher.isRemote(paths) ?
      fetch.remote(paths[0]) : fetch.local(...paths);
    return fetchImage.then(
      (base64) => prefix + base64
    );
  });
}

function local(includeMimeType, ...paths) {
  return checkMimeType(paths[paths.length - 1]).then(
    (mimeType) => Promise.resolve(calculatePrefix(mimeType, includeMimeType))
  ).then(
    (prefix) => fetch.local(...paths).then((base64) => prefix + base64)
  );
}
//
// function remote(includeMimeType, url) {
//   return mimeTypeDecorator(mimeType, fetch.remote(url));
// }

// promisify node-base64-image
module.exports = {
  local,
  // remote,
  auto,
  isRemote: uriMatcher.isRemote,
  isLocal: () => !uriMatcher.isRemote(),
};
