'use strict';

const assert = require('chai').assert;
const fetch = require('../index.js');
const sinon = require('sinon');
const server = require('./fixtures/server.js');

let sandbox;
const SERVER_PORT = 3456;

describe('Header tests', () => {
  before(() => server.start(SERVER_PORT));
  after(server.stop);
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('the headers should include UA', (done) => {
    fetch.remote(`http://localhost:${SERVER_PORT}`).then(() => {
      const headers = server.getLastRequest().headers;
      assert.include(headers, { // node always lower-cases all headers
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      });
      assert.equal(Object.keys(headers).length, 3);
      done();
    }).catch(e => done(e));
  });

  it('it should include customized headers', (done) => {
    fetch.remote({ url: `http://localhost:${SERVER_PORT}`, headers: { 'xxx-test': 'foo' } }).then(() => {
      const headers = server.getLastRequest().headers;
      assert.include(headers, { // node always lower-cases all headers
        'xxx-test': 'foo'
      });
      assert.equal(Object.keys(headers).length, 4);
      done();
    }).catch(e => done(e));
  });
});
