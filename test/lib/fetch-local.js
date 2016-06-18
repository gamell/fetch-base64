'use strict';

const assert = require('chai').assert;
const fetchLocal = require('../../lib/fetch-local.js');
const sinon = require('sinon');
const fs = require('fs');

let sandbox;

describe('fetchLocal', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should always return a promise', () => {
    assert(typeof fetchLocal.fetch('something').then === 'function');
    assert(typeof fetchLocal.fetch().then === 'function');
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
});
