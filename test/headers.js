'use strict';

const assert = require('chai').assert;
const fetch = require('../index.js');
const sinon = require('sinon');
const server = require('./fixtures/server.js');

let sandbox;

describe('Headers tests', () => {
  before(server.start);
  after(server.stop);
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('the headers should include UA', (done) => {
    fetch.remote('http://localhost:3456').then(() => {
      const headers = server.getLastRequest().headers;
      console.log(headers);
      assert.include(headers, {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      });
      done();
    }).catch(e => done(e));
  });
});
