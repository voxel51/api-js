/**
 * Main interface for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, LLC<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * Brian Moore, brian@voxel51.com<br>
 * David Hodgson, david@voxel51.com
 *
 * @module api
 */

'use strict';

let fs = require('fs');
let waitUntil = require('wait-until');

let auth = require('./auth.js');
let jobs = require('./jobs.js');
let requests = require('./requests.js');

const BASE_URL = 'https://api.voxel51.com/v1';

/**
 * Main class for managing a session with the Voxel51 Vision Services API.
 */
class API {
  /**
   * Creates a new API instance.
   *
   * @constructor
   * @param {string} [tokenPath=null] - an optional path to a valid token JSON
   *   file. If no path is provided as an argument, the `VOXEL51_API_TOKEN`
   *   environment variable is checked and, if set, the token is loaded from
   *   that path. Otherwise, the token is loaded from
   *   `~/.voxel51/api-token.json`
   */
  constructor(tokenPath = null) {
    this.baseURL = BASE_URL;
    this.token = auth.loadToken(tokenPath);
    this.header_ = this.token.getHeader();
  }

  // ANALYTICS FUNCTIONS

  /**
   * Returns a list of all available analytics.
   *
   * @async
   * @returns {Array} an array of objects describing the available analytics
   * @throws {APIError} if the request was unsuccessful
   */
  async listAnalytics() {
    let uri = this.baseURL + '/analytics/list';
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).analytics;
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

  // DATA FUNCTIONS

