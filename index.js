'use strict';

let assert = require('assert-plus');
let Promise = require('bluebird');

const DEFA_SOCKET_KEEPALIVE = 5;
const DEFA_SOCKET_TIMEOUT_MS = 30000;

let $mongodb = Symbol('mongodb');
let $connect = Symbol('connect');

class Connector {

  constructor() {}

  use(mongodb) {
    assert.ok(!this.mongodb, 'mongodb already specified');
    this[$mongodb] = mongodb;
    this[$connect] = Promise.promisify(mongodb.Db.connect);
    return this;
  }

  connect(mongoUri, customizeOptions) {
    assert.ok(this.mongodb, 'must specify mongodb module before connecting');
    assert.string(mongoUri, 'mongoUri');
    assert.optionalFunc(customizeOptions, 'customizeOptions');

    let dbopts = {
      server: {
        socketOptions: { keepAlive: DEFA_SOCKET_KEEPALIVE, connectTimeoutMS: DEFA_SOCKET_TIMEOUT_MS }
      },
      replset: {
        socketOptions: { keepAlive: DEFA_SOCKET_KEEPALIVE, connectTimeoutMS: DEFA_SOCKET_TIMEOUT_MS }
      }
    };

    // caller supplied customization...
    if (customizeOptions) {
      dbopts = customizeOptions(dbopts);
    }

    // operator supplied customization...
    if (process.env.MONGODB_OPTIONS_SOCKET_KEEPALIVE) {
      let n = parseInt(process.env.MONGODB_OPTIONS_SOCKET_KEEPALIVE, 10);
      dbopts.server.socketOptions.keepAlive = n;
      dbopts.replset.socketOptions.keepAlive = n;
    }
    if (process.env.MONGODB_OPTIONS_SOCKET_CONNECT_TIMEOUT_MS) {
      let n = parseInt(process.env.MONGODB_OPTIONS_SOCKET_CONNECT_TIMEOUT_MS, 10);
      dbopts.server.socketOptions.connectTimeoutMS = n;
      dbopts.replset.socketOptions.connectTimeoutMS = n;
    }
    if (process.env.MONGODB_OPTIONS_SSLVALIDATE === '0') {
      dbopts.server.sslValidate = false;
      dbopts.replset.sslValidate = false;
    }

    return this[$connect](mongoUri, dbopts);
  }

  get mongodb() { return this[$mongodb]; }
}

function use(mongodb) {
  return new Connector().use(mongodb);
}

module.exports = {
  use,
  Connector
};
