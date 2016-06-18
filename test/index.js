'use strict';

const assert = require('chai').assert;
const index = require('../index.js');
const remote = require('../lib/fetch-remote.js');
const local = require('../lib/fetch-local.js');
const sinon = require('sinon');
const mime = require('mime-types');

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
      assert(typeof index.auto('non-existant-path').then === 'function');
      assert(typeof index.auto().then === 'function');
      assert(typeof index.auto().then === 'function');
    });
    it('it should call local.fetch() to fetch local files', (done) => {
      const fetchLocalStub = sandbox.stub(local, 'fetch', () => Promise.resolve('image-data'));
      const shouldNotBeCalled = sandbox.spy(remote, 'fetch');
      index.auto('/several/', '/paths/', '/image.gif').then((data) => {
        assert.deepEqual(data, ['image-data', 'data:image/gif;base64,image-data']);
        sinon.assert.calledOnce(fetchLocalStub);
        sinon.assert.calledWith(fetchLocalStub, '/several/', '/paths/', '/image.gif');
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
    it('it should call remote.fetch() to fetch remote images', (done) => {
      const fetchRemoteStub = sandbox.stub(remote, 'fetch', () => Promise.resolve('image-data'));
      const shouldNotBeCalled = sandbox.spy(local, 'fetch');
      index.auto('http://remote.com/image.jpg').then((data) => {
        assert.deepEqual(data, ['image-data', 'data:image/jpeg;base64,image-data']);
        sinon.assert.calledOnce(fetchRemoteStub);
        sinon.assert.calledWith(fetchRemoteStub, 'http://remote.com/image.jpg');
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
    it('it should return a rejected promise if there is an exception parsing the mimeType', (done) => {
      const shouldNotBeCalled = sandbox.spy(remote, 'fetch');
      sandbox.stub(mime, 'lookup').throws('SomeError');
      index.auto('/several/', '/paths/', '/image.gif').catch((e) => {
        assert.equal(shouldNotBeCalled.callCount, 0);
        assert.equal(e, 'SomeError');
        done();
      }).catch((e) => done(e));
    });
    it('it should automatically assume local if several paths passed', (done) => {
      const fetchLocalStub = sandbox.stub(local, 'fetch', () => Promise.reject('incorrect path'));
      const shouldNotBeCalled = sandbox.spy(remote, 'fetch');
      index.auto('http://thisisremote.com/', '/paths/', '/image.gif').catch((reason) => {
        sinon.assert.calledOnce(fetchLocalStub);
        sinon.assert.calledWith(fetchLocalStub, 'http://thisisremote.com/', '/paths/', '/image.gif');
        assert.equal(reason, 'incorrect path');
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
  });
  describe('local()', () => {
    it('should always return a promise', () => {
      assert(typeof index.local('non-existant-path').then === 'function');
      assert(typeof index.local().then === 'function');
    });
    it('should return a rejected promise if there is an issue retrieveing the image', (done) => {
      const localFecthStub = sandbox.stub(
        local, 'fetch', () => Promise.reject('error getting image')
      );
      index.local('path/to/existing-image.gif').catch((res) => {
        assert.equal(res, 'error getting image');
        assert(localFecthStub.calledOnce);
        done();
      }).catch((e) => done(e));
    });
    it('should call local.fetch() for local files', (done) => {
      const localFetchStub = sandbox.stub(local, 'fetch', () => Promise.resolve('gif-data'));
      const shouldNotBeCalled = sandbox.spy(remote, 'fetch');
      index.local('/root/', '/path/to/existing-image.gif').then((res) => {
        assert.deepEqual(res, ['gif-data', 'data:image/gif;base64,gif-data']);
        assert(localFetchStub.calledOnce);
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
    it('should handle multiple paths correctly', (done) => {
      const localFetchStub = sandbox.stub(local, 'fetch', () => Promise.resolve('gif-data'));
      const shouldNotBeCalled = sandbox.spy(remote, 'fetch');
      index.local('/root/', '/another/path/', '/path/to/existing-image.gif').then((res) => {
        assert.deepEqual(res, ['gif-data', 'data:image/gif;base64,gif-data']);
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
  });
  describe('remote()', () => {
    it('should always return a promise', () => {
      assert(typeof index.remote(true, 'non-existant-path').then === 'function');
      assert(typeof index.remote(true).then === 'function');
      assert(typeof index.remote().then === 'function');
    });
    it('should return a rejected promise if there is an issue retrieveing the file', (done) => {
      const remoteFecthStub = sandbox.stub(remote, 'fetch', () => Promise.reject('error getting image'));
      index.remote('https://domain.com/to/existing-image.gif').catch((reason) => {
        assert.equal(reason, 'error getting image');
        assert(remoteFecthStub.calledOnce);
        done();
      }).catch((e) => done(e));
    });
    it('should call remote.fetch() for remote files', (done) => {
      const remoteFecthStub = sandbox.stub(remote, 'fetch', () => Promise.resolve('gif-data'));
      const shouldNotBeCalled = sandbox.spy(local, 'fetch');
      index.remote('https://deomain.com/to/existing-image.gif').then((res) => {
        assert.deepEqual(res, ['gif-data', 'data:image/gif;base64,gif-data']);
        assert(remoteFecthStub.calledOnce);
        assert.equal(shouldNotBeCalled.callCount, 0);
        done();
      }).catch((e) => done(e));
    });
  });
});
