'use strict';

const remoteRegex = /(https?:\/\/[^\s]+)/g;

module.exports = {
  isRemote: (path) => {
    const url = (Array.isArray(path)) ? path[path.length - 1] : path;
    return !!url.match(remoteRegex);
  }
};
