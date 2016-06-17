# Fetch Base64
A node package to retrieve fetch local or remote images in base64 encoding. Useful for embedding images into HTML documents.

# TL;DR example

```js
const fetch = require(fetch-base64);

fetch.local(true, '/path/to/image.jpg').then((data) => {
  // data contains base64-encoded image with MimeType
}).catch((reason) => {});

fetch.remote(false, 'http://domain.com/to/image.jpg').then((data) => {
  // data contains base64-encoded image with MimeType
}).catch((reason) => {});

fecth.auto(true, '/remote/or/local/path/image.gif').then((data) => {

}).catch((reason) => {});
```

# Install

`npm install --save fetch-base64`

# API

## `fetch.local(...paths)`

Fetch local images and return them in base64 format.

### Params

- `...paths` *String(s)*: Single or multiple paths which will be combined using node's [`path.resolve()`](https://nodejs.org/docs/latest/api/path.html#path_path_resolve_from_to). You can pass multiple paths to resolve a relative path to an absolute path. Some examples of valid values for this parameter:
  - `'/some/absolute/path/image.jpg'`
  - `'/base/path/to/html', './img/animation.gif'`

## `fetch.remote(url)`

Fetch remote images and return them in base64 format.

User Agent is spoofed to be same as Chrome's to avoid some restrictions, but image fetching still could fail for other reasons.

### Params

- `url` *String*: URL where the image resides. Note that node must have access to the given URL.

## `fetch.auto(...paths)`

This function will try to automatically detect the kind of path passed (`remote` or `local`) and invoke the correspondent function. Please note that passing several paths

### Params

- `...paths` *String(s)*: Single or multiple paths which will be combined using node's [`path.resolve()`](https://nodejs.org/docs/latest/api/path.html#path_path_resolve_from_to). You can pass multiple paths to resolve a relative path to an absolute path. Some examples of valid values for this parameter:
  - `'/some/absolute/path/image.jpg'`
  - `'/base/path/to/html', './img/animation.gif'`
- `basePathForRelative` **String** (optional): Only used for fetching **local images**. See `fetch.local` documentation above.

## Returns

**Promise**. When resolved will return an array with the base64-encoded data. The first position of the array will contain the `raw` data.

If there is any error the Promise will be rejected and the reason returned.

e.g. successful fetch:



 `iVBORw0KGgoAAAANSUhEUg...`

## With MimeType prepended

`data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...`

# Example

## Include package

```js
const fetch = require('fetch-base64');
```

## Local - Relative path


```js
// will fetch image in /Users/bla/src/project/img/logo.jpg
const doFetchLocal = fetch.local('./img/logo.jpg', true '/Users/bla/src/project');
doFetchLocal.then((data) => {
  console.log(`base 64 image: ${data}`);
}, (reason) => {
  console.log(`Fetch Failed: ${reason}`)
})
```

## Remote

```js
const doFetchRemote = fetch.remote('https://somedomain.com/image.jpg');
doFetchRemote.then((data) => {
  console.log(`base 64 image: ${data}`);
  // will output
}, (reason) => {
  console.log(`Fetch Failed: ${reason}`)
})
```

## Auto

```js
const basePath = '/Users/bla/project/';
const
const doFetch = fetch.remote('https://somedomain.com/image.jpg');
doFetch.then((data) => {
  console.log(`base 64 image: ${data}`);
  // will output
}, (reason) => {
  console.log(`Fetch Failed: ${reason}`)
})
```
