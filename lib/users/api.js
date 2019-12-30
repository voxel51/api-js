/**
 * Main interface for the Voxel51 Platform API.
 *
 * Copyright 2017-2019, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module users/api
 */

'use strict';

const autoBind = require('auto-bind');
const fs = require('fs');
const urljoin = require('url-join');

const auth = require('./auth.js');
const jobs = require('./jobs.js');
const requests = require('./requests.js');
const utils = require('./utils.js');

/**
 * Enum describing the possible types of analytics.
 *
 * @enum {string}
 */
const AnalyticType = {
  PLATFORM: 'PLATFORM',
  IMAGE_TO_VIDEO: 'IMAGE_TO_VIDEO',
};

/**
 * Main class for managing a session with the Voxel51 Platform API.
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
  constructor(token=null) {
    if (!token) {
      token = auth.loadToken();
    }
    this.baseURL = urljoin(token.baseAPIURL, 'v1');
    this.token = token;
    this.header_ = token.getHeader();
    autoBind(this);
  }

  /**
   * Creates an API instance from the given Token JSON file.
   *
   * @param {string} tokenPath - the path to a Token JSON file
   * @return {API} an API instance
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
   * @return {Array} an array of objects describing the analytics
   * @throws {APIError} if the request was unsuccessful
   */
  async listAnalytics(allVersions=false) {
    let uri = urljoin(this.baseURL, 'analytics', 'list');
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
    let uri = urljoin(this.baseURL, 'analytics');
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
    let uri = urljoin(this.baseURL, 'analytics', analyticId);
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
    let uri = urljoin(this.baseURL, 'analytics', analyticId, 'doc');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body);
  }

  /**
   * Uploads the analytic documentation JSON file that describes a new
   * analytic to deploy.
   *
   * See {@link https://voxel51.com/docs/api/#analytics-upload-analytic this page}
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
    let uri = urljoin(this.baseURL, 'analytics');
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
   * Uploads the Docker image for an analytic.
   *
   * The Docker image must be uploaded as a `.tar`, `.tar.gz`, or `.tar.bz`.
   *
   * See {@link https://voxel51.com/docs/api/#analytics-upload-docker-image this page}
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
    let uri = urljoin(this.baseURL, 'analytics', analyticId, 'images');
    let formData = {
      file: fs.createReadStream(imageTarPath),
    };
    let params = {type: imageType.toLowerCase()};
    await requests.post(uri, this.header_, {formData: formData, qs: params});
  }

  /**
   * Deletes the analytic with the given ID. Only analytics that you own can be
   * deleted.
   *
   * @async
   * @param {string} analyticId - the analytic ID
   * @throws {APIError} if the request was unsuccessful
   */
  async deleteAnalytic(analyticId) {
    let uri = urljoin(this.baseURL, 'analytics', analyticId);
    await requests.delete(uri, this.header_);
  }

  // DATA

  /**
   * Returns a list of all uploaded data.
   *
   * @async
   * @return {Array} an array of objects describing the data
   * @throws {APIError} if the request was unsuccessful
   */
  async listData() {
    let uri = urljoin(this.baseURL, 'data', 'list');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).data;
  }

  /**
   * Performs a customized data query.
   *
   * @async
   * @param {DataQuery} dataQuery A DataQuery instance defining the customized
   *   data query to perform
   * @return {object} an object containing the query results and total number
   *   of records
   * @throws {APIError} if the request was unsuccessful
   */
  async queryData(dataQuery) {
    let uri = urljoin(this.baseURL, 'data');
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
   *   in ISO 8601 format, e.g., 'YYYY-MM-DDThh:mm:ss.sssZ'. If a non-UTC
   *   timezone is included in the Date or string, it will be respected
   * @return {object} metadata about the uploaded data
   * @throws {APIError} if the request was unsuccessful
   */
  async uploadData(path, ttl=undefined) {
    let formData = {
      file: fs.createReadStream(path),
    };
    if (ttl) {
      formData['data_ttl'] = parseDate_(ttl);
    }
    let uri = urljoin(this.baseURL, 'data');
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
   * @param {Date|string} [ttl=undefined] - a TTL for the data. If none is
   *   provided, the default TTL is used. If a string is provided, it must be
   *   in ISO 8601 format, e.g., 'YYYY-MM-DDThh:mm:ss.sssZ'. If a non-UTC
   *   timezone is included in the Date or string, it will be respected
   * @param {string} [encoding=undefined] - the encoding of the file
   * @return {object} metadata about the uploaded data
   * @throws {APIError} if the request was unsuccessful
   */
  async postDataAsURL(
    url, filename, mimeType, size, ttl, encoding=undefined) {
    let uri = urljoin(this.baseURL, 'data', 'url');
    let bodyData = {
      signed_url: url,
      filename: filename,
      mimetype: mimeType,
      size: Number.parseInt(size),
      data_ttl: parseDate_(ttl),
    };
    if (encoding) {
      bodyData['encoding'] = encoding;
    }

    let body = await requests.post(
      uri, this.header_, {json: true, body: bodyData});
    // the {json: true} option appears to auto-parse the response body
    // so no manual parsing is necessary here!
    return body.data;
  }

  /**
   * Gets details about the data with the given ID.
   *
   * @async
   * @param {string} dataId - the data ID
   * @return {object} metadata about the data
   * @throws {APIError} if the request was unsuccessful
   */
  async getDataDetails(dataId) {
    let uri = urljoin(this.baseURL, 'data', dataId);
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).data;
  }

  /**
   * Downloads the data with the given ID.
   *
   * @async
   * @param {string} dataId - the data ID
   * @param {string} [outputPath=undefined] - the output path to write to. By
   *   default, the data is written to the current working directory with the
   *   same filename as the uploaded data
   * @return {string} the path to the downloaded data
   * @throws {APIError} if the request was unsuccessful
   */
  async downloadData(dataId, outputPath=undefined) {
    if (!outputPath) {
      let data = await this.getDataDetails(dataId);
      outputPath = data.name;
    }
    let stream = fs.createWriteStream(outputPath);
    stream.on('error', function(err) {
      throw err;
    });
    stream.on('end', function() {
      return;
    });
    let uri = urljoin(this.baseURL, 'data', dataId, 'download');
    await requests.pipe(uri, stream, this.header_);
    return outputPath;
  }

  /**
   * Gets a signed download URL for the data with the given ID.
   *
   * @async
   * @param {string} dataId - the data ID
   * @return {string} a signed URL with read access to download the data
   * @throws {APIError} if the request was unsuccessful
   */
  async getDataDownloadURL(dataId) {
    let uri = urljoin(this.baseURL, 'data', dataId, 'download-url');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).url;
  }

  /**
   * Updates the expiration date of the data.
   *
   * Note that if the expiration date of the data after modification is in the
   * past, the data will be deleted.
   *
   * Exactly one named parameter must be provided.
   *
   * @async
   * @param {string} dataId - the data ID
   * @param {number} days - the number of days by which to extend the lifespan
   *   of the data. To decrease the lifespan of the data, provide a negative
   *   number
   * @param {Date|string} [expirationDate=undefined] - a new TTL for the data.
   *   If a string is provided, it must be in ISO 8601 format, e.g.,
   *   'YYYY-MM-DDThh:mm:ss.sssZ'. If a non-UTC timezone is included in the
   *   Date or string, it will be respected
   * @throws {APIError} if the request was unsuccessful
   */
  async updateDataTTL(dataId, days=undefined, expirationDate=undefined) {
    let uri = urljoin(this.baseURL, 'data', dataId, 'ttl');
    let formData = {};
    if (days) {
      formData.days = days.toString();
    }
    if (expirationDate) {
      formData.expiration_date = parseDate_(expirationDate);
    }
    if (Object.keys(formData).length != 1) {
      throw new APIError(
        'Either `days` or `expirationDate` must be provided', 400);
    }
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
    let uri = urljoin(this.baseURL, 'data', dataId);
    await requests.delete(uri, this.header_);
  }

  /**
   * Updates the expiration date of the data with the given IDs.
   *
   * Note that if the expiration date of the data after modification is in the
   * past, the data will be deleted.
   *
   * Exactly one named parameter must be provided.
   *
   * @async
   * @param {Array} dataIds - the data IDs
   * @param {number} days - the number of days by which to extend the lifespan
   *   of the data. To decrease the lifespan of the data, provide a negative
   *   number
   * @param {Date|string} [expirationDate=undefined] - a new TTL for the data.
   *   If a string is provided, it must be in ISO 8601 format, e.g.,
   *   'YYYY-MM-DDThh:mm:ss.sssZ'. If a non-UTC timezone is included in the
   *   Date or string, it will be respected
   * @return {Object} an object mapping data IDs to objects indicating whether
   *   the data was successfully processed. The `status` field will be set to
   *   `true` on success or `false` on failure
   * @throws {APIError} if the request was unsuccessful
   */
  async batchUpdateDataTTL(dataIds, days=undefined, expirationDate=undefined) {
    let formData = {};
    if (days) {
      formData.days = days.toString();
    }
    if (expirationDate) {
      formData.expiration_date = parseDate_(expirationDate);
    }
    if (Object.keys(formData).length != 1) {
      throw new APIError(
        'Either `days` or `expirationDate` must be provided', 400);
    }
    return await this.batchRequest_('data', 'ttl', dataIds, formData);
  }

  /**
   * Deletes the data with the given IDs.
   *
   * @async
   * @param {Array} dataIds - the data IDs
   * @return {Object} an object mapping data IDs to objects indicating whether
   *   the data was successfully processed. The `status` field will be set to
   *   `true` on success or `false` on failure
   * @throws {APIError} if the request was unsuccessful
   */
  async batchDeleteData(dataIds) {
    return await this.batchRequest_('data', 'delete', dataIds);
  }

  // JOBS

  /**
   * Returns a list of all jobs.
   *
   * @async
   * @return {Array} an array of objects describing the jobs
   * @throws {APIError} if the request was unsuccessful
   */
  async listJobs() {
    let uri = urljoin(this.baseURL, 'jobs', 'list');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).jobs;
  }

  /**
   * Performs a customized jobs query.
   *
   * @async
   * @param {JobsQuery} jobsQuery A JobsQuery instance defining the customized
   *   jobs query to perform
   * @return {object} an object containing the query results and total number
   *   of records
   * @throws {APIError} if the request was unsuccessful
   */
  async queryJobs(jobsQuery) {
    let uri = urljoin(this.baseURL, 'jobs');
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
   * @param {Date|string} [ttl=undefined] - a TTL for the job output. If none
   *   is provided, the default TTL is used. If a string is provided, it must
   *   be in ISO 8601 format, e.g., 'YYYY-MM-DDThh:mm:ss.sssZ'. If a non-UTC
   *   timezone is included in the Date or string, it will be respected
   * @return {object} metadata about the job
   * @throws {APIError} if the request was unsuccessful
   *
   * @todo allow jobJSONPath to accept a job JSON object directly
   */
  async uploadJobRequest(jobRequest, jobName, autoStart=false, ttl=undefined) {
    let uri = urljoin(this.baseURL, 'jobs');
    let formData = {
      'file': {
        value: jobRequest.toString(),
        options: {
          filename: 'job.json',
          contentType: 'application/json',
        },
      },
      'job_name': jobName,
      'auto_start': autoStart.toString(),
    };
    if (ttl) {
      formData['job_ttl'] = parseDate_(ttl);
    }
    let body = await requests.post(uri, this.header_, {formData: formData});
    return JSON.parse(body).job;
  }

  /**
   * Gets details about the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @return {object} metadata about the job
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobDetails(jobId) {
    let uri = urljoin(this.baseURL, 'jobs', jobId);
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).job;
  }

  /**
   * Gets the job request for the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @return {JobRequest} the JobRequest instance describing the job
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobRequest(jobId) {
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'request');
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
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'start');
    await requests.put(uri, this.header_);
  }

  /**
   * Updates the expiration date of the job.
   *
   * Note that if the expiration date of the job after modification is in the
   * past, the job output will be deleted.
   *
   * Exactly one named parameter must be provided.
   *
   * @async
   * @param {string} jobId - the job ID
   * @param {number} days - the number of days by which to extend the lifespan
   *   of the job. To decrease the lifespan of the job, provide a negative
   *   number
   * @param {Date|string} [expirationDate=undefined] - a new TTL for the job.
   *   If a string is provided, it must be in ISO 8601 format, e.g.,
   *   'YYYY-MM-DDThh:mm:ss.sssZ'. If a non-UTC timezone is included in the
   *   Date or string, it will be respected
   * @throws {APIError} if the request was unsuccessful
   */
  async updateJobTTL(jobId, days=undefined, expirationDate=undefined) {
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'ttl');
    let formData = {};
    if (days) {
      formData.days = days.toString();
    }
    if (expirationDate) {
      formData.expiration_date = parseDate_(expirationDate);
    }
    if (Object.keys(formData).length != 1) {
      throw new APIError(
        'Either `days` or `expirationDate` must be provided', 400);
    }
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
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'archive');
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
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'unarchive');
    await requests.put(uri, this.header_);
  }

  /**
   * Gets the state of the job with the given ID.
   *
   * Exactly one named parameter should be provided.
   *
   * @async
   * @param {string} [jobId=undefined] - the job ID
   * @param {object} [job=undefined] - the metadata object for the job, as
   *   returned by `getJobDetails()` or `queryJobs()`
   * @return {string} the state of the job, which is a value in the `JobState`
   *   enum
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobState(jobId=undefined, job=undefined) {
    let state;
    if (jobId) {
      let jobDetails = await this.getJobDetails(jobId);
      state = jobDetails.state;
    } else if (job) {
      state = job.state;
    } else {
      throw new APIError('Either `jobId` or `job` must be provided', 400);
    }
    return state;
  }

  /**
   * Determines whether the job with the given ID is complete.
   *
   * Exactly one named parameter should be provided.
   *
   * @async
   * @param {string} [jobId=undefined] - the job ID
   * @param {object} [job=undefined] - the metadata object for the job, as
   *   returned by `getJobDetails()` or `queryJobs()`
   * @return {boolean} true if the job is complete, and false otherwise
   * @throws {JobExecutionError} if the job failed
   * @throws {APIError} if the underlying API request was unsuccessful
   */
  async isJobComplete(jobId=undefined, job=undefined) {
    let jobState = await this.getJobState(jobId, job);
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
   * @throws {JobExecutionError} if the job failed
   * @throws {APITimeoutError} if the maximum wait time was exceeded
   * @throws {APIError} if an underlying API request was unsuccessful
   */
  async waitUntilJobCompletes(jobId, sleepTime=5, maxWaitTime=600) {
    let boundIsJobComplete = this.isJobComplete.bind(this);
    await utils.waitForCondition(
      boundIsJobComplete, [jobId], 1000 * sleepTime, 1000 * maxWaitTime);
  }

  /**
   * Determines whether the job is expired.
   *
   * Exactly one named parameter should be provided.
   *
   * @async
   * @param {string} [jobId=undefined] - the job ID
   * @param {object} [job=undefined] - the metadata object for the job, as
   *   returned by `getJobDetails()` or `queryJobs()`
   * @return {boolean} true if the job is expired, and false otherwise
   * @throws {APIError} if the request was unsuccessful
   */
  async isJobExpired(jobId=undefined, job=undefined) {
    let expirationDate;
    if (jobId) {
      let jobDetails = await this.getJobDetails(jobId);
      expirationDate = jobDetails.expiration_date;
    } else if (job) {
      expirationDate = job.expiration_date;
    } else {
      throw new APIError('Either `jobId` or `job` must be provided', 400);
    }

    let expiration = Date.parse(expirationDate);
    let now = Date.now();
    return now >= expiration;
  }

  /**
   * Gets the status of the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @return {object} an object describing the status of the job
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobStatus(jobId) {
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'status');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body);
  }

  /**
   * Downloads the output of the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @param {string} [outputPath=undefined] - the output path to write to. By
   *   default, the file is written to the current working directory with the
   *   recommended output filename for the job
   * @return {string} the path to the downloaded job output
   * @throws {APIError} if the request was unsuccessful
   */
  async downloadJobOutput(jobId, outputPath=undefined) {
    if (!outputPath) {
      let job = await this.getJobDetails(jobId);
      outputPath = job.output_filename;
    }
    let stream = fs.createWriteStream(outputPath);
    stream.on('error', function(error) {
      throw error;
    });
    stream.on('end', function() {
      return;
    });
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'output');
    await requests.pipe(uri, stream, this.header_);
    return outputPath;
  }

  /**
   * Gets a signed download URL for the output of the job with the given ID.
   *
   * @async
   * @param {string} jobId - the job ID
   * @return {string} a signed URL with read access to download the job output
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobOutputDownloadURL(jobId) {
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'output-url');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).url;
  }

  /**
   * Downloads the logfile for the job with the given ID.
   *
   * Note that logfiles can only be downloaded for jobs that run private
   * analytics.
   *
   * @async
   * @param {string} jobId - the job ID
   * @param {string} [outputPath=undefined] - the path to write the logfile. By
   *   default, the logfile is written to the current working directory with
   *   the filename '${jobId}.log'
   * @throws {APIError} if the request was unsuccessful
   */
  async downloadJobLogfile(jobId, outputPath=undefined) {
    if (!outputPath) {
      outputPath = jobId + '.log';
    }
    let stream = fs.createWriteStream(outputPath);
    stream.on('error', function(error) {
      throw error;
    });
    stream.on('end', function() {
      return;
    });
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'log');
    await requests.pipe(uri, stream, this.header_);
  }

  /**
   * Gets a signed download URL for the logfile of the job with the given ID.
   *
   * Note that logfiles can only be downloaded for jobs that run private
   * analytics.
   *
   * @async
   * @param {string} jobId - the job ID
   * @return {string} a signed URL with read access to download the job
   *   logfile
   * @throws {APIError} if the request was unsuccessful
   */
  async getJobLogfileDownloadURL(jobId) {
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'log-url');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).url;
  }

  /**
   * Deletes the job with the given ID.
   *
   * Note that only jobs that have not been started can be deleted.
   *
   * @async
   * @param {string} jobId - the job ID
   * @throws {APIError} if the request was unsuccessful
   */
  async deleteJob(jobId) {
    let uri = urljoin(this.baseURL, 'jobs', jobId);
    await requests.delete(uri, this.header_);
  }

  /**
   * Force kills the job with the given ID.
   *
   * Note that only jobs that are queued or scheduled can be killed.
   *
   * @async
   * @param {string} jobId - the job ID
   * @throws {APIError} if the request was unsuccessful
   */
  async killJob(jobId) {
    let uri = urljoin(this.baseURL, 'jobs', jobId, 'kill');
    await requests.put(uri, this.header_);
  }

  /**
   * Starts the jobs with the given IDs.
   *
   * @async
   * @param {Array} jobIds - the job IDs
   * @return {Object} an object mapping job IDs to objects indicating whether
   *   the job was successfully processed. The `status` field will be set to
   *   `true` on success or `false` on failure
   * @throws {APIError} if the request was unsuccessful
   */
  async batchStartJobs(jobIds) {
    return await this.batchRequest_('jobs', 'start', jobIds);
  }

  /**
   * Archives the jobs with the given IDs.
   *
   * @async
   * @param {Array} jobIds - the job IDs
   * @return {Object} an object mapping job IDs to objects indicating whether
   *   the job was successfully processed. The `status` field will be set to
   *   `true` on success or `false` on failure
   * @throws {APIError} if the request was unsuccessful
   */
  async batchArchiveJobs(jobIds) {
    return await this.batchRequest_('jobs', 'archive', jobIds);
  }

  /**
   * Unarchives the jobs with the given IDs.
   *
   * @async
   * @param {Array} jobIds - the job IDs
   * @return {Object} an object mapping job IDs to objects indicating whether
   *   the job was successfully processed. The `status` field will be set to
   *   `true` on success or `false` on failure
   * @throws {APIError} if the request was unsuccessful
   */
  async batchUnarchiveJobs(jobIds) {
    return await this.batchRequest_('jobs', 'unarchive', jobIds);
  }

  /**
   * Updates the expiration date of the jobs with the given IDs.
   *
   * Note that if the expiration date of the job after modification is in the
   * past, the job output will be deleted.
   *
   * Exactly one named parameter must be provided.
   *
   * @async
   * @param {Array} jobIds - the job IDs
   * @param {number} days - the number of days by which to extend the lifespan
   *   of the job. To decrease the lifespan of the job, provide a negative
   *   number
   * @param {Date|string} [expirationDate=undefined] - a new TTL for the job.
   *   If a string is provided, it must be in ISO 8601 format, e.g.,
   *   'YYYY-MM-DDThh:mm:ss.sssZ'. If a non-UTC timezone is included in the
   *   Date or string, it will be respected
   * @return {Object} an object mapping job IDs to objects indicating whether
   *   the job was successfully processed. The `status` field will be set to
   *   `true` on success or `false` on failure
   * @throws {APIError} if the request was unsuccessful
   */
  async batchUpdateJobsTTL(jobIds, days=undefined, expirationDate=undefined) {
    let formData = {};
    if (days) {
      formData.days = days.toString();
    }
    if (expirationDate) {
      formData.expiration_date = parseDate_(expirationDate);
    }
    if (Object.keys(formData).length != 1) {
      throw new APIError(
        'Either `days` or `expirationDate` must be provided', 400);
    }
    return await this.batchRequest_('jobs', 'ttl', jobIds, formData);
  }

  /**
   * Deletes the jobs with the given IDs.
   *
   * Note that only jobs that have not been started can be deleted.
   *
   * @async
   * @param {Array} jobIds - the job IDs
   * @return {Object} an object mapping job IDs to objects indicating whether
   *   the job was successfully processed. The `status` field will be set to
   *   `true` on success or `false` on failure
   * @throws {APIError} if the request was unsuccessful
   */
  async batchDeleteJobs(jobIds) {
    return await this.batchRequest_('jobs', 'delete', jobIds);
  }

  /**
   * Force kills the jobs with the given IDs.
   *
   * Note that only jobs that are queued or scheduled can be killed.
   *
   * @async
   * @param {Array} jobIds - the job IDs
   * @return {Object} an object mapping job IDs to objects indicating whether
   *   the job was successfully processed. The `status` field will be set to
   *   `true` on success or `false` on failure
   * @throws {APIError} if the request was unsuccessful
   */
  async batchKillJobs(jobIds) {
    return await this.batchRequest_('jobs', 'kill', jobIds);
  }

  // STATUS

  /**
   * Gets the current status of the platform.
   *
   * @return {Object} an object describing the status of the platform
   */
  async getPlatformStatus() {
    let uri = urljoin(this.baseURL, 'status', 'all');
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).statuses;
  }

  // PRIVATE FUNCTIONS

  async batchRequest_(type, action, ids, params={}) {
    let uri = urljoin(this.baseURL, type, 'batch');
    let bodyData = Object.assign({}, params, {action, ids});
    let res = await requests.post(uri, this.header_, {
      json: true,
      body: bodyData,
    });
    res = res.responses;
    for (let status of Object.values(res)) {
      status.success = !status.error;
    }
    return res;
  }
}

function parseDate_(dateOrStr) {
  if (dateOrStr instanceof Date) {
    return dateOrStr.toISOString();
  }
  return dateOrStr.toString();
}

exports.API = API;
exports.AnalyticType = AnalyticType;
