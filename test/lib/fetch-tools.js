'use strict';

const assert = require('chai').assert;
const fetch = require('../../lib/fetch-tools.js');
const sinon = require('sinon');
const fs = require('fs');
const http = require('http');
const url = require('url');

let sandbox;

describe('Fetch Tools', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('local', () => {
    it('should always return a promise', () => {
      assert(typeof fetch.local('something').then === 'function');
      assert(typeof fetch.local().then === 'function');
    });
    it('should call fs.readFile with correct path', (done) => {
      const fsStub = sandbox.stub(fs, 'readFile').callsArgWith(1, null, 'gif-data');
      fetch.local('/path/to/existing-image.gif').then((res) => {
        assert.equal(res, 'gif-data');
        assert(fsStub.calledOnce);
        assert(fsStub.calledWith('/path/to/existing-image.gif'));
        done();
      }).catch((e) => done(e));
    });
    it('should return a rejected promise when there is a fs error', (done) => {
      const fsStub = sandbox.stub(fs, 'readFile').callsArgWith(1, 'error', null);
      const shouldNotBeCalled = sandbox.spy();
      fetch.local('/path/to/existing-image.gif').then(shouldNotBeCalled, (res) => {
        assert.equal(res, 'error');
        assert(fsStub.calledOnce);
        assert.equal(shouldNotBeCalled.callCount, 0);
        assert(fsStub.calledWith('/path/to/existing-image.gif'));
        done();
      }).catch((e) => done(e));
    });
  });
  describe('remote', () => {
    it('should always return a promise', () => {
      assert(typeof fetch.remote('something').then === 'function');
      assert(typeof fetch.remote().then === 'function');
    });
    // need to use sinon fake server to mock http.request
    // it('should call url.parse with correct url', (done) => {
    //   const urlStub = sandbox.stub(url, 'parse', () => { return { prop1: 'value1' }; });
    //   sandbox.stub(http, 'request', () => Promise.resolve('fake-data'));
    //   fetch.remote('http://url.com/existing-image.gif').then(() => {
    //     assert(urlStub.calledOnce);
    //     assert(urlStub.calledWith('http://url.com/existing-image.gif'));
    //     done();
    //   }).catch((e) => done(e));
    // });
  });
});
