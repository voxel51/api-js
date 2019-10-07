/**
 * Thin wrapper over the Node request module for the Voxel51 Platform API.
 *
 * Copyright 2017-2019, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 */

'use strict';

let request = require('request');

let utils = require('./utils.js');

exports.get = function(uri, headers = {}, options = {}) {
  options = wrapOptions_(uri, headers, options);
  return new Promise(function(resolve, reject) {
    request.get(options, function(err, res, body) {
      if (err) {
        return reject(err);
      }
      return validate_(res, body)
        .then((body) => {
          return resolve(body);
        }).catch((err) => {
          return reject(err);
        });
    });
  });
};

exports.post = function(uri, headers = {}, options = {}) {
  options = wrapOptions_(uri, headers, options);
  return new Promise(function(resolve, reject) {
    request.post(options, function(err, res, body) {
      if (err) {
        return reject(err);
      }
      return validate_(res, body)
        .then((body) => {
          return resolve(body);
        }).catch((err) => {
          return reject(err);
        });
    });
  });
};

exports.delete = function(uri, headers = {}, options = {}) {
  options = wrapOptions_(uri, headers, options);
  return new Promise(function(resolve, reject) {
    request.delete(options, function(err, res, body) {
      if (err) {
        return reject(err);
      }
      return validate_(res, body)
        .then((body) => {
          return resolve(body);
        }).catch((err) => {
          return reject(err);
        });
    });
  });
};

exports.put = function(uri, headers = {}, options = {}) {
  options = wrapOptions_(uri, headers, options);
  return new Promise(function(resolve, reject) {
    request.put(options, function(err, res, body) {
      if (err) {
        return reject(err);
      }
      return validate_(res, body)
        .then((body) => {
          return resolve(body);
        }).catch((err) => {
          return reject(err);
        });
    });
  });
};

exports.pipe = function(uri, stream, headers = {}, options = {}) {
  options = wrapOptions_(uri, headers, options);
  return new Promise(function(resolve, reject) {
    request(options)
      .pipe(stream)
      .on('finish', function() {
        return resolve(Promise.resolve());
      })
      .on('error', function(err) {
        return reject(err);
      });
  });
};

function wrapOptions_(uri, headers = {}, options = {}) {
  options.uri = uri;
  options.headers = headers;
  return options;
}

function validate_(res, body) {
  return new Promise(function(resolve, reject) {
    if (res.statusCode < 300) {
      return resolve(body);
    }
    return reject(APIError.fromResponseBody(body));
  });
};

/**
 * Error raised when an API request fails.
 *
 * @extends module:users/utils~ExtendableError
 */
class APIError extends utils.ExtendableError {

  /**
   * Creates a new APIError instance.
   *
   * @constructor
   * @param {string} message - the error message
   * @param {string} code - the error code
   */
  constructor(message, code) {
    super(code + ': ' + message);
  }

  /**
   * Constructs an APIError from a request response.
   *
   * @param {object} body - the body of a request response
   * @return {APIError} an APIError instance
   */
  static fromResponseBody(body) {
    let err = JSON.parse(body).error;
    return new APIError(err.message, err.code);
  }
}

exports.APIError = APIError;
