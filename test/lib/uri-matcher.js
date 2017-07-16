'use strict';

const assert = require('chai').assert;
const uriMatcher = require('../../lib/uri-matcher.js');
const sinon = require('sinon');

let sandbox;

describe('Uri matcher (Unit)', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('isRemote()', () => {
    it('should return a boolean', () => {
      assert.equal(typeof uriMatcher.isRemote('nonRemote'), 'boolean');
      assert.equal(typeof uriMatcher.isRemote('http://remote'), 'boolean');
    });

    it('should throw an error if argument missing', () => {
      // to test exceptions we need to wrap the function that will throw inside an another func. http://stackoverflow.com/questions/33756027/fail-a-test-with-chai-js
      assert.throws(() => uriMatcher.isRemote(), 'Required parameter path missing');
    });

    it('should throw an error if wrong type', () => {
      assert.throws(() => uriMatcher.isRemote(1), 'path.match is not a function');
    });

    it('should return true for remote URIs', () => {
      assert.isTrue(uriMatcher.isRemote('http://doman.com/remote-image.gif'));
      assert.isTrue(uriMatcher.isRemote('http://doman.com/'));
      assert.isTrue(uriMatcher.isRemote('https://doman.com/'));
      assert.isTrue(uriMatcher.isRemote('https://doman/bla'));
    });

    it('should return false for local URIs', () => {
      assert.isFalse(uriMatcher.isRemote('remote-image.gif'));
      assert.isFalse(uriMatcher.isRemote('/local/path/'));
      assert.isFalse(uriMatcher.isRemote('something'));
      assert.isFalse(uriMatcher.isRemote('~/local.jpg'));
    });
  });
  describe('isLocal()', () => {
    it('should return the opposite of isRemote() for the same path', () => {
      assert.equal(uriMatcher.isRemote('nonRemote'), !uriMatcher.isLocal('nonRemote'));
      assert.equal(!uriMatcher.isRemote('http://remote.com'), uriMatcher.isLocal('http://remote.com'));
    });
  });
});
