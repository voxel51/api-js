/**
 * Authentication module for the Voxel51 Platform API.
 *
 * Copyright 2017-2019, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module users/auth
 */

'use strict';

const autoBind = require('auto-bind');
const fs = require('fs');
const os = require('os');
const path = require('path');

const utils = require('./utils.js');

const TOKEN_ENVIRON_VAR = 'VOXEL51_API_TOKEN';
const TOKEN_PATH = path.join(os.homedir(), '.voxel51', 'api-token.json');
const HELP_URL = 'https://voxel51.com/docs/api/?javascript#authentication';

/**
 * Activates the given token by copying it to `~/.voxel51/api-token.json`.
 * Subsequent API instances will now use this token for authentication.
 *
 * @instance
 * @param {string} path - path to an API token JSON file
 */
function activateToken(path) {
  utils.copyFile(path, TOKEN_PATH);
  console.log('API token successfully activated');
}

/**
 * Deactivates (deletes) the currently active token, if any.
 * The active token is the token at `~/.voxel51/api-token.json`.
 *
 * @instance
 */
function deactivateToken() {
  if (fs.existsSync(TOKEN_PATH)) {
    fs.unlinkSync(TOKEN_PATH);
    console.log(`API token '${TOKEN_PATH}' successfully deactivated`);
  } else {
    console.log('No API token to deactivate');
  }
}

/**
 * Gets the path to the active API token.
 *
 * If the `VOXEL51_API_TOKEN` environment variable is set, that path is used.
 * Otherwise, `~/.voxel51/api-token.json` is used.
 *
 * @instance
 * @return {string} the path to the active token
 * @throws {TokenError} if no token was found
 */
function getActiveTokenPath() {
  let tokenPath = process.env[TOKEN_ENVIRON_VAR];
  if (tokenPath) {
    if (!fs.existsSync(tokenPath)) {
      throw new TokenError(
        `No API token found at '${TOKEN_ENVIRON_VAR}=${tokenPath}'`);
    }
  } else if (fs.existsSync(TOKEN_PATH)) {
    tokenPath = TOKEN_PATH;
  } else {
    throw new TokenError('No API token found');
  }
  return tokenPath;
}

/**
 * Loads the active API token.
 *
 * @instance
 * @param {string} [tokenPath=null] - optional path to a Token JSON file.
 *   If no path is provided as an argument, the `VOXEL51_API_TOKEN` environment
 *   variable is checked and, if set, the token is loaded from that path.
 *   Otherwise, the token is loaded from `~/.voxel51/api-token.json`
 * @return {Token} the active API token
 * @throws {TokenError} if no valid token was found
 */
function loadToken(tokenPath=null) {
  if (!tokenPath) {
    tokenPath = getActiveTokenPath();
  } else if (!fs.existsSync(tokenPath)) {
      throw new TokenError(`No API token found at '${tokenPath}'`);
  }

  try {
    return Token.fromJSON(tokenPath);
  } catch {
    throw new TokenError(`File '${tokenPath}' is not a valid API token`);
  }
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
  constructor(token) {
    this.creationDate = token.access_token.created_at;
    this.id = token.access_token.token_id;
    this.privateKey_ = token.access_token.private_key;
    this.token_ = token;
    autoBind(this);
  }

  /**
   * Generates a string representation of the Token.
   *
   * @return {string} a string representation of the token
   */
  toString() {
    return utils.JSONToStr(this.token_);
  }

  /**
   * Returns a header dictionary for authenticating requests with this token.
   *
   * @return {object} a header object
   */
  getHeader() {
    return {'Authorization': 'Bearer ' + this.privateKey_};
  }

  /**
   * Loads a Token from JSON.
   *
   * @param {string} path - the path to a valid Token JSON file
   * @return {Token} a Token instance
   */
  static fromJSON(path) {
    return new Token(utils.readJSON(path));
  }
}

/**
 * Error raised when a problem with a Token is encountered.
 *
 * @extends module:users/utils~ExtendableError
 */
class TokenError extends utils.ExtendableError {}

  /**
   * Creates a new TokenError instance.
   *
   * @constructor
   * @param {string} message - the error message
   */
  constructor(message) {
    super(
      `${message}. See ${HELP_URL} for more information about activating an ` +
      `API token`);
  }
}

exports.activateToken = activateToken;
exports.deactivateToken = deactivateToken;
exports.getActiveTokenPath = getActiveTokenPath;
exports.loadToken = loadToken;
exports.Token = Token;
exports.TokenError = TokenError;
