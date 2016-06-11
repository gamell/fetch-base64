'use strict';

const mime = require('mime-types');
const uriMatcher = require('./lib/uri-matcher.js');
const remote = require('./lib/fetch-remote.js');
const local = require('./lib/fetch-local.js');

function getMimeType(path) {
  try {
    const mimeType = mime.lookup(path);
    return (mimeType.indexOf('image') > -1) ? mimeType : false;
  } catch (e) { // if mimeType returns false
    return false;
  }
}

function checkMimeType(paths) {
  const path = (Array.isArray(paths)) ? paths[paths.length - 1] : paths;
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

function fetchLocal(includeMimeType, ...paths) {
  return checkMimeType(paths).then(
    (mimeType) => calculatePrefix(mimeType, includeMimeType)
  ).then(
    (prefix) => local.fetch(...paths).then((base64) => prefix + base64)
  );
}

function fetchRemote(includeMimeType, url) {
  return checkMimeType(url).then(
    (mimeType) => calculatePrefix(mimeType, includeMimeType)
  ).then(
    (prefix) => remote.fetch(url).then((base64) => prefix + base64)
  );
}

function auto(includeMimeType, ...paths) {
  return new Promise((resolve) => {
    const path = paths[paths.length - 1];
    if (uriMatcher.isRemote(path)) {
      resolve(fetchRemote(includeMimeType, paths[0]));
    } else {
      resolve(fetchLocal(includeMimeType, ...paths));
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
