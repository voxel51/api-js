/**
 * Application authentication module for the Voxel51 Vision Services API.
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

const auth = require('../auth.js');
const utils = require('../utils.js');

const TOKEN_ENVIRON_VAR = 'VOXEL51_APP_TOKEN';
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
function deactivateApplicationToken(path) {
  if (fs.existsSync(TOKEN_PATH)) {
    fs.unlinkSync(TOKEN_PATH);
  }
}

/**
 * Loads the active application token.
 *
 * @instance
 * @param {string} [tokenPath=null] - an optional path to an ApplicationToken
 *   JSON file. If no path is provided, the `VOXEL51_APP_TOKEN` environment
 *   variable is checked and, if set, the token is loaded from that path.
 *   Otherwise, the token is loaded from `~/.voxel51/app-token.json`
 * @returns {ApplicationToken} an ApplicationToken instance
 * @throws {TokenLoadError} if no valid token was found
 */
function loadApplicationToken(tokenPath = null) {
  let path = tokenPath || process.env[TOKEN_ENVIRON_VAR] || TOKEN_PATH;
  if (!fs.existsSync(path)) {
    throw new auth.TokenLoadError('No application token found');
  }
  return ApplicationToken.fromJSON(path);
}

/**
 * A class encapsulating an appliation's API authentication token.
 *
 * @extends module:auth~Token
 */
class ApplicationToken extends auth.Token {

  /**
   * Creates a new ApplicationToken object with the given contents.
   *
   * @constructor
   * @param {object} token - an object defining an application API token
   * @retuns {ApplicationToken} an ApplicationToken instance
   */
  constructor(token_obj) {
    super(token_obj);
    autoBind(this);
  }

  /**
   * Returns a header dictionary for authenticating requests with this
   * application token.
   *
   * @param {string} [username=null] - an optional username for which the
   *   requests are being performed. By default, no username is included ()
   *
   * @returns {object} a header object
   */
  getHeader(username = null) {
    header = {KEY_HEADER: this.private_key_};
    if (username) {
      header[USER_HEADER] = username;
    }
    return header;
  }

  /**
   * Loads an ApplicationToken from JSON.
   *
   * @param {string} path - the path to a valid ApplicationToken JSON file
   * @returns {ApplicationToken} a ApplicationToken instance
   */
  static fromJSON(path) {
    return new ApplicationToken(utils.readJSON(path));
  }
}

exports.activateApplicationToken = activateApplicationToken;
exports.deactivateApplicationToken = deactivateApplicationToken;
exports.loadApplicationToken = loadApplicationToken;
exports.ApplicationToken = ApplicationToken;
