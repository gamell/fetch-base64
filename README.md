# Fetch Base64

[![Build Status](https://travis-ci.org/gamell/fetch-base64.svg?branch=master)](https://travis-ci.org/gamell/fetch-base64)

A node package to fetch local or remote files in base64 encoding. Useful for inlining assets (images, web fonts, etc.) into HTML or CSS documents.

Disclaimer: I've only used this for images so far, but there is no reason why it shouldn't work for any other kind of files.

If you find a bug please report it [here](https://github.com/gamell/fetch-base64/issues).

# Usage

```js
const fetch = require(fetch-base64);

fetch.local('/path/to/image.jpg').then((data) => {
  // data[0] contains the raw base64-encoded jpg
}).catch((reason) => {});

fetch.remote('http://domain.com/to/image.jpg').then((data) => {
  // data[1] contains base64-encoded jpg with MimeType
}).catch((reason) => {});

fecth.auto('/remote/or/local/path/image.gif').then((data) => {

}).catch((reason) => {});
```

# Install

`npm install --save fetch-base64`

# API

### Return value

All the functions return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which when resolved will return an Array with two Strings (`data`):

- `data[0]` will contain the raw base64-encoded file. E.g.: `iVBORw0KGgoAAAANSUhEUg...`
- `data[1]` will contain the same information as `data[0]` and the mimeType. Useful if you want to embed the file into an HTMl or CSS document. E.g.: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...`

## `fetch.local(...paths)`

Fetch local files and return a promise with the file in base64 format.

### Params

- `...paths` `<string(s)>`: Single or multiple paths which will be combined using node's [`path.resolve()`](https://nodejs.org/docs/latest/api/path.html#path_path_resolve_from_to). You can pass multiple paths to resolve a relative path to an absolute path. Some examples of valid values for this parameter:
  - `'/some/absolute/path/image.jpg'`
  - `'/base/path/to/html', './img/animation.gif'`


## `fetch.remote(url)`

Fetch remote file in `url` and return a promise with the file in base64 format.

User Agent is spoofed to be same as Chrome's to avoid some restrictions, but fetching could still fail for other reasons.

### Params

- `url` `<string>`: URL where the file resides. Note that node must have access to the given URL.

## `fetch.remote(from, to)`

Resolve url using node's [`url.resolve(from, to)`](https://nodejs.org/api/url.html#url_url_resolve_from_to), fetch remote file  and return a promise with the file in base64 format.

User Agent is spoofed to be same as Chrome's to avoid some restrictions, but fetching could still fail for other reasons.

### Params

- `from` `<string>`: The Base URL being resolved against.
- `to` `<string>`: The HREF URL being resolved.

See [`url.resolve()`](https://nodejs.org/api/url.html#url_url_resolve_from_to) for more information and examples.

## `fetch.auto(...mixed)`

This function will do the *best effort* to automatically detect the kind of path passed (`remote` or `local`) and invoke the correspondent function.

It will use the `fetch.isRemote()` function to determine if a remote url or a local path has been passed **in the first parameter**.

### Params

- `...mixed` `<string(s)>`: Accepts the same parameters as `fetch.local(...paths)`, `fetch.remote(url)` or `fetch.remote(from, to)` - see above. Examples of valid calls:
  - `fetch.auto('/base/path/to/html', './img/animation.gif');`
  - `fetch.auto('http://some.domain/file.png');`
  - `fetch.auto('http://some.domain/', 'file.png');`


# Utility functions

## `fetch.isLocal(path)`

Returns `true` if the passed path (`<string>`) is local. Returns `false` otherwise.

## `fetch.isRemote(path)`

Returns `true` if the passed path (`<string>`) is remote. Returns `false` otherwise.


# Examples

## Include package

```js
const fetch = require('fetch-base64');
```

## Local

```js
// will fetch image in /Users/bla/src/project/img/logo.jpg
const doFetchLocal = fetch.local('/Users/bla/src/project', './img/logo.jpg');
doFetchLocal.then((data) => {
  console.log(`base64 image raw: ${data[0]}`);
}, (reason) => {
  console.log(`Fetch Failed: ${reason}`)
});
```

## Remote

```js
const doFetchRemote = fetch.remote('https://somedomain.com/image.jpg');
doFetchRemote.then((data) => {
  console.log(`base64 image with mimeType: ${data[1]}`);
}, (reason) => {
  console.log(`Fetch Failed: ${reason}`)
});
```

```js
const doFetchRemote2 = fetch.remote('https://somedomain.com', '/image.jpg');
doFetchRemote.then((data) => {
  console.log(`base64 image with mimeType: ${data[1]}`);
}, (reason) => {
  console.log(`Fetch Failed: ${reason}`)
});
```

## Auto

```js
const doFetchAuto = fetch.auto('https://somedomain.com/image.jpg');
doFetch.then((data) => {
  console.log(`base64 image: ${data[0]}`);
}, (reason) => {
  console.log(`Fetch Failed: ${reason}`)
});
```

```js
const doFetchAuto2 = fetch.auto('/some/local/', '/path/', './image.jpg');
doFetch.then((data) => {
  console.log(`base64 image: ${data[0]}`);
}, (reason) => {
  console.log(`Fetch Failed: ${reason}`)
});
```
