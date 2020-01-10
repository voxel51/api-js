/**
 * Application authentication module for the Voxel51 Platform API.
 *
 * Copyright 2017-2019, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module apps/auth
 */

'use strict';

const autoBind = require('auto-bind');
const fs = require('fs');
const os = require('os');
const path = require('path');

const auth = require('../users/auth.js');
const utils = require('../users/utils.js');

const TOKEN_ENV_VAR = 'VOXEL51_APP_TOKEN';
const PRIVATE_KEY_ENV_VAR = 'VOXEL51_APP_PRIVATE_KEY';
const BASE_API_URL_ENV_VAR = 'VOXEL51_APP_BASE_URL';

const KEY_HEADER = 'x-voxel51-application';
const USER_HEADER = 'x-voxel51-application-user';
const TOKEN_PATH = path.join(os.homedir(), '.voxel51', 'app-token.json');

/**
 * Activates the given application token by copying it to
 * `~/.voxel51/app-token.json`. Subsequent API instances will now use this
 * token for authentication.
 *
 * @instance
 * @param {string} path - path to an ApplicationToken JSON file
 */
function activateApplicationToken(path) {
  utils.copyFile(path, TOKEN_PATH);
}

/**
 * Deactivates (deletes) the currently active application token, if any.
 * The active application token is at `~/.voxel51/app-token.json`.
 *
 * @instance
 */
function deactivateApplicationToken() {
  if (fs.existsSync(TOKEN_PATH)) {
    fs.unlinkSync(TOKEN_PATH);
  }
}

/**
 * Gets the path to the active application token, if any.
 *
 * If the `VOXEL51_APP_TOKEN` environment variable is set, that path is used.
 * Otherwise, `~/.voxel51/app-token.json` is used.
 *
 * Note that if the `VOXEL51_APP_PRIVATE_KEY` environment variable is set, this
 * function will always return `undefined`, since that environment variable
 * always takes precedence over other methods for locating the active token.
 *
 * @instance
 * @return {string} the path to the active application token, or undefined
 */
function getActiveApplicationTokenPath() {
  let privateKey = process.env[PRIVATE_KEY_ENV_VAR];
  if (privateKey) {
    return;
  }

  let tokenPath = process.env[TOKEN_ENV_VAR];
  if (tokenPath) {
    if (!fs.existsSync(tokenPath)) {
      throw new ApplicationTokenError(
        `No file found at '${TOKEN_ENV_VAR}=${tokenPath}'`);
    }
  } else if (fs.existsSync(TOKEN_PATH)) {
    tokenPath = TOKEN_PATH;
  }

  return tokenPath;
}

/**
 * Loads the active application token.
 *
 * The following strategy is used to locate your active application token:
 *
 * (1) Use the provided `tokenPath`
 * (2) Use the `VOXEL51_APP_PRIVATE_KEY` and `VOXEL51_APP_BASE_URL` environment
 *     variables
 * (3) Use the `VOXEL51_APP_TOKEN` environment variable
 * (4) Load the active token from `~/.voxel51/app-token.json`
 *
 * @instance
 * @param {string} [tokenPath=null] - optional path to an ApplicationToken JSON
 *   file. If no path is provided as an argument, the active token is loaded
 *   using the strategy described above
 * @return {ApplicationToken} the active application token
 * @throws {ApplicationTokenError} if no valid application token was found
 */
function loadApplicationToken(tokenPath=null) {
  if (tokenPath) {
    return loadApplicationTokenFromPath_(tokenPath);
  }

  let privateKey = process.env[PRIVATE_KEY_ENV_VAR];
  if (privateKey) {
    let baseAPIURL = process.env[BASE_API_URL_ENV_VAR];
    return ApplicationToken.fromPrivateKey(privateKey, baseAPIURL);
  }

  tokenPath = getActiveApplicationTokenPath();
  if (tokenPath) {
    return loadApplicationTokenFromPath_(tokenPath);
  }

  throw new ApplicationTokenError('No application token found');
}

function loadApplicationTokenFromPath_(tokenPath) {
  if (!fs.existsSync(tokenPath)) {
    throw new ApplicationTokenError(`No file found at '${tokenPath}'`);
  }

  try {
    return ApplicationToken.fromJSON(tokenPath);
  } catch (e) {
    throw new ApplicationTokenError(
      `File '${tokenPath}' is not a valid application token`);
  }
}

/**
 * A class encapsulating an appliation's API authentication token.
 *
 * @extends module:users/auth~Token
 */
class ApplicationToken extends auth.Token {
  /**
   * Creates a new ApplicationToken object with the given contents.
   *
   * @constructor
   * @param {object} token - an object defining an application API token
   * @retuns {ApplicationToken} an ApplicationToken instance
   */
  constructor(token) {
    super(token);
    autoBind(this);
  }

  /**
   * Returns a header dictionary for authenticating requests with this
   * application token.
   *
   * @param {string} [username=null] - an optional username for which the
   *   requests are being performed. By default, no username is included ()
   *
   * @return {object} a header object
   */
  getHeader(username=null) {
    let header = {[KEY_HEADER]: this.privateKey};
    if (username) {
      header[USER_HEADER] = username;
    }
    return header;
  }

  /**
   * Loads an ApplicationToken from JSON.
   *
   * @param {string} path - the path to a valid ApplicationToken JSON file
   * @return {ApplicationToken} a ApplicationToken instance
   */
  static fromJSON(path) {
    return new ApplicationToken(utils.readJSON(path));
  }
}

/**
 * Error raised when a problem with an `ApplicationToken` is encountered.
 *
 * @extends module:users/auth~TokenError
 */
class ApplicationTokenError extends auth.TokenError {}

exports.activateApplicationToken = activateApplicationToken;
exports.deactivateApplicationToken = deactivateApplicationToken;
exports.getActiveApplicationTokenPath = getActiveApplicationTokenPath;
exports.loadApplicationToken = loadApplicationToken;
exports.ApplicationToken = ApplicationToken;
exports.ApplicationTokenError = ApplicationTokenError;
