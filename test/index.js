'use strict';

const assert = require('chai').assert;
const index = require('../index.js');
const remote = require('../lib/fetch-remote.js');
const local = require('../lib/fetch-local.js');
const sinon = require('sinon');

let sandbox;

describe('index.js', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('auto()', () => {
    it('should always return a promise', () => {
      assert(typeof index.auto(true, 'non-existant-path').then === 'function');
      assert(typeof index.auto(true).then === 'function');
      assert(typeof index.auto().then === 'function');
    });
    it('it should throw an error when mime type is not an image', (done) => {
      index.auto(true, '/non-existant-path/non-image.txt').catch((e) => {
        assert.equal(e, 'The referenced file is not an image.');
        done();
      }).catch((e) => done(e));
    });
    it('it should call local.fetch() to fetch local images', (done) => {
      const fetchLocalStub = sandbox.stub(local, 'fetch', () => Promise.resolve('image-data'));
      const shouldNotBeCalled = sandbox.spy(remote, 'fetch');
      index.auto(true, '/several/', '/paths/', '/image.gif').then((data) => {
        assert.equal(data, 'data:image/gif;base64,image-data');
        sinon.assert.calledOnce(fetchLocalStub);
        sinon.assert.calledWith(fetchLocalStub, '/several/', '/paths/', '/image.gif');
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
    it('it should call remote.fetch() to fetch remote images', (done) => {
      const fetchRemoteStub = sandbox.stub(remote, 'fetch', () => Promise.resolve('image-data'));
      const shouldNotBeCalled = sandbox.spy(local, 'fetch');
      index.auto(true, 'http://remote.com/image.jpg').then((data) => {
        assert.equal(data, 'data:image/jpeg;base64,image-data');
        sinon.assert.calledOnce(fetchRemoteStub);
        sinon.assert.calledWith(fetchRemoteStub, 'http://remote.com/image.jpg');
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
  });
  describe('local()', () => {
    it('should always return a promise', () => {
      assert(typeof index.local(true, 'non-existant-path').then === 'function');
      assert(typeof index.local(true).then === 'function');
      assert(typeof index.local().then === 'function');
    });
    it('should return a rejected promise if there is an issue retrieveing the image', (done) => {
      const localFecthStub = sandbox.stub(
        local, 'fetch', () => Promise.reject('error getting image')
      );
      index.local(true, 'path/to/existing-image.gif').catch((res) => {
        assert.equal(res, 'error getting image');
        assert(localFecthStub.calledOnce);
        done();
      }).catch((e) => done(e));
    });
    it('should return a rejected promise when mime type is not an image', (done) => {
      index.local(true, 'path/', '/to/', '/non-existant-path/non-image.txt').catch((e) => {
        assert.equal(e, 'The referenced file is not an image.');
        done();
      }).catch((e) => done(e));
    });
    it('should call local.fetch() for local images', (done) => {
      const localFetchStub = sandbox.stub(local, 'fetch', () => Promise.resolve('gif-data'));
      const shouldNotBeCalled = sandbox.spy(remote, 'fetch');
      index.local(true, '/root/', '/path/to/existing-image.gif').then((res) => {
        assert.equal(res, 'data:image/gif;base64,gif-data');
        assert(localFetchStub.calledOnce);
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
    it('should handle multiple paths correctly', (done) => {
      const localFetchStub = sandbox.stub(local, 'fetch', () => Promise.resolve('gif-data'));
      const shouldNotBeCalled = sandbox.spy(remote, 'fetch');
      index.local(true, '/root/', '/another/path/', '/path/to/existing-image.gif').then((res) => {
        assert.equal(res, 'data:image/gif;base64,gif-data');
        assert(localFetchStub.calledOnce);
        sinon.assert.calledWith(localFetchStub,
          '/root/',
          '/another/path/',
          '/path/to/existing-image.gif'
        );
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
    it('should return correctly image with mimeType information', (done) => {
      const localFetchStub = sandbox.stub(local, 'fetch', () => Promise.resolve('png-data'));
      const shouldNotBeCalled = sandbox.spy(remote, 'fetch');
      index.local(true, '/path/to/image.png').then((res) => {
        assert.equal(res, 'data:image/png;base64,png-data');
        assert(localFetchStub.calledOnce);
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
    it('should correctly return raw data (no mimeType)', (done) => {
      const localFetchStub = sandbox.stub(local, 'fetch', () => Promise.resolve('png-data'));
      const shouldNotBeCalled = sandbox.spy(remote, 'fetch');
      index.local(false, '/path/to/image.png').then((res) => {
        assert.equal(res, 'png-data');
        assert(localFetchStub.calledOnce);
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
  });
  describe('remote()', () => {
    it('should always return a promise', () => {
      assert(typeof index.remote(true, 'non-existant-path').then === 'function');
      assert(typeof index.remote(true).then === 'function');
      assert(typeof index.remote().then === 'function');
    });
    it('should return a rejected promise if there is an issue retrieveing the image', (done) => {
      const remoteFecthStub = sandbox.stub(remote, 'fetch', () => Promise.reject('error getting image'));
      index.remote(true, 'https://domain.com/to/existing-image.gif').catch((reason) => {
        assert.equal(reason, 'error getting image');
        assert(remoteFecthStub.calledOnce);
        done();
      }).catch((e) => done(e));
    });
    it('should return a rejected promise when mime type is not an image', (done) => {
      index.remote(true, 'https://domain.com/non-image.txt').catch((e) => {
        assert.equal(e, 'The referenced file is not an image.');
        done();
      }).catch((e) => done(e));
    });
    it('should call remote.fetch() for remote images', (done) => {
      const remoteFecthStub = sandbox.stub(remote, 'fetch', () => Promise.resolve('gif-data'));
      const shouldNotBeCalled = sandbox.spy(local, 'fetch');
      index.remote(true, 'https://deomain.com/to/existing-image.gif').then((res) => {
        assert.equal(res, 'data:image/gif;base64,gif-data');
        assert(remoteFecthStub.calledOnce);
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
    it('should return correctly image with mimeType information', (done) => {
      const remoteFecthStub = sandbox.stub(remote, 'fetch', () => Promise.resolve('png-data'));
      const shouldNotBeCalled = sandbox.spy(local, 'fetch');
      index.remote(true, 'http://some.domain/path/to/image.png').then((res) => {
        assert.equal(res, 'data:image/png;base64,png-data');
        assert(remoteFecthStub.calledOnce);
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
    it('should correctly return raw data (no mimeType)', (done) => {
      const remoteFecthStub = sandbox.stub(remote, 'fetch', () => Promise.resolve('png-data'));
      const shouldNotBeCalled = sandbox.spy(local, 'fetch');
      index.remote(false, 'http://some.domain/path/to/image.png').then((res) => {
        assert.equal(res, 'png-data');
        assert(remoteFecthStub.calledOnce);
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
  });
});
