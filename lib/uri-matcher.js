'use strict';

const remoteRegex = /(https?:\/\/[^\s]+)/g;

function isRemote(path) {
  if (!path) {
    throw new Error('Required parameter path missing');
  }
  return !!path.match(remoteRegex);
}

function isLocal(path) {
  return !isRemote(path);
}

module.exports = {
  isRemote,
  isLocal,
};
