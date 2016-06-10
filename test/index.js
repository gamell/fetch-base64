'use strict';

const assert = require('chai').assert;
const fetch = require('../index.js');
const sinon = require('sinon');
const fetchTools = require('../lib/fetch-tools.js');

let sandbox;

describe('Fetch Base64', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should always return a promise', () => {
    assert(typeof fetch.auto(true, 'non-existant-path').then === 'function');
    assert(typeof fetch.auto(true).then === 'function');
    assert(typeof fetch.auto().then === 'function');
  });

  it('it should throw an error when mime type is not an image', (done) => {
    fetch.auto(true, '/non-existant-path/non-image.txt').catch((e) => {
      assert.equal(e, 'The referenced file is not an image.');
      done();
    }).catch((e) => done(e));
  });

  it('should call fetch.local for local images', (done) => {
    const fetchRemoteStub = sandbox.stub(fetchTools, 'remote', () => Promise.resolve('gif-data'));
    const fetchLocalStub = sandbox.stub(fetchTools, 'local', () => Promise.resolve('gif-data'));
    fetch.auto(true, '/root/', '/path/to/existing-image.gif').then((res) => {
      assert.equal(res, 'data:image/gif;base64,gif-data');
      assert(fetchLocalStub.calledOnce);
      assert.equal(fetchRemoteStub.callCount, 0);
      done();
    }).catch((e) => done(e));
  });

  it('should return a resolved promise for an existing local image', (done) => {
    sandbox.stub(fetchTools, 'local', () => Promise.resolve('png-data'));
    fetch.auto(true, '/existing-path/image.png').then((res) => {
      assert.equal(res, 'data:image/png;base64,png-data');
      done();
    }).catch((e) => done(e));
  });

  it('should return a rejected promise for a non-existent local image', (done) => {
    sandbox.stub(fetchTools, 'local', () => Promise.reject('error'));
    const shouldNotBeCalled = sinon.spy();
    fetch.auto(true, '/non-existing-path/image.png').then(shouldNotBeCalled, (res) => {
      assert.equal(res, 'error');
      done();
    }).catch((e) => done(e));
  });

  it('should concatenate the basePath if passed', (done) => {
    const fetchLocalStub = sandbox.stub(fetchTools, 'local', () => Promise.resolve('gif-data'));
    fetch.auto(true, './project/existing-image.gif', '/base/path').then(() => {
      assert(fetchLocalStub.calledOnce);
      assert(fetchLocalStub.calledWith('/base/path/project/existing-image.gif'));
      done();
    }).catch((e) => done(e));
  });

  it('should call fetch.remote for remote images', (done) => {
    const fetchRemoteStub = sandbox.stub(fetchTools, 'remote', () => Promise.resolve('gif-data'));
    const fetchLocalStub = sandbox.stub(fetchTools, 'local', () => Promise.resolve('gif-data'));
    fetch.auto(true, 'http://test.com/existing-image.gif').then((res) => {
      assert.equal(res, 'data:image/gif;base64,gif-data');
      assert(fetchRemoteStub.calledOnce);
      assert.equal(fetchLocalStub.callCount, 0);
      done();
    }).catch((e) => done(e));
  });

  it('should return a resolved promise for an existing remote image', (done) => {
    sandbox.stub(fetchTools, 'remote', () => Promise.resolve('gif-data'));
    fetch.auto(true, 'http://test.com/existing-image.gif').then((res) => {
      assert.equal(res, 'data:image/gif;base64,gif-data');
      done();
    }).catch((e) => done(e));
  });

  it('should return a rejected promise when there is an error fetching the remote image', (done) => {
    sandbox.stub(fetchTools, 'remote', () => Promise.reject('error'));
    const shouldNotBeCalled = sinon.spy();
    fetch.auto(true, 'http://test.com/non-existing-image.gif').then(shouldNotBeCalled, (res) => {
      assert.equal(res, 'error');
      done();
    }).catch((e) => done(e));
  });
});
