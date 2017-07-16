const fetch = require('../../index');
const assert = require('chai').assert;

const sinon = require('sinon');
const mime = require('mime-types');

describe('Functional test', () => {
  describe('local()', () => {
    it('should fetch file with simple path', (done) => {
      fetch.local('./test/functional/example.svg').then((data) => {
        assert.include(data[0], '77u/PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8IURPQ1RZUEUgc3ZnIF');
        assert.include(data[1], 'data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0i');
        done();
      }).catch((e) => done(e));
    });
    it('should fetch file concatenating paths', (done) => {
      fetch.local('./test/', './functional', './example.svg').then((data) => {
        assert.include(data[0], '77u/PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8IURPQ1RZUEUgc3ZnIF');
        assert.include(data[1], 'data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0i');
        done();
      }).catch((e) => done(e));
    });
    it('should fail for nonexistent file', (done) => {
      fetch.local('/no.jpg').catch((reason) => {
        assert.equal(reason, 'Error reading local file: Error: ENOENT: no such file or directory, open \'/no.jpg\'');
        done();
      }).catch((e) => done(e));
    });
  });
  describe('remote()', () => {
    it('should fetch file with simple URL', (done) => {
      fetch.remote('http://gamell.io/sprite.png').then((data) => {
        assert.include(data[0], 'iVBORw0KGgoAAAANSUhEU');
        assert.include(data[1], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAC6');
        done();
      }).catch((e) => done(e));
    });
    it('should fetch file with `form, to` style URL', (done) => {
      fetch.remote('http://gamell.io/', '/sprite.png').then((data) => {
        assert.include(data[0], 'iVBORw0KGgoAAAANSUhEU');
        assert.include(data[1], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAC6');
        done();
      }).catch((e) => done(e));
    });
    it('should fetch file from https resource', (done) => {
      fetch.remote('https://gamell.io/sprite.png').then((data) => {
        assert.include(data[0], 'iVBORw0KGgoAAAANSUhEU');
        assert.include(data[1], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAC6');
        done();
      }).catch((e) => done(e));
    });
    it('should fail for nonexistent file', (done) => {
      fetch.remote('http://gamell.io/ajndjdnfjsdn.jpg').catch((reason) => {
        assert.equal(reason, 'Status code 404 returned when trying to fetch file');
        done();
      }).catch((e) => done(e));
    });
  });
  describe('auto()', () => {
    it('should fetch remote file with simple URL', (done) => {
      fetch.auto('http://gamell.io/sprite.png').then((data) => {
        assert.include(data[0], 'iVBORw0KGgoAAAANSUhEU');
        assert.include(data[1], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAC6');
        done();
      }).catch((e) => done(e));
    });
    it('should fetch remote file with form, to URL', (done) => {
      fetch.auto('http://gamell.io/', '/sprite.png').then((data) => {
        assert.include(data[0], 'iVBORw0KGgoAAAANSUhEU');
        assert.include(data[1], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAC6');
        done();
      }).catch((e) => done(e));
    });
    it('should fetch file from https resource', (done) => {
      fetch.auto('https://gamell.io/sprite.png').then((data) => {
        assert.include(data[0], 'iVBORw0KGgoAAAANSUhEU');
        assert.include(data[1], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAC6');
        done();
      }).catch((e) => done(e));
    });
    it('should fail for nonexistent file', (done) => {
      fetch.auto('http://gamell.io/ajndjdnfjsdn.jpg').catch((reason) => {
        assert.equal(reason, 'Status code 404 returned when trying to fetch file');
        done();
      }).catch((e) => done(e));
    });
    it('should fetch local file with simple path', (done) => {
      fetch.auto('./test/functional/example.svg').then((data) => {
        assert.include(data[0], '77u/PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8IURPQ1RZUEUgc3ZnIF');
        assert.include(data[1], 'data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0i');
        done();
      }).catch((e) => done(e));
    });
    it('should fetch local file concatenating paths', (done) => {
      fetch.auto('./test/', './functional', './example.svg').then((data) => {
        assert.include(data[0], '77u/PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8IURPQ1RZUEUgc3ZnIF');
        assert.include(data[1], 'data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0i');
        done();
      }).catch((e) => done(e));
    });
  });
});
