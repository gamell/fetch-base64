# Fetch Base64
A node package to retrieve fetch local or remote images in base64 encoding. Useful for embedding images into HTML documents.

# Install

`npm install fetch-base64`

# API

## `fetch.local(path, includeMimeType, [basePathForRelative])`

Fetch local images and return them in base64 format.

### Params

- `path` **String**: Local path. Can be absolute or relative (if relative, `basePathForRelative` is needed).
  - `/some/local/path/image.jpg`
  - `./relative/path/animation.gif`
- `includeMimetype` **Boolean** (defaults to `true`): Should the result include the mimeType? Useful if embedding images into HTML. e.g. with mimeType: ``
- `basePathForRelative` **String** (optional): If passed and the `path` param is detected as relative, the `basePathForRelative` will be used as the base path to resolve the relative. Useful if you want to fetch local images located in a relative path is relative to some directory (e.g. relative to the html file they are included in).

## `fetch.remote(url, includeMimeType)`

Fetch remote images and return them in base64 format.

### Params

- `url` **String**: URL where the image is. E.g. :
  - `http://some-domain.com/image.jpg`
  - `https://something/image.png`
- `includeMimetype` **Boolean** (defaults to `true`): Should the result include the mimeType? Useful if embedding images into HTML. e.g. with mimeType: ``


## `fetch.auto(uri, includeMimeType, [basePathForRelative])`

Let the package figure out if the passed `uri` is local or remote, and return a Promise with the image in base64 encoding.

### Params

- `uri` **String**: Local path or remote URL. Examples of valid uris:
  - `/some/local/path/image.jpg`
  - `./relative/path/animation.gif`
  - `http://some-domain.com/image.jpg`
  - `https://something/image.png`
- `includeMimetype` **Boolean**: Same as for `fetch.remote` and `fetch.local`
- `basePathForRelative` **String** (optional): Only used for fetching **local images**. See `fetch.local` documentation above.

# Example

## Include package

```js
const fetch = require('fetch-base64');
```

## Local - Relative path


```js
// will fetch image in /Users/bla/src/project/img/logo.jpg
const fetchLocalImage = fetch.local('./img/logo.jpg', true '/Users/bla/src/project');
fetchLocalImage.then((data) => {
  console.log(`base 64 image: ${data}`);
}, (reason) => {
  console.log(`Fetch Failed: ${reason}`)
})
```

## Remote

```js
const fetchRemoteImage = fetch.remote('https://somedomain.com/image.jpg');
fetchRemoteIamge.then((data) => {
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
const fetchImage = fetch.remote('https://somedomain.com/image.jpg');
fetchRemoteIamge.then((data) => {
  console.log(`base 64 image: ${data}`);
  // will output
}, (reason) => {
  console.log(`Fetch Failed: ${reason}`)
})
```
