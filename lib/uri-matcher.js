const remoteRegex = /(https?:\/\/[^\s]+)/g;

module.exports = {
  isRemote: (uri) => !!uri.match(remoteRegex),
};
