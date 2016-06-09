'use strict';

const assert = require('chai').assert;
const fetch = require('../../lib/fetch-tools.js');
const sinon = require('sinon');
const fs = require('fs');
const http = require('http');
const url = require('url');
const PassThrough = require('stream').PassThrough;

let sandbox;
let request;
let response;
let httpRequestStub;

function setupReqRes(statusCode) {
  request = new PassThrough();
  response = new PassThrough();
  response.statusCode = statusCode;
  response.write('data');
  response.end();
}

function setupSuccessfulResponseMock(sb) {
  setupReqRes(200);
  httpRequestStub = sb.stub(http, 'request').callsArgWith(1, response).returns(request);
}

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
      const fsStub = sandbox.stub(fs, 'readFile').callsArgWith(1, 'error message', null);
      const shouldNotBeCalled = sandbox.spy();
      fetch.local('/path/to/existing-image.gif').then(shouldNotBeCalled, (error) => {
        assert.equal(error, 'Error reading local file: error message');
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
    it('should call url.parse with correct url', (done) => {
      const urlStub = sandbox.stub(url, 'parse', () => ({ prop1: 'value1' }));
      // setup http.requests stubs
      setupSuccessfulResponseMock(sandbox);
      fetch.remote('http://url.com/existing-image.gif').then(() => {
        assert(urlStub.calledOnce);
        assert(urlStub.calledWith('http://url.com/existing-image.gif'));
        done();
      }).catch((e) => done(e));
    });
    it('should call http.request with correct url and options', (done) => {
      setupSuccessfulResponseMock(sandbox);
      sandbox.stub(url, 'parse', () => ({}));
      fetch.remote('http://url.com/existing-image.gif').then(() => {
        const expectedOptions = {
          headers: {},
          method: 'GET',
        };
        assert(httpRequestStub.calledOnce);
        sinon.assert.calledWith(httpRequestStub,
          sinon.match(expectedOptions),
          sinon.match.typeOf('function')
        );
        done();
      }).catch((e) => done(e));
    });
    describe('http.request', () => {
      it('should return with expected error', (done) => {
        setupReqRes(200);
        sandbox.stub(url, 'parse', () => ({}));
        const shouldNotBeCalled = sinon.spy();
        fetch.remote('http://127.0.0.1/existing-image.gif').then(shouldNotBeCalled, (error) => {
          assert.equal(error, 'HTTP Request error: Error: connect ECONNREFUSED 127.0.0.1:80');
          done();
        }).catch((e) => done(e));
      });
    });
  });
});
