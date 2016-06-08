'use strict';

const assert = require('chai').assert;
const uriMatcher = require('../../lib/uri-matcher.js');
const sinon = require('sinon');

let sandbox;

describe('Uri matcher', () => {
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
});
