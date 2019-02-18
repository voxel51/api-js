/**
 * Main interface for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module api
 */

'use strict';

let fs = require('fs');

let auth = require('./auth.js');
let jobs = require('./jobs.js');
let requests = require('./requests.js');
let utils = require('./utils.js');

const BASE_URL = 'https://api.voxel51.com/v1';

/**
 * Main class for managing a session with the Voxel51 Vision Services API.
 */
class API {

  /**
   * Creates a new API instance.
   *
   * @constructor
   * @param {string} [token=null] - an optional Token to use. If no token is
   *   provided, the `VOXEL51_API_TOKEN` environment variable is checked and,
   *   if set, the token is loaded from that path. Otherwise, the token is
   *   loaded from `~/.voxel51/api-token.json`
   */
  constructor(token = null) {
    this.baseURL = BASE_URL;
    this.token = token || auth.loadToken();
    this.header_ = this.token.getHeader();
  }

  /**
   * Creates an API instance from the given Token JSON file.
   *
   * @param {string} tokenPath - the path to a Token JSON file
   * @returns {API} an API instance
   */
  static fromJSON(tokenPath) {
    let token = auth.loadToken(tokenPath);
    return new API(token);
  }

  // ANALYTICS

  /**
   * Returns a list of all available analytics.
   *
   * @async
   * @param {boolean} [allVersions=false] - whether to return all versions of
   *   each analytic or only the latest version
   * @returns {Array} an array of objects describing the analytics
   * @throws {APIError} if the request was unsuccessful
   */
  async listAnalytics(allVersions = false) {
    let uri = this.baseURL + '/analytics/list';
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
   * @returns {object} an object containing the query results and total number
   *   of records
   * @throws {APIError} if the request was unsuccessful
   */
  async queryAnalytics(analyticsQuery) {
    let uri = this.baseURL + '/analytics';
    let body = await requests.get(
      uri, this.header_, {qs: analyticsQuery.toObject()});
    return JSON.parse(body);
  }

  /**
   * Gets documentation about the analytic with the given ID.
   *
   * @async
   * @param {string} analyticId - the analytic ID
   * @returns {object} an object containing the analytic documentation
   * @throws {APIError} if the request was unsuccessful
   */
  async getAnalyticDoc(analyticId) {
    let uri = this.baseURL + '/analytics/' + analyticId;
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body);
  }

  // DATA

