/*
 * Thin wrapper over the Node request module that provides conveinence methods
 * to perform authenticated API requests.
 *
 * Copyright 2017-2018, Voxel51, LLC
 * voxel51.com
 *
 * David Hodgson, david@voxel51.com
 * Brian Moore, brian@voxel51.com
 */

'use strict';

let request = require('request');

let auth = require('./auth.js');

function wrapOptions_(uri, headers = {}, options = {}) {
  options.uri = uri;
  options.headers = headers;
  return options;
}

exports.raw = function(uri, headers = {}, options = {}) {
  options = wrapOptions_(uri, headers, options);
  return request(options);
};

exports.get = function(uri, headers = {}, options = {}) {
  return new Promise(function(resolve, reject) {
    options = wrapOptions_(uri, headers, options);
    request.get(options, async function(err, res, body) {
      if (err) {
        reject(err);
      }
      try {
        resolve(await validate(res, body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

exports.post = function(uri, headers = {}, options = {}) {
  return new Promise(function(resolve, reject) {
    options = wrapOptions_(uri, headers, options);
    request.post(options, async function(err, res, body) {
      if (err) {
        reject(err);
      }
      try {
        resolve(await validate(res, body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

exports.delete = function(uri, headers = {}, options = {}) {
  return new Promise(function(resolve, reject) {
    options = wrapOptions_(uri, headers, options);
    request.delete(options, async function(err, res, body) {
      if (err) {
        reject(err);
      }
      try {
        resolve(await validate(res, body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

exports.put = function(uri, headers = {}, options = {}) {
  return new Promise(function(resolve, reject) {
    options = wrapOptions_(uri, headers, options);
    request.put(options, async function(err, res, body) {
      if (err) {
        reject(err);
      }
      try {
        resolve(await validate(res, body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

function validate(res, body) {
  return new Promise(function(resolve, reject) {
    if (res.statusCode > 299) {
      let error = new Error(body);
      error.code = res.statusCode;
      reject(error);
    } else {
      resolve(body);
    }
  });
};

exports.validate = validate;
