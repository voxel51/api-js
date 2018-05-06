/*
 * Authentication module for the API.
 *
 * Copyright 2017-2018, Voxel51, LLC
 * voxel51.com
 *
 * David Hodgson, david@voxel51.com
 * Brian Moore, brian@voxel51.com
*/

'use strict';

let fs = require('fs');

let config = require('./config.js');
let utils = require('./utils.js');

/**
 * Activates the given token by copying it to `~/.voxel51/api-token.json`.
 * Subsequent API instances will now use this token for authentication.
 *
 * @function activateToken
 * @param {string} path - Path to a token JSON file
 */
exports.activateToken = function(path) {
  utils.ensureBaseDir(path);
  fs.copyFileSync(path, config.TOKEN_PATH);
};

/**
 * Deactivates (deletes) the currently active token, if any.
 * The active token is the token at `~/.voxel51/api-token.json`.
 *
 * @function deactivateToken
 * @throws {Error} if there was no active token to deactivate
 */
exports.deactivateToken = function() {
  if (!fs.existsSync(config.TOKEN_PATH)) {
    throw new Error('No token to deactivate');
  }
  fs.unlinkSync(config.TOKEN_PATH);
};

/**
 * Loads the active API token. If the `VOXEL51_API_TOKEN` environment variable
 * is set, this is the active token and will be loaded. Otherwise the token is
 * loaded from `~/.voxel51/api-token.json`.
 *
 * @private
 * @function loadToken
 * @return {object} the token JSON object
 * @throws {Error} if no valid token was found
 */
function loadToken() {
  let tokenPath = process.env[config.TOKEN_ENVIRON_VAR] || config.TOKEN_PATH;
  if (!fs.existsSync(tokenPath)) {
    throw new Error('No token found');
  }
  let token = fs.readFileSync(tokenPath);
  return JSON.parse(token);
};
exports.loadToken = loadToken;

/**
 * Gets the HTTP request header for the active API token.
 *
 * @private
 * @function getRequestHeader
 * @return {object} the authenticated request header
 */
exports.getRequestHeader = function() {
  let token = loadToken();
  let key = token[config.ACCESS_TOKEN_FIELD][config.PRIVATE_KEY_FIELD];
  return {'Authorization': 'Bearer ' + key};
};
