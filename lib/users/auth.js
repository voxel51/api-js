/* eslint-disable no-console */
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

const TOKEN_ENV_VAR = 'VOXEL51_API_TOKEN';
const PRIVATE_KEY_ENV_VAR = 'VOXEL51_API_PRIVATE_KEY';
const BASE_API_URL_ENV_VAR = 'VOXEL51_API_BASE_URL';

const TOKEN_PATH = path.join(os.homedir(), '.voxel51', 'api-token.json');

const DEAFULT_BASE_API_URL = 'https://api.voxel51.com';
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
 * Gets the path to the active API token, if any.
 *
 * If the `VOXEL51_API_TOKEN` environment variable is set, that path is used.
 * Otherwise, `~/.voxel51/api-token.json` is used.
 *
 * Note that if the `VOXEL51_API_PRIVATE_KEY` environment variable is set, this
 * function will always return `undefined`, since that environment variable
 * always takes precedence over other methods for locating the active token.
 *
 * @instance
 * @return {string} the path to the active token, or undefined
 */
function getActiveTokenPath() {
  let privateKey = process.env[PRIVATE_KEY_ENV_VAR];
  if (privateKey) {
    return;
  }

  let tokenPath = process.env[TOKEN_ENV_VAR];
  if (tokenPath) {
    if (!fs.existsSync(tokenPath)) {
      throw new TokenError(`No file found at '${TOKEN_ENV_VAR}=${tokenPath}'`);
    }
  } else if (fs.existsSync(TOKEN_PATH)) {
    tokenPath = TOKEN_PATH;
  }

  return tokenPath;
}

/**
 * Loads the active API token.
 *
 * The following strategy is used to locate your active API token:
 *
 * (1) Use the provided `tokenPath`
 * (2) Use the `VOXEL51_API_PRIVATE_KEY` and `VOXEL51_API_BASE_URL` environment
 *     variables
 * (3) Use the `VOXEL51_API_TOKEN` environment variable
 * (4) Load the active token from `~/.voxel51/api-token.json`
 *
 * @instance
 * @param {string} [tokenPath=null] - optional path to a Token JSON file.
 *   If no path is provided, the active token is loaded using the strategy
 *   described above
 * @return {Token} the active API token
 * @throws {TokenError} if no valid token was found
 */
function loadToken(tokenPath=null) {
  if (tokenPath) {
    return loadTokenFromPath_(tokenPath);
  }

  let privateKey = process.env[PRIVATE_KEY_ENV_VAR];
  if (privateKey) {
    let baseAPIURL = process.env[BASE_API_URL_ENV_VAR];
    return Token.fromPrivateKey(privateKey, baseAPIURL);
  }

  tokenPath = getActiveTokenPath();
  if (tokenPath) {
    return loadTokenFromPath_(tokenPath);
  }

  throw new TokenError('No API token found');
}

function loadTokenFromPath_(tokenPath) {
  if (!fs.existsSync(tokenPath)) {
    throw new TokenError(`No file found at '${tokenPath}'`);
  }

  try {
    return Token.fromJSON(tokenPath);
  } catch (e) {
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
    let accessToken = token.access_token;
    this.baseAPIURL = Token.parseBaseAPIURL_(accessToken);
    this.creationDate = accessToken.created_at;
    this.id = accessToken.token_id;
    this.privateKey = accessToken.private_key;
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
    return {'Authorization': 'Bearer ' + this.privateKey};
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

  /**
   * Builds a Token from its private key.
   *
   * @param {string} privateKey - the private key of the token
   * @param {string} [baseAPIURL=null] - the base URL of the API for the token.
   *   If undefined, the default platform API is assumed
   * @return {Token} a Token instance
   */
  static fromPrivateKey(privateKey, baseAPIURL=undefined) {
    return new Token({
      access_token: {
        private_key: privateKey,
        base_api_url: baseAPIURL || DEAFULT_BASE_API_URL,
      },
    });
  }

  // eslint-disable-next-line require-jsdoc
  static parseBaseAPIURL_(accessToken) {
    let baseAPIURL = accessToken.base_api_url;
    if (!baseAPIURL) {
      baseAPIURL = DEAFULT_BASE_API_URL;
      console.warn(
        `No base API URL found in token; defaulting to '${baseAPIURL}'. To ` +
        `resolve this message, download a new API token from the Platform`);
    }
    return baseAPIURL;
  }
}

/**
 * Error raised when a problem with a Token is encountered.
 *
 * @extends module:users/utils~ExtendableError
 */
class TokenError extends utils.ExtendableError {
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
