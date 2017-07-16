'use strict';

const assert = require('chai').assert;
const fetchLocal = require('../../lib/fetch-local.js');
const sinon = require('sinon');
const fs = require('fs');

let sandbox;

function swallow() {}

describe('fetchLocal (Unit)', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should always return a promise', () => {
    const local1 = fetchLocal.fetch('something');
    const local2 = fetchLocal.fetch();
    assert(typeof local1.then === 'function');
    assert(typeof local2.then === 'function');
    Promise.all([local1, local2]).catch(swallow);
  });
  it('should call fs.readFile with correct path', (done) => {
    const fsStub = sandbox.stub(fs, 'readFile').callsArgWith(1, null, 'gif-data');
    fetchLocal.fetch('/path/to/existing-image.gif').then((res) => {
      assert.equal(res, 'gif-data');
      assert(fsStub.calledOnce);
      assert(fsStub.calledWith('/path/to/existing-image.gif'));
      done();
    }).catch((e) => done(e));
  });
  it('should return a rejected promise when there is a fs error', (done) => {
    const fsStub = sandbox.stub(fs, 'readFile').callsArgWith(1, 'error message', null);
    const shouldNotBeCalled = sandbox.spy();
    fetchLocal.fetch('/path/to/existing-image.gif').then(shouldNotBeCalled, (error) => {
      assert.equal(error, 'Error reading local file: error message');
      assert(fsStub.calledOnce);
      assert.equal(shouldNotBeCalled.callCount, 0);
      assert(fsStub.calledWith('/path/to/existing-image.gif'));
      done();
    }).catch((e) => done(e));
  });
  it('should return a rejected promise when parameter is wrong type', (done) => {
    const fsStub = sandbox.stub(fs, 'readFile');
    const shouldNotBeCalled = sandbox.spy();
    fetchLocal.fetch(() => {}).then(shouldNotBeCalled, (error) => {
      assert.equal(error, 'TypeError: Path must be a string. Received [Function]');
      assert.equal(fsStub.callCount, 0);
      assert.equal(shouldNotBeCalled.callCount, 0);
      done();
    }).catch((e) => done(e));
  });
});
