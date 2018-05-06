/*
 * Thin wrapper over the Node request module that provides conveinence methods
 * to perform authenticated API requests.
 *
 * Copyright 2017-2018, Voxel51, LLC
 * voxel51.com
 *
 * David Hodgson, david@voxel51.com
*/

'use strict';

let request = require('request');

let auth = require('./auth.js');

let base = request.defaults({
  baseUrl: config.BASE_URL,
  headers: auth.getRequestHeader(),
});
exports.base = base;

function validate(res, body) {
  return new Promise(function(resolve, reject) {
    if (res.statusCode > 299) {
      let error = new Error(body);
      error.code = res.statusCode;
      throw error;
      reject(err);
    } else {
      resolve(body);
    }
  });
};
exports.validate = validate;

exports.get = function(options) {
  return new Promise(function(resolve, reject) {
    base.get(options, async function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(await validate(res, body));
      }
    });
  });
};

exports.post = function(options) {
  return new Promise(function(resolve, reject) {
    base.post(options, async function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(await validate(res, body));
      }
    });
  });
};

exports.delete = function(options) {
  return new Promise(function(resolve, reject) {
    base.delete(options, async function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(await validate(res, body));
      }
    });
  });
};

exports.put = function(options) {
  return new Promise(function(resolve, reject) {
    base.put(options, async function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(await validate(res, body));
      }
    });
  });
};
