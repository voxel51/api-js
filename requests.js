/*
 * Abstraction/wrapper over the node request module. The
 * baseRequest object allows setting of default base url and
 * a default header for authorization.
 *
 * Copyright 2018, Voxel51, LLC
 * voxel51.com
*/

'use strict';

let request = require('request');
const CONFIG = require('./config.js');
let baseRequest = request.defaults({
  baseUrl: CONFIG.URI,
  headers: CONFIG.HEADER,
});
exports.baseRequest = baseRequest;

exports.get = function(options) {
  return new Promise(function(resolve, reject) {
    baseRequest.get(options, function(err, rsp, body) {
      if (err) {
        reject(err);
      } else {
        rsp.body = body;
        resolve(rsp);
      }
    });
  });
};

exports.post = function(options) {
  return new Promise(function(resolve, reject) {
    baseRequest.post(options, function(err, rsp, body) {
      if (err) {
        reject(err);
      } else {
        rsp.body = body;
        resolve(rsp);
      }
    });
  });
};

exports.delete = function(options) {
  return new Promise(function(resolve, reject) {
    baseRequest.delete(options, function(err, rsp, body) {
      if (err) {
        reject(err);
      } else {
        rsp.body = body;
        resolve(rsp);
      }
    });
  });
};

exports.put = function(options) {
  return new Promise(function(resolve, reject) {
    baseRequest.put(options, function(err, rsp, body) {
      if (err) {
        reject(err);
      } else {
        rsp.body = body;
        resolve(rsp);
      }
    });
  });
};

exports.req = baseRequest;