  /**
   * Returns a list of all uploaded data.
   *
   * @async
   * @returns {Array} an array of objects describing the data
   * @throws {APIError} if the request was unsuccessful
   */
  async listData() {
    let uri = this.baseURL + '/data/list';
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).data;
  }

  /**
   * Performs a customized data query.
   *
   * @async
   * @param {DataQuery} dataQuery A DataQuery instance defining the customized
   *   data query to perform
   * @returns {object} an object containing the query results and total number
   *   of records
   * @throws {APIError} if the request was unsuccessful
   */
  async queryData(dataQuery) {
    let uri = this.baseURL + '/data';
    let body = await requests.get(
      uri, this.header_, {qs: dataQuery.toObject()});
    return JSON.parse(body);
  }

  /**
   * Uploads the given data.
   *
   * @async
   * @param {string} path - the path to the data file
   * @param {Date|string} [ttl=undefined] - a TTL for the data. If none is
   *   provided, the default TTL is used. If a string is provided, it must be
   *   in ISO 8601 format: 'YYYY-MM-DDThh:mm:ss.sssZ'
   * @returns {object} metadata about the uploaded data
   * @throws {APIError} if the request was unsuccessful
   */
  async uploadData(path, ttl = undefined) {
    let formData = {
      file: fs.createReadStream(path),
    };
    if (ttl) {
      if (ttl instanceof Date) {
        ttl = ttl.toISOString();
      }
      formData['data_ttl'] = ttl;
    }
    let uri = this.baseURL + '/data';
    let body = await requests.post(uri, this.header_, {formData: formData});
    return JSON.parse(body).data;
  }

  /**
   * Posts data via URL.
   *
   * The data is not accessed nor uploaded at this time. Instead, the provided
   * URL and metadata are stored as a reference to the file.
   *
   * The URL must be accessible via an HTTP GET request.
   *
   * @async
   * @param {string} url - a URL (typically a signed URL) that can be accessed
   *   publicly via an HTTP GET request
   * @param {string} filename - the filename of signed url
   * @param {string} mimeType - the MIME type of the data
   * @param {number} size - the size of the data, in bytes
   * @param {string} [encoding=undefined] - the encoding of the file
   * @param {Date|string} [ttl=undefined] - a TTL for the data. If none is
   *   provided, the default TTL is used. If a string is provided, it must be
   *   in ISO 8601 format: 'YYYY-MM-DDThh:mm:ss.sssZ'
   * @returns {object} metadata about the uploaded data
   * @throws {APIError} if the request was unsuccessful
   */
  async postDataAsURL(
      url, filename, mimeType, size, encoding=undefined, ttl=undefined) {
    let uri = this.baseURL + '/data/url';
    let bodyData = {
      signed_url: url,
      filename: filename,
      mimetype: mimeType,
      size: Number.parseInt(size),
    };
    if (encoding) {
      bodyData['encoding'] = encoding;
    }
    if (ttl) {
      if (ttl instanceof Date) {
        ttl = ttl.toISOString();
      }
      bodyData['data_ttl'] = ttl;
    }

    let body = await requests.post(
      uri, this.header_, {json: true, body: bodyData});
    return JSON.parse(body).data;
  }

  /**
   * Gets details about the data with the given ID.
   *
   * @async
   * @param {string} dataId - the data ID
   * @returns {object} metadata about the data
   * @throws {APIError} if the request was unsuccessful
   */
  async getDataDetails(dataId) {
    let uri = this.baseURL + '/data/' + dataId;
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).data;
  }

  /**
   * Downloads the data with the given ID.
   *
   * @async
   * @param {string} dataId - the data ID
   * @param {string} outputPath - the output path to write to
   * @returns {void} when the download completes
   * @throws {APIError} if the request was unsuccessful
   */
  async downloadData(dataId, outputPath) {
    let stream = fs.createWriteStream(outputPath);
    stream.on('error', function(err) { throw err; });
    stream.on('end', function() { return; });
    let uri = this.baseURL + '/data/' + dataId + '/download';
    return await requests.pipe(uri, stream, this.header_);
  }

  /**
   * Gets a signed download URL for the data with the given ID.
   *
   * @async
   * @param {string} dataId - the data ID
   * @returns {string} a signed URL with read access to download the data
   * @throws {APIError} if the request was unsuccessful
   */
  async getDataDownloadURL(dataId) {
    let uri = this.baseURL + '/data/' + dataId + '/download-url';
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).url;
  }

  /**
   * Updates the expiration date of the data by the specified number of days.
   *
   * To decrease the lifespan of the data, provide a negative number. Note that
   * if the expiration date of the data after modification is in the past, the
   * data will be deleted.
   *
   * @async
   * @param {string} dataId - the data ID
   * @param {number} days - the number of days by which to extend the lifespan
   *   of the data
   * @throws {APIError} if the request was unsuccessful
   */
  async updateDataTTL(dataId, days) {
    let uri = this.baseURL + '/data/' + dataId + '/ttl';
    let formData = {'days': days.toString()};
    await requests.put(uri, this.header_, {form: formData});
  }

  /**
   * Deletes the data with the given ID.
   *
   * @async
   * @param {string} dataId - the data ID
   * @throws {APIError} if the request was unsuccessful
   */
  async deleteData(dataId) {
    let uri = this.baseURL + '/data/' + dataId;
    await requests.delete(uri, this.header_);
  }

  // JOBS

  /**
   * Returns a list of all jobs.
   *
   * @async
   * @returns {Array} an array of objects describing the jobs
   * @throws {APIError} if the request was unsuccessful
   */
  async listJobs() {
    let uri = this.baseURL + '/jobs/list';
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).jobs;
  }

  /**
   * Performs a customized jobs query.
   *
   * @async
   * @param {JobsQuery} jobsQuery A JobsQuery instance defining the customized
   *   jobs query to perform
   * @returns {object} an object containing the query results and total number
   *   of records
   * @throws {APIError} if the request was unsuccessful
   */
  async queryJobs(jobsQuery) {
    let uri = this.baseURL + '/jobs';
    let body = await requests.get(
      uri, this.header_, {qs: jobsQuery.toObject()});
    return JSON.parse(body);
  }

  /**
   * Uploads a job request.
   *
   * @async
   * @param {JobRequest} jobRequest - a JobRequest instance describing the job
   * @param {string} jobName - a name for the job
   * @param {boolean} [autoStart=false] - whether to automatically start the
   *   job upon creation
   * @param {boolean} [useGPU=false] - whether to use GPU resources when
   *   running the job
   * @param {Date|string} [ttl=undefined] - a TTL for the job output. If
   *   none is provided, the default TTL is used. If a string is provided, it
   *   must be in ISO 8601 format: 'YYYY-MM-DDThh:mm:ss.sssZ'
   * @returns {object} metadata about the job
   * @throws {APIError} if the request was unsuccessful
   *
   * @todo allow jobJSONPath to accept a job JSON object directly
   */
  async uploadJobRequest(
      jobRequest, jobName, autoStart = false, useGPU = false,
      ttl = undefined) {
    let uri = this.baseURL + '/jobs';
    let formData = {
      'file': {
        value: jobRequest.toString(),
        options: {
          filename: 'job.json',
          contentType: 'application/json'
        }
      },
      'job_name': jobName,
      'auto_start': autoStart.toString(),
      'use_gpu': useGPU.toString(),
    };
    if (ttl) {
      if (ttl instanceof Date) {
        ttl = ttl.toISOString()
      }
      formData['job_ttl'] = ttl
    }
    let body = await requests.post(uri, this.header_, {formData: formData});
    return JSON.parse(body).job;
  }

  /**
   * Gets details about the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @returns {object} metadata about the job
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobDetails(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId;
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).job;
  }

  /**
   * Gets the job request for the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @returns {JobRequest} the JobRequest instance describing the job
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobRequest(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId + '/request';
    let body = await requests.get(uri, this.header_);
    return jobs.JobRequest.fromString(body);
  }

  /**
   * Starts the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @throws {APIError} if the request was unsuccessful
   */
  async startJob(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId + '/start';
    await requests.put(uri, this.header_);
  }

  /**
   * Updates the expiration date of the job by the specified number of days.
   *
   * To decrease the lifespan of the job, provide a negative number. Note that
   * if the expiration date of the job after modification is in the past, the
   * job will be deleted.
   *
   * @async
   * @param {string} jobId - the job ID
   * @param {number} days - the number of days by which to extend the lifespan
   *   of the job
   * @throws {APIError} if the request was unsuccessful
   */
  async updateJobTTL(jobId, days) {
    let uri = this.baseURL + '/jobs/' + jobId + '/ttl';
    let formData = {'days': days.toString()};
    await requests.put(uri, this.header_, {form: formData});
  }

  /**
   * Archives the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @throws {APIError} if the request was unsuccessful
   */
  async archiveJob(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId + '/archive';
    await requests.put(uri, this.header_);
  }

  /**
   * Unarchives the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @throws {APIError} if the request was unsuccessful
   */
  async unarchiveJob(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId + '/unarchive';
    await requests.put(uri, this.header_);
  }

  /**
   * Gets the state of the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @returns {string} the state of the job, which is a value in the JobState
   *   enum
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobState(jobId) {
    let jobDetails = await this.getJobDetails(jobId);
    return jobDetails.state;
  }

  /**
   * Determines whether the job with the given ID is complete.
   *
   * @async
   * @param {string} jobId - the job ID
   * @returns {boolean} true if the job is complete, and false otherwise
   * @throws {JobExecutionError} if the job failed
   * @throws {APIError} if the underlying API request was unsuccessful
   */
  async isJobComplete(jobId) {
    let jobState = await this.getJobState(jobId);
    if (jobState == jobs.JobState.FAILED) {
      throw new jobs.JobExecutionError('Job ' + jobId + ' failed');
    }
    return (jobState == jobs.JobState.COMPLETE);
  }

  /**
   * Waits until the job with the given ID is complete.
   *
   * @async
   * @param {string} jobId - the job ID
   * @param {number} [sleepTime=5] - the number of seconds to wait between job
   *   state checks
   * @param {number} [maxWaitTime=600] - the maximum number of seconds to wait
   *   for the job to complete
   * @returns {Promise} a Promise that resolves when the job is complete
   * @throws {JobExecutionError} if the job failed
   * @throws {APITimeoutError} if the maximum wait time was exceeded
   * @throws {APIError} if an underlying API request was unsuccessful
   */
  async waitUntilJobCompletes(jobId, sleepTime = 5, maxWaitTime = 600) {
    let boundIsJobComplete = this.isJobComplete.bind(this);
    return utils.waitForCondition(
      boundIsJobComplete, [jobId], 1000 * sleepTime, 1000 * maxWaitTime);
  }

  /**
   * Gets the status of the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @returns {object} an object describing the status of the job
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobStatus(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId + '/status';
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body);
  }

  /**
   * Downloads the output of the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @param {string} [outputPath='output.zip'] - the output path to write to
   * @returns {void} when the download completes
   * @throws {APIError} if the request was unsuccessful
   */
  async downloadJobOutput(jobId, outputPath = 'output.zip') {
    let stream = fs.createWriteStream(outputPath);
    stream.on('error', function(error) { throw error; });
    stream.on('end', function() { return; });
    let uri = this.baseURL + '/jobs/' + jobId + '/output';
    return await requests.pipe(uri, stream, this.header_);
  }

  /**
   * Gets a signed download URL for the output of the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @returns {string} a signed URL with read access to download the job output
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobOutputDownloadURL(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId + '/output-url';
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).url;
  }

  /**
   * Deletes the job with the given ID, which must not have been started.
   *
   * @async
   * @param {string} jobId - the job ID
   * @throws {APIError} if the request was unsuccessful
   */
  async deleteJob(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId;
    await requests.delete(uri, this.header_);
  }

  // STATEMENTS

  /**
   * Returns a list of all statements.
   *
   * @async
   * @returns {Array} an array of objects describing the statements
   * @throws {APIError} if the request was unsuccessful
   */
  async listStatements() {
    let uri = this.baseURL + '/statements/list';
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).statements;
  }

  /**
   * Gets details about the statement with the given ID.
   *
   * @async
   * @param {string} statementId - the statement ID
   * @returns {object} metadata about the statement
   * @throws {APIError} if the request was unsuccessful
   */
  async getStatementDetails(statementId) {
    let uri = this.baseURL + '/statements/' + statementId;
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).statement;
  }
}

module.exports = API;
