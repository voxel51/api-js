/**
 * Applications interface for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2019, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module apps/api
 */

'use strict';

let fs = require('fs');

let api = require('../api.js');
let auth = require('./auth.js');
let utils = require('../utils.js');

/**
 * Main class for managing an application session with the Voxel51 Vision
 * Services API.
 *
 * Note that ApplicationAPI is a subclass of API, which implies that, unless
 * specifically overridden, applications can access all methods exposed for
 * regular platform users. In order to use these user-specific methods,
 * however, you must first activate a user via ApplicationAPI.with_user.
 *
 * @extends module:api~API
 */
class ApplicationAPI extends api.API {
  /**
   * Creates a new ApplicationAPI instance.
   *
   * @constructor
   * @param {string} [token=null] - an optional ApplicationToken to use. If no
   *   token is provided, the `VOXEL51_API_TOKEN` environment variable is
   *   checked and, if set, the token is loaded from that path. Otherwise, the
   *   token is loaded from `~/.voxel51/app-token.json`
   */
  constructor(token = null) {
    this.baseURL = BASE_URL;
    this.token = token || auth.loadToken();
    this.activeUser = null;
    this.header_ = this.token.getHeader();
  }

  /**
   * Activates the given user. When finished performing actions for the user,
   * call exitUser().
   *
   * @async
   * @param {string} username - the name of a user
   */
  withUser(username) {
    this.activeUser = username;
    this.header_ = this.token.getHeader(username);
  }

  /**
   * Exits active user mode, if necessary.
   *
   * @async
   * @param {string} username - the name of a user
   */
  exitUser(username) {
    this.activeUser = null;
    this.header_ = this.token.getHeader();
  }

  /**
   * Creates an ApplicationAPI instance from the given ApplicationToken JSON
   * file.
   *
   * @param {string} tokenPath - the path to an ApplicationToken JSON file
   * @returns {ApplicationAPI} an ApplicationAPI instance
   */
  static fromJSON(tokenPath) {
    let token = auth.loadToken(tokenPath);
    return new ApplicationAPI(token);
  }

  // USERS

  /**
   * Creates a new application user with the given username.
   *
   * @async
   * @param {string} username - a username for the new user
   * @throws {APIError} if the request was unsuccessful
   */
  async createUser(username) {
    let uri = this.baseURL + '/apps/users';
    await requests.post(uri, this.header_, {json: true, body: {username}});
  }

  /**
   * Returns a list of all application users.
   *
   * @async
   * @returns {Array} an array of usernames of the application users
   * @throws {APIError} if the request was unsuccessful
   */
  async listUsers() {
    let uri = this.baseURL + '/apps/users/list';
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).users;
  }

  /**
   * Updates the usage limits for the given user to the given values.
   *
   * @async
   * @param {string} username - the name of the user to modify
   * @param {object} limits - key-value pairs specifying the limit names and
   *   corresponding values to set
   * @throws {APIError} if the request was unsuccessful
   */
  async updateUserUsageLimits(username, limits) {
    let uri = this.baseURL + '/apps/users/${username}/limits';
    await requests.post(uri, this.header_, {json: true, body: limits});
  }

  // STATEMENTS

  /**
   * Not yet implemented for applications.
   */
  async listStatements() {
    throw new utils.NotImplementedError(
      'listStatements() is not yet implemented for applications');
  }

  /**
   * Not yet implemented for applications.
   */
  async getStatementDetails() {
    throw new utils.NotImplementedError(
      'getStatementDetails() is not yet implemented for applications');
  }
}

module.exports = ApplicationAPI;
