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

function swallow() {}

describe('fetchRemote', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should always return a promise', () => {
    const remote1 = fetchRemote.fetch('something');
    const remote2 = fetchRemote.fetch();
    assert(typeof remote1.then === 'function');
    assert(typeof remote2.then === 'function');
    Promise.all([remote1, remote2]).catch(swallow);
  });
  it('should call url.parse with correct url', (done) => {
    const urlStub = sandbox.stub(url, 'parse').callsFake(() => ({ prop1: 'value1' }));
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
    sandbox.stub(url, 'parse').callsFake(() => ({}));
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
  describe('http.request', () => {
    it('should return with expected error', (done) => {
      setupReqRes(200);
      sandbox.stub(url, 'parse').callsFake(() => ({}));
      const shouldNotBeCalled = sinon.spy();
      fetchRemote.fetch('http://127.0.0.1/existing-image.gif').then(shouldNotBeCalled, (error) => {
        assert.equal(error, 'HTTP Request error: Error: connect ECONNREFUSED 127.0.0.1:80');
        done();
      }).catch((e) => done(e));
    });
  });
});
