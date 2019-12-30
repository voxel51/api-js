/**
 * Applications interface for the Voxel51 Platform API.
 *
 * Copyright 2017-2019, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module apps/api
 */

'use strict';

const autoBind = require('auto-bind');
const fs = require('fs');
const urljoin = require('url-join');

const api = require('../users/api.js');
const auth = require('./auth.js');
const requests = require('../users/requests.js');

/**
 * Main class for managing an application session with the Voxel51 Platform
 * API.
 *
 * Note that ApplicationAPI is a subclass of API, which implies that, unless
 * specifically overridden, applications can access all methods exposed for
 * regular platform users. In order to use these user-specific methods,
 * however, you must first activate a user via ApplicationAPI.with_user.
 *
 * @extends module:users/api~API
 */
class ApplicationAPI extends api.API {
  /**
   * Creates a new ApplicationAPI instance.
   *
   * @constructor
   * @param {string} [token=null] - an optional ApplicationToken to use. If no
   *   token is provided, the `VOXEL51_APP_TOKEN` environment variable is
   *   checked and, if set, the token is loaded from that path. Otherwise, the
   *   token is loaded from `~/.voxel51/app-token.json`
   */
  constructor(token=null) {
    token = token || auth.loadApplicationToken();
    super(token);
    this.activeUser = null;
    autoBind(this);
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
   * @return {ApplicationAPI} an ApplicationAPI instance
   */
  static fromJSON(tokenPath) {
    let token = auth.loadApplicationToken(tokenPath);
    return new ApplicationAPI(token);
  }

  //
  // ANALYTICS
  //
  // Note that all analytic methods override the inherited methods from API,
  // because analytic listing has different behavior for applications than it
  // does for individual platform users.
  //

  /**
   * Returns a list of all available analytics.
   *
   * By default, only the latest version of each analytic is returned.
   * Pending analytics are always excluded from this list.
   *
   * @async
   * @param {boolean} [allVersions=false] - whether to return all versions of
   *   each analytic or only the latest version
   * @return {Array} an array of objects describing the analytics
   * @throws {APIError} if the request was unsuccessful
   */
  async listAnalytics(allVersions=false) {
    let uri = urljoin(this.baseURL, 'apps', 'analytics', 'list');
    let params = {all_versions: allVersions};
    let body = await requests.get(uri, this.header_, {qs: params});
    return JSON.parse(body).analytics;
  }

  /**
   * Performs a customized analytics query.
   *
   * @async
   * @param {AnalyticsQuery} analyticsQuery An AnalyticsQuery instance defining
   *   the customized analytics query to perform
   * @return {object} an object containing the query results and total number
   *   of records
   * @throws {APIError} if the request was unsuccessful
   */
  async queryAnalytics(analyticsQuery) {
    let uri = urljoin(this.baseURL, 'apps', 'analytics');
    let body = await requests.get(
      uri, this.header_, {qs: analyticsQuery.toObject()});
    return JSON.parse(body);
  }

  /**
   * Gets details about the analytic with the given ID.
   *
   * @async
   * @param {string} analyticId - the analytic ID
   * @return {object} metadata about the analytic
   * @throws {APIError} if the request was unsuccessful
   */
  async getAnalyticDetails(analyticId) {
    let uri = urljoin(this.baseURL, 'apps', 'analytics', analyticId);
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).analytic;
  }

