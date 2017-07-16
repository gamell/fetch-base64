# Fetch Base64
A node package to retrieve fetch local or remote images in base64 encoding. Useful for embedding images into HTML documents.

# Install

`npm install fetch-base64`

# API

## `fetch.local(includeMimeType, ...paths)`

Fetch local images and return them in base64 format.

### Params 

- `includeMimeType` *Boolean*: Pass true if the result should include the mimeType for the image. Useful if embedding images into HTML. examples:
  - true: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...`
  - false: `iVBORw0KGgoAAAANSUhEUg...`
- `paths` *String*: Single or multiple paths which will be combined using node's [`path.resolve()`](https://nodejs.org/docs/latest/api/path.html#path_path_resolve_from_to). You can pass multiple paths to resolve a relative path to an absolute path. Some examples of valid values for this parameter:
  - `'/some/absolute/path/image.jpg'`
  - `'/base/path/to/html', './img/animation.gif'`

### Returns



## `fetch.remote(url, includeMimeType)`

Fetch remote images and return them in base64 format.

User Agent is spoofed to be same as Chrome's to avoid some restrictions, but image fetching still could fail for other reasons.

### Params

- `includeMimeType` *Boolean*: Pass true if the result should include the mimeType for the image. Useful if embedding images into HTML. examples:
  - true: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...`
  - false: `iVBORw0KGgoAAAANSUhEUg...`
- `url` *String*: URL where the image resides. Note that node must have access to the given URL.

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
