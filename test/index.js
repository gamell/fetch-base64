'use strict';

const assert = require('chai').assert;
const fetch = require('../index.js');
const sinon = require('sinon');
const fs = require('fs');
const http = require('http');

describe('Fetch Base64', () => {
  before(() => {
  });
  after(() => {
  });
  beforeEach(() => {
  });
  afterEach(() => {
  });
  describe('fetchImageBase64()', () => {
    it('should always return a promise', () => {
      assert(typeof fetch('non-existant-path').then === 'function');
      assert(typeof fetch().then === 'function');
    });

    it('it should throw an error when mime type is not an image', (done) => {
      fetch('/non-existant-path/non-image.txt').catch((e) => {
        assert.equal(e, 'The referenced file is not an image.');
        done();
      });
    });

    it('should successfully return an existing local image', (done) => {
      // call the 2nd argument passed to the readFile() function (callback) with given args
      sinon.stub(fs, 'readFile').callsArgWith(1, null, 'png-data');
      fetch('/existing-path/image.png').then((res) => {
        assert.equal(res, 'data:image/png;base64,png-data');
        fs.readFile.restore();
        done();
      });
    });

    it('should return a rejected promise for a non-existent local image', (done) => {
      // call the 2nd argument passed to the readFile() function (callback) with given args
      sinon.stub(fs, 'readFile').callsArgWith(1, 'error', null);
      const shouldNotBeCalled = sinon.spy();
      fetch('/non-existing-path/image.png').then(shouldNotBeCalled, (error) => {
        assert.equal(error, 'error');
        assert.equal(shouldNotBeCalled.callCount, 0);
        fs.readFile.restore();
        done();
      });
    });

    // it('should successfully return an existing remote image', (done) => {
    //   // call the 2nd argument passed to the readFile() function (callback) with given args
    //   sinon.stub(http, 'request').callsArgWith(1, null, 'png-data');
    //   fetch('/existing-path/image.png').then((res) => {
    //     assert.equal(res, 'data:image/png;base64,png-data');
    //     fs.readFile.restore();
    //     done();
    //   });
    // });
    //
    // it('should return a rejected promise when any error occurs fetching a remote image', (done) => {
    //   // call the 2nd argument passed to the readFile() function (callback) with given args
    //   sinon.stub(fs, 'readFile').callsArgWith(1, 'error', null);
    //   const shouldNotBeCalled = sinon.spy();
    //   fetch('/non-existing-path/image.png').then(shouldNotBeCalled, (error) => {
    //     assert.equal(error, 'error');
    //     assert.equal(shouldNotBeCalled.callCount, 0);
    //     fs.readFile.restore();
    //     done();
    //   });
    // });
  });
});
