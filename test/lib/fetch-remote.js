'use strict';

const assert = require('chai').assert;
const fetchRemote = require('../../lib/fetch-remote.js');
const sinon = require('sinon');
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

describe('fetchRemote', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should always return a promise', () => {
    assert(typeof fetchRemote.fetch('something').then === 'function');
    assert(typeof fetchRemote.fetch().then === 'function');
  });
  it('should call url.parse with correct url', (done) => {
    const urlStub = sandbox.stub(url, 'parse', () => ({ prop1: 'value1' }));
    // setup http.requests stubs
    setupSuccessfulResponseMock(sandbox);
    fetchRemote.fetch('http://url.com/existing-image.gif').then(() => {
      assert(urlStub.calledOnce);
      assert(urlStub.calledWith('http://url.com/existing-image.gif'));
      done();
    }).catch((e) => done(e));
  });
  it('should call http.request with correct url and options', (done) => {
    setupSuccessfulResponseMock(sandbox);
    sandbox.stub(url, 'parse', () => ({}));
    fetchRemote.fetch('http://url.com/existing-image.gif').then(() => {
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
  it('should call url.resolve if several paths passed', (done) => {
    setupSuccessfulResponseMock(sandbox);
    const urlParseStub = sandbox.stub(url, 'parse', () => ({}));
    const urlResolveStub = sandbox.stub(url, 'resolve', () => 'http://url.com/existing-image.gif');
    fetchRemote.fetch('http://url.com', '/existing-image.gif').then(() => {
      assert(urlResolveStub.calledOnce);
      sinon.assert.calledWith(urlResolveStub, 'http://url.com', '/existing-image.gif');
      assert(urlParseStub.calledWith('http://url.com/existing-image.gif'));
      done();
    }).catch((e) => done(e));
  });
  it('should not call url.resolve if only one path passed', (done) => {
    setupSuccessfulResponseMock(sandbox);
    const urlParseStub = sandbox.stub(url, 'parse', () => ({}));
    const urlResolveStub = sandbox.stub(url, 'resolve', () => ({}));
    fetchRemote.fetch('http://url.com/image.gif').then(() => {
      assert.equal(urlResolveStub.callCount, 0);
      assert(urlParseStub.calledOnce);
      sinon.assert.calledWith(urlParseStub, 'http://url.com/image.gif');
      done();
    }).catch((e) => done(e));
  });
  describe('http.request', () => {
    it('should return with expected error', (done) => {
      setupReqRes(200);
      sandbox.stub(url, 'parse', () => ({}));
      const shouldNotBeCalled = sinon.spy();
      fetchRemote.fetch('http://127.0.0.1/existing-image.gif').then(shouldNotBeCalled, (error) => {
        assert.equal(error, 'HTTP Request error: Error: connect ECONNREFUSED 127.0.0.1:80');
        done();
      }).catch((e) => done(e));
    });
  });
});
