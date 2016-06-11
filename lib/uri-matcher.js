'use strict';

const remoteRegex = /(https?:\/\/[^\s]+)/g;

module.exports = {
  isRemote: (path) => {
    if (!path) {
      throw new Error('Required parameter path missing');
    }
    return !!path.match(remoteRegex);
  },
};