  /**
   * Gets documentation about the analytic with the given ID.
   *
   * @async
   * @param {string} analyticId - the analytic ID
   * @return {object} an object containing the analytic documentation
   * @throws {APIError} if the request was unsuccessful
   */
  async getAnalyticDoc(analyticId) {
    let uri = urljoin(this.baseURL, 'apps', 'analytics', analyticId, 'doc');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body);
  }

  /**
   * Uploads the analytic documentation JSON file that describes a new
   * analytic to deploy.
   *
   * See {@link https://voxel51.com/docs/applications/#analytics-upload-analytic this page}
   * for a description of the JSON format to use.
   *
   * @async
   * @param {string} docJSONPath - the path to the analytic JSON
   * @param {AnalyticType} [analyticType=undefined] - the type of analytic that
   *  you are uploading. If not specified, it is assumed that you are uploading
   *  a standard platform analytic
   * @return {object} an object containing metadata about the posted analytic
   * @throws {APIError} if the request was unsuccessful
   */
  async uploadAnalytic(docJSONPath, analyticType=undefined) {
    let uri = urljoin(this.baseURL, 'apps', 'analytics');
    let formData = {
      file: fs.createReadStream(docJSONPath),
    };
    if (analyticType) {
      formData['analytic_type'] = analyticType.toString();
    }
    let body = await requests.post(uri, this.header_, {formData: formData});
    return JSON.parse(body).analytic;
  }

  /**
   * Uploads the Docker image for a analytic.
   *
   * The Docker image must be uploaded as a `.tar`, `.tar.gz`, or `.tar.bz`.
   *
   * See {@link https://voxel51.com/docs/applications/#analytics-upload-docker-image this page}
   * for more information about building and deploying Docker images to the
   * platform.
   *
   * @async
   * @param {string} analyticId - the analytic ID
   * @param {string} imageTarPath - the path to the image tarfile
   * @param {string} imageType - the image computation type, 'cpu' or 'gpu'
   * @throws {APIError} if the request was unsuccessful
   */
  async uploadAnalyticImage(analyticId, imageTarPath, imageType) {
    let uri = urljoin(this.baseURL, 'apps', 'analytics', analyticId, 'images');
    let formData = {
      file: fs.createReadStream(imageTarPath),
    };
    let params = {type: imageType.toLowerCase()};
    await requests.post(uri, this.header_, {formData: formData, qs: params});
  }

  /**
   * Deletes the analytic with the given ID. Only analytics that your
   * application owns can be deleted.
   *
   * @async
   * @param {string} analyticId - the analytic ID
   * @throws {APIError} if the request was unsuccessful
   */
  async deleteAnalytic(analyticId) {
    let uri = urljoin(this.baseURL, 'apps', 'analytics', analyticId);
    await requests.delete(uri, this.header_);
  }

  // DATA

  /**
   * Performs a customized data query at the application level.
   * Queries using this route returns results for all users of the
   * application.
   *
   * @async
   * @param {DataQuery} dataQuery A DataQuery instance defining the customized
   *   data query to perform
   * @return {object} an object containing the query results and total number
   *   of records
   * @throws {APIError} if the request was unsuccessful
   */
  async queryApplicationData(dataQuery) {
    let uri = urljoin(this.baseURL, 'apps', 'data');
    let body = await requests.get(
      uri, this.header_, {qs: dataQuery.toObject()});
    return JSON.parse(body);
  }

  // JOBS

  /**
   * Performs a customized jobs query at the application level.
   * Queries using this route returns results for all users of the
   * application.
   *
   * @async
   * @param {JobsQuery} jobsQuery A JobsQuery instance defining the customized
   *   jobs query to perform
   * @return {object} an object containing the query results and total number
   *   of records
   * @throws {APIError} if the request was unsuccessful
   */
  async queryApplicationJobs(jobsQuery) {
    let uri = urljoin(this.baseURL, 'apps', 'jobs');
    let body = await requests.get(
      uri, this.header_, {qs: jobsQuery.toObject()});
    return JSON.parse(body);
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
    let uri = urljoin(this.baseURL, 'apps', 'users');
    await requests.post(uri, this.header_, {json: true, body: {username}});
  }

  /**
   * Returns a list of all application users.
   *
   * @async
   * @return {Array} an array of usernames of the application users
   * @throws {APIError} if the request was unsuccessful
   */
  async listUsers() {
    let uri = urljoin(this.baseURL, 'apps', 'users', 'list');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).users;
  }

  // STATUS

  /**
   * Gets the current status of the platform.
   *
   * @return {Object} an object describing the status of the platform
   */
  async getPlatformStatus() {
    let uri = urljoin(this.baseURL, 'apps', 'status', 'all');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).statuses;
  }
}

exports.ApplicationAPI = ApplicationAPI;
