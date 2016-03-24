'use strict';

var assert = require('assert-plus');
var Promise = require('bluebird');

var DEFA_SOCKET_KEEPALIVE = 5;
var DEFA_SOCKET_TIMEOUT_MS = 30000;

function connect(mongoUri, customizeOptions) {
  var dbconnect = this; // eslint-disable-line no-invalid-this
  var dbopts, n;
  assert.string(mongoUri, 'mongoUri');
  assert.optionalFunc(customizeOptions, 'customizeOptions');

  dbopts = {
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
    n = parseInt(process.env.MONGODB_OPTIONS_SOCKET_KEEPALIVE, 10);
    dbopts.server.socketOptions.keepAlive = n;
    dbopts.replset.socketOptions.keepAlive = n;
  }
  if (process.env.MONGODB_OPTIONS_SOCKET_CONNECT_TIMEOUT_MS) {
    n = parseInt(process.env.MONGODB_OPTIONS_SOCKET_CONNECT_TIMEOUT_MS, 10);
    dbopts.server.socketOptions.connectTimeoutMS = n;
    dbopts.replset.socketOptions.connectTimeoutMS = n;
  }
  if (process.env.MONGODB_OPTIONS_SSLVALIDATE === '0') {
    dbopts.server.sslValidate = false;
    dbopts.replset.sslValidate = false;
  }

  return dbconnect(mongoUri, dbopts);
}

function use(mongodb) {
  var dbconnect = Promise.promisify(mongodb.Db.connect);
  return {
    connect: connect.bind(dbconnect)
  };
}

module.exports = {
  use: use
};
