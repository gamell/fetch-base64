'use strict';

const assert = require('chai').assert;
const fetchRemote = require('../../lib/fetch-remote.js');
const sinon = require('sinon');
const http = require('http');
const https = require('https');
const legacyUrl = require('url');
const PassThrough = require('stream').PassThrough;

let sandbox;
let request;
let response;
let requestStub;

function setupReqRes(statusCode) {
  request = new PassThrough();
  response = new PassThrough();
  response.statusCode = statusCode;
  response.write('data');
  response.end();
}

function setupSuccessfulResponseMock(sb, agent) {
  setupReqRes(200);
  requestStub = sb.stub(agent, 'request').callsArgWith(1, response).returns(request);
}

function swallow() {}

describe('fetchRemote (Unit)', () => {
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
  it('should call http.request with correct url and options', (done) => {
    setupSuccessfulResponseMock(sandbox, http);
    fetchRemote.fetch('http://url.com/existing-image.gif').then(() => {
      const expectedOptions = {
        headers: {},
        method: 'GET',
      };
      assert(requestStub.calledOnce);
      sinon.assert.calledWith(requestStub,
        sinon.match(expectedOptions),
        sinon.match.typeOf('function')
      );
      done();
    }).catch((e) => done(e));
  });
  it('should call url.resolve if several paths passed', (done) => {
    setupSuccessfulResponseMock(sandbox, http);
    const urlResolveStub = sandbox.stub(legacyUrl, 'resolve').callsFake(() => 'http://url.com/existing-image.gif');
    fetchRemote.fetch('http://url.com', '/existing-image.gif').then(() => {
      assert(urlResolveStub.calledOnce);
      sinon.assert.calledWith(urlResolveStub, 'http://url.com', '/existing-image.gif');
      done();
    }).catch((e) => done(e));
  });
  it('should not call url.resolve if only one path passed', (done) => {
    setupSuccessfulResponseMock(sandbox, http);
    const urlResolveStub = sandbox.stub(legacyUrl, 'resolve').callsFake(() => ({}));
    fetchRemote.fetch('http://url.com/image.gif').then(() => {
      assert.equal(urlResolveStub.callCount, 0);
      done();
    }).catch((e) => done(e));
  });
  describe('http', () => {
    it('should be called for http resources', (done) => {
      setupSuccessfulResponseMock(sandbox, http);
      fetchRemote.fetch('http://gamell.io/sprite.png').then(() => {
        assert.equal(requestStub.callCount, 1);
        done();
      }).catch((e) => done(e));
    });
    it('should return with expected error', (done) => {
      const shouldNotBeCalled = sinon.spy();
      fetchRemote.fetch('http://127.0.0.1/existing-image.gif').then(shouldNotBeCalled, (error) => {
        assert.equal(error, 'HTTP Request error: Error: connect ECONNREFUSED 127.0.0.1:80');
        done();
      }).catch((e) => done(e));
    });
  });
  describe('https', () => {
    it('should be called for https resources', (done) => {
      setupSuccessfulResponseMock(sandbox, https);
      fetchRemote.fetch('https://gamell.io/sprite.png').then(() => {
        assert.equal(requestStub.callCount, 1);
        done();
      }).catch((e) => done(e));
    });
    it('should return with expected error', (done) => {
      const shouldNotBeCalled = sinon.spy();
      fetchRemote.fetch('https://127.0.0.1/existing-image.gif').then(shouldNotBeCalled, (error) => {
        assert.equal(error, 'HTTP Request error: Error: connect ECONNREFUSED 127.0.0.1:443');
        done();
      }).catch((e) => done(e));
    });
  });
});