  /**
   * Returns a list of all user data uploaded to cloud storage.
   *
   * @async
   * @returns {Array} an array of objects describing each piece of data
   * @throws {APIError} if the request was unsuccessful
   */
  async listData() {
    let uri = this.baseURL + '/data/list';
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body).data;
  }

  /**
   * Uploads data to cloud storage.
   *
   * @async
   * @param {string} path - the path to the data file
   * @returns {object} metadata about the uploaded data
   * @throws {APIError} if the request was unsuccessful
   */
  async uploadData(path) {
    let formData = {
      file: fs.createReadStream(path),
    };
    let uri = this.baseURL + '/data';
    let body = await requests.post(uri, this.header_, {formData: formData});
    return JSON.parse(body);
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
   * @throws {APIError} if the request was unsuccessful
   */
  async downloadData(dataId, outputPath) {
    let stream = fs.createWriteStream(outputPath);
    stream.on('error', function(err) { throw err; });
    stream.on('end', function() { return; });
    let uri = this.baseURL + '/data/' + dataId + '/download';
    requests.raw(uri, this.header_).pipe(stream);
  }

  /**
   * Deletes the data with the given ID from the cloud.
   *
   * @async
   * @param {string} dataId - the data ID
   * @throws {APIError} if the request was unsuccessful
   */
  async deleteData(dataId) {
    let uri = this.baseURL + '/data/' + dataId;
    await requests.delete(uri, this.header_);
  }

  // DATASETS FUNCTIONS

  /**
   * Returns a list of all datasets in cloud storage.
   *
   * @async
   * @returns {array} an array of objects describing the datasets
   * @throws {APIError} if the request was unsuccessful
   * @todo implement this method
   */
  async listDatasets() {
    throw new Error('Not yet implemented');
  }

  /**
   * Creates a new dataset in the cloud with the given name.
   *
   * @async
   * @param {string} datasetName - a name for the dataset
   * @returns {object} metadata about the new dataset
   * @throws {APIError} if the request was unsuccessful
   * @todo implement this method
   */
  async createDataset(datasetName) {
    throw new Error('Not yet implemented');
  }

  /**
   * Adds the data with the given ID to the dataset with the given ID.
   *
   * @async
   * @param {string} dataId - the ID of the data to add to the dataset
   * @param {string} datasetId - the dataset ID
   * @returns {Response} HTTP response with JSON list of data in dataset
   * @throws {APIError} if the request was unsuccessful
   * @todo implement this method
   */
  async addDataToDataset(dataId, datasetId) {
    throw new Error('Not yet implemented');
  }

  /**
   * Removes the data with the given ID from the dataset with the given ID.
   *
   * @async
   * @param {string} dataId - the ID of the data to remove from the dataset
   * @param {string} datasetId - the dataset ID
   * @param {boolean} [deleteFiles=false] - whether to delete the underlying
   *   data file from cloud storage
   * @throws {APIError} if the request was unsuccessful
   * @todo implement this method
   */
  async removeDataFromDataset(dataId, datasetId, deleteFiles = false) {
    throw new Error('Not yet implemented');
  }

  /**
   * Gets details about the dataset with the given ID.
   *
   * @async
   * @param {string} datasetId - the dataset ID
   * @returns {object} metdata about the dataset
   * @throws {APIError} if the request was unsuccessful
   * @todo implement this method
   */
  async getDatasetDetails(datasetId) {
    throw new Error('Not yet implemented');
  }

  /**
   * Downloads the dataset with the given ID.
   *
   * @async
   * @param {string} datasetId - the dataset ID
   * @throws {APIError} if the request was unsuccessful
   * @todo implement this method
   */
  async downloadDataset(datasetId) {
    throw new Error('Not yet implemented');
  }

  /**
   * Deletes the dataset with the given ID.
   *
   * @async
   * @param {string} datasetId - the dataset ID
   * @param {boolean} [deleteFiles=false] - whether to delete the underlying
   *   data files from cloud storage
   * @throws {APIError} if the request was unsuccessful
   * @todo implement this method
   */
  async deleteDataset(datasetId, deleteFiles = false) {
    throw new Error('Not yet implemented');
  }

  // JOBS FUNCTIONS

  /**
   * Returns a list of all jobs in the cloud.
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
   * Uploads a job request to the cloud.
   *
   * @async
   * @param {JobRequest} jobRequest - a JobRequest instance describing the job
   * @param {string} jobName - a name for the job
   * @param {boolean} [autoStart=false] - whether to automatically start the
   *   job upon creation
   * @returns {object} metadata about the job
   * @throws {APIError} if the request was unsuccessful
   *
   * @todo allow jobJSONPath to accept a job JSON object directly
   */
  async uploadJobRequest(jobRequest, jobName, autoStart = false) {
    let formData = {
      'file': {
        value: jobRequest.toString(),
        options: {
          filename: 'job.json',
          contentType: 'application/json'
        }
      },
      'job_name': jobName,
      'auto_start': autoStart.toString()
    };
    let uri = this.baseURL + '/jobs';
    let body = await requests.post(uri, this.header_, {formData: formData});
    return JSON.parse(body);
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
   * @returns {Promise} a Promise that resolves with no value
   * @throws {JobExecutionError} if the job failed
   * @throws {APIError} if an underlying API request was unsuccessful
   */
  async waitUntilJobCompletes(jobId, sleepTime = 5, maxWaitTime = 600) {
    let cond = async function() {
      return await this.isJobComplete(jobId);
    }

    return new Promise(function(resolve, reject) {
      waitUntil()
        .interval(1000 * sleepTime)
        .times(Math.round(maxWaitTime / sleepTime))
        .condition(async function() {
          try {
            return await cond();
          } catch (e) {
            reject(e);
          }
        })
        .done(function(isComplete) {
          if (!isComplete) {
            reject(new jobs.JobExecutionError('Maximum wait time exceeded'));
          }
          resolve();
        })
    });
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
   * @throws {APIError} if the request was unsuccessful
   */
  async downloadJobOutput(jobId, outputPath = 'output.zip') {
    let stream = fs.createWriteStream(outputPath);
    stream.on('error', function(error) { throw error; });
    stream.on('end', function() { return; });
    let uri = this.baseURL + '/jobs/' + jobId + '/output';
    requests.raw(uri, this.header_).pipe(stream);
  }

  // TYPES FUNCTIONS

  /**
   * Gets documentation about the types supported by the system.
   *
   * @async
   * @returns {object} an object containing the types documentation
   * @throws {APIError} if the request was unsuccessful
   */
  async getTypesDoc() {
    let uri = this.baseURL + '/types/';
    let body = await requests.get(uri, this.header_);
    return JSON.parse(body);
  }
}

module.exports = API;
