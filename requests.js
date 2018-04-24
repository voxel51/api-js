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

exports.get = function(options) {
  return new Promise(function(resolve, reject) {
    baseRequest.get(options, async function(err, rsp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(await validate(rsp, body));
      }
    });
  });
};

exports.post = function(options) {
  return new Promise(function(resolve, reject) {
    baseRequest.post(options, async function(err, rsp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(await validate(rsp, body));
      }
    });
  });
};

exports.delete = function(options) {
  return new Promise(function(resolve, reject) {
    baseRequest.delete(options, async function(err, rsp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(await validate(rsp, body));
      }
    });
  });
};

exports.put = function(options) {
  return new Promise(function(resolve, reject) {
    baseRequest.put(options, async function(err, rsp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(await validate(rsp, body));
      }
    });
  });
};

let validate = exports.validate = function validate(rsp, body) {
  return new Promise(function(resolve, reject) {
    if (rsp.statusCode > 299) {
      let error = new Error(body);
      error.code = rsp.statusCode;
      throw error;
      reject(err);
    } else {
      resolve(body);
    }
  });
};

exports.req = baseRequest;
