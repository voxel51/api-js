/**
 * Authentication module for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module auth
 */

'use strict';

let fs = require('fs');
let os = require('os');
let path = require('path');

let utils = require('./utils.js');

const TOKEN_ENVIRON_VAR = 'VOXEL51_API_TOKEN';
const TOKEN_PATH = path.join(os.homedir(), '.voxel51', 'api-token.json');
const ACCESS_TOKEN_FIELD = 'access_token';
const PRIVATE_KEY_FIELD = 'private_key';

/**
 * Activates the given token by copying it to `~/.voxel51/api-token.json`.
 * Subsequent API instances will now use this token for authentication.
 *
 * @instance
 * @param {string} path - path to an API token JSON file
 */
function activateToken(path) {
  utils.copyFile(path, TOKEN_PATH);
}

/**
 * Deactivates (deletes) the currently active token, if any.
 * The active token is the token at `~/.voxel51/api-token.json`.
 *
 * @instance
 */
function deactivateToken(path) {
  if (fs.existsSync(TOKEN_PATH)) {
    fs.unlinkSync(TOKEN_PATH);
  }
}

/**
 * Loads the active API token.
 *
 * @instance
 * @param {string} [tokenPath=null] - optional path to a valid Token JSON file.
 *   If no path is provided as an argument, the `VOXEL51_API_TOKEN` environment
 *   variable is checked and, if set, the token is loaded from that path.
 *   Otherwise, the token is loaded from `~/.voxel51/api-token.json`
 * @returns {Token} the active token
 * @throws {TokenLoadError} if no valid token was found
 */
function loadToken(tokenPath = null) {
  let path = tokenPath || process.env[TOKEN_ENVIRON_VAR] || TOKEN_PATH;
  if (!fs.existsSync(path)) {
    throw new TokenLoadError('No token found');
  }
  return Token.fromJSON(path);
}

/**
 * A class encapsulating an API authentication token.
 */
class Token {

  /**
   * Creates a new Token object with the given contents.
   *
   * @constructor
   * @param {object} token - an object defining an API token
   * @retuns {Token} a Token instance
   */
  constructor(token_obj) {
    this.token_obj_ = token_obj;
    this.private_key_ = token_obj[ACCESS_TOKEN_FIELD][PRIVATE_KEY_FIELD];
  }

  /**
   * Generates a string representation of the Token.
   *
   * @returns {string} a string representation of the token
   */
  toString() {
    return utils.JSONToStr(this.token_obj_);
  }

  /**
   * Returns a header dictionary for authenticating requests with this token.
   *
   * @returns {object} a header object
   */
  getHeader() {
    return {'Authorization': 'Bearer ' + this.private_key_};
  }

  /**
   * Loads a Token from JSON.
   *
   * @param {string} path - the path to a valid Token JSON file
   * @returns {Token} a Token instance
   */
  static fromJSON(path) {
    return new Token(utils.readJSON(path));
  }
}

/**
 * Error raised when a Token fails to load.
 *
 * @extends module:utils~ExtendableError
 */
class TokenLoadError extends utils.ExtendableError {}

exports.activateToken = activateToken;
exports.deactivateToken = deactivateToken;
exports.loadToken = loadToken;
exports.Token = Token;
exports.TokenLoadError = TokenLoadError;
