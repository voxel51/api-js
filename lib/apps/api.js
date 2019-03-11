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

let API = require('../api.js');
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
class ApplicationAPI extends API {
  /**
   * Creates a new ApplicationAPI instance.
   *
   * @constructor
   * @param {string} [token=null] - an optional ApplicationToken to use. If no
   *   token is provided, the `VOXEL51_APP_TOKEN` environment variable is
   *   checked and, if set, the token is loaded from that path. Otherwise, the
   *   token is loaded from `~/.voxel51/app-token.json`
   */
  constructor(token = null) {
    token = token || auth.loadToken();
    super(token);
    this.activeUser = null;
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
   * Uploads the analytic documentation JSON file that describes a new private
   * analytic to deploy.
   *
   * @async
   * @param {String} docJSONPath - the path to the analytic JSON
   * @param {Boolean} supportsCPU - does analytic support CPU computation
   * @param {Boolean} supportsGPU - does analytic support GPU computation
   * @returns {object} an object containing metadata about the posted analytic
   * @throws {APIError} if the request was unsuccessful
   */
  async uploadAnalytic(docJSONPath, supportsCPU, supportsGPU) {
    let formData = {
      file: fs.createReadStream(docJSONPath),
      supports_cpu: supportsCPU,
      supports_gpu: supportsGPU,
    };
    let uri = this.baseURL + '/apps/analytics';
    let body = await requests.post(uri, this.header_, {formData: formData});
    return JSON.parse(body).analytic;
  }

  /**
   * Uploads the Docker image for a private analytic.
   *
   * The Docker image must be uploaded as a `.tar`, `.tar.gz`, or `.tar.bz`.
   *
   * @async
   * @param {String} analyticId - the analytic ID
   * @param {String} imageTarPath - the path to the image tarfile
   * @param {String} imageType - the image computation type, 'cpu' or 'gpu'
   * @throws {APIError} if the request was unsuccessful
   */
  async uploadAnalyticImage(analyticId, imageTarPath, imageType) {
    let formData = {
      file: fs.createReadStream(imageTarPath),
    };
    let params = {type: imageType.toLowerCase()};
    let uri = this.baseURL + '/apps/analytics/' + analyticId + '/images';
    await requests.post(uri, this.header_, {formData; formData, qs: params});
  }

  /**
   * Deletes the (private) analytic with the given ID.
   *
   * @async
   * @param {string} analyticId - the analytic ID
   * @throws {APIError} if the request was unsuccessful
   */
  async deleteAnalytic(analyticId) {
    let uri = this.baseURL + '/apps/analytics/' + analyticId;
    await requests.delete(uri, this.header_);
  }
}

module.exports = ApplicationAPI;
