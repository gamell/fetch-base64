'use strict';

const mime = require('mime-types');
const pathResolve = require('path').resolve;
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

// promisify node-base64-image
module.exports = function fetchImageBase64(uri, bPath) {
  const basePath = (typeof bPath === 'string') ? bPath : '';
  const promise = new Promise((resolve, reject) => {
    const mimeType = getMimeType(uri);
    if (!mimeType) {
      reject('The referenced file is not an image.');
      return false;
    }
    const prefix = `data:${mimeType};base64,`;
    const fetchImage = uriMatcher.isRemote(uri) ?
      fetch.remote(uri) : fetch.local(pathResolve(basePath, uri));
    fetchImage.then(
      (base64) => resolve(prefix + base64),
      (reason) => reject(reason)
    );
    return true;
  });
  return promise;
};
