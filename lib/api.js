/*
 * Main interface of the API.
 *
 * Copyright 2017-2018, Voxel51, LLC
 * voxel51.com
 *
 * David Hodgson, david@voxel51.com
 * Brian Moore, brian@voxel51.com
*/

'use strict';

let fs = require('fs');

let auth = require('./auth.js');
let jobs = require('./jobs.js');
let requests = require('./requests.js');

const BASE_URL = 'https://api.voxel51.com/v1';

/**
 * Main class for managing a session with the Voxel51 Vision Services API.
 *
 * @class
 */
class API {

  /**
   * Creates a new API instance.
   *
   * @memberof API
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
   * @memberof API
   * @instance
   * @function listAnalytics
   * @return {Array} an array of objects describing the available analytics
   * @throws {Error} if the request was unsuccessful
   */
  async listAnalytics() {
    let uri = this.baseURL + '/analytics/list';
    let res = await requests.get(uri, this.header_);
    return JSON.parse(res).analytics;
  }

  /**
   * Gets documentation about the analytic with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function getAnalyticDoc
   * @param {string} analyticId - the analytic ID
   * @return {object} an object containing the analytic documentation
   * @throws {Error} if the request was unsuccessful
   */
  async getAnalyticDoc(analyticId) {
    let uri = this.baseURL + '/analytics/' + analyticId;
    let res = await requests.get(uri, this.header_);
    return JSON.parse(res);
  }

  // DATA FUNCTIONS

  /**
   * Returns a list of all user data uploaded to cloud storage.
   *
   * @async
   * @memberof API
   * @instance
   * @function listData
   * @return {Array} an array of objects describing each piece of data
   * @throws {Error} if the request was unsuccessful
   */
  async listData() {
    let uri = this.baseURL + '/data/list';
    let res = await requests.get(uri, this.header_);
    return JSON.parse(res).data;
  }

  /**
   * Uploads data to cloud storage.
   *
   * @async
   * @memberof API
   * @instance
   * @function uploadData
   * @param {string} path - the path to the data file
   * @return {object} metadata about the uploaded data
   * @throws {Error} if the request was unsuccessful
   */
  async uploadData(path) {
    let formData = {
      file: fs.createReadStream(path),
    };
    let uri = this.baseURL + '/data';
    let res = await requests.post(uri, this.header_, {formData: formData});
    return JSON.parse(res);
  }

  /**
   * Gets details about the data with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function getDataDetails
   * @param {string} dataId - the data ID
   * @return {object} metadata about the data
   * @throws {Error} if the request was unsuccessful
   */
  async getDataDetails(dataId) {
    let uri = this.baseURL + '/data/' + dataId;
    let res = await requests.get(uri, this.header_);
    return JSON.parse(res).data;
  }

  /**
   * Downloads the data with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function downloadData
   * @param {string} dataId - the data ID
   * @param {string} [outputPath] - the output path to write to
   * @throws {Error} if the request was unsuccessful
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
   * @memberof API
   * @instance
   * @function deleteData
   * @param {string} dataId - the data ID
   * @throws {Error} if the request was unsuccessful
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
   * @memberof API
   * @instance
   * @function listDatasets
   * @return {array} an array of objects describing the datasets
   * @throws {Error} if the request was unsuccessful
   * @todo implement this method
   */
  async listDatasets() {
    throw new Error('Not yet implemented');
  }

  /**
   * Creates a new dataset in the cloud with the given name.
   *
   * @async
   * @memberof API
   * @instance
   * @function createDataset
   * @param {string} datasetName - a name for the dataset
   * @return {object} metadata about the new dataset
   * @throws {Error} if the request was unsuccessful
   * @todo implement this method
   */
  async createDataset(datasetName) {
    throw new Error('Not yet implemented');
  }

  /**
   * Adds the data with the given ID to the dataset with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function addDataToDataset
   * @param {string} dataId - the ID of the data to add to the dataset
   * @param {string} datasetId - the dataset ID
   * @return {Response} HTTP response with JSON list of data in dataset
   * @throws {Error} if the request was unsuccessful
   * @todo implement this method
   */
  async addDataToDataset(dataId, datasetId) {
    throw new Error('Not yet implemented');
  }

  /**
   * Removes the data with the given ID from the dataset with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function removeDataFromDataset
   * @param {string} dataId - the ID of the data to remove from the dataset
   * @param {string} datasetId - the dataset ID
   * @param {boolean} [deleteFiles=false] - whether to delete the underlying
   *   data file from cloud storage
   * @throws {Error} if the request was unsuccessful
   * @todo implement this method
   */
  async removeDataFromDataset(dataId, datasetId, deleteFiles = false) {
    throw new Error('Not yet implemented');
  }

  /**
   * Gets details about the dataset with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function getDatasetDetails
   * @param {string} datasetId - the dataset ID
   * @return {object} metdata about the dataset
   * @throws {Error} if the request was unsuccessful
   * @todo implement this method
   */
  async getDatasetDetails(datasetId) {
    throw new Error('Not yet implemented');
  }

  /**
   * Downloads the dataset with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function downloadDataset
   * @param {string} datasetId - the dataset ID
   * @throws {Error} if the request was unsuccessful
   * @todo implement this method
   */
  async downloadDataset(datasetId) {
    throw new Error('Not yet implemented');
  }

  /**
   * Deletes the dataset with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function deleteDataset
   * @param {string} datasetId - the dataset ID
   * @param {boolean} [deleteFiles=false] - whether to delete the underlying
   *   data files from cloud storage
   * @throws {Error} if the request was unsuccessful
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
   * @memberof API
   * @instance
   * @function listJobs
   * @return {Array} an array of objects describing the jobs
   * @throws {Error} if the request was unsuccessful
   */
  async listJobs() {
    let uri = this.baseURL + '/jobs/list';
    let res = await requests.get(uri, this.header_);
    return JSON.parse(res).jobs;
  }

  /**
   * Uploads a job request to the cloud.
   *
   * @async
   * @memberof API
   * @instance
   * @method uploadJobRequest
   * @param {JobRequest} jobRequest - a JobRequest instance describing the job
   * @param {string} jobName - a name for the job
   * @param {boolean} [autoStart=false] - whether to automatically start the
   *   job upon creation
   * @return {object} metadata about the job
   * @throws {Error} if the request was unsuccessful
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
    let uri = this.baseURL + '/job';
    let res = await requests.post(uri, this.header_, {formData: formData});
    return JSON.parse(res);
  }

  /**
   * Gets details about the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function getJobDetails
   * @param {string} jobId - the job ID
   * @return {object} metadata about the job
   * @throws {Error} if the request was unsuccessful
   */
  async getJobDetails(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId;
    let res = await requests.get(uri, this.header_);
    return JSON.parse(res).job;
  }

  /**
   * Gets the job request for the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @method getJobRequest
   * @param {string} jobId - the job ID
   * @return {JobRequest} the JobRequest instance describing the job
   * @throws {Error} if the request was unsuccessful
   */
  async getJobRequest(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId + '/request';
    let res = await requests.get(uri, this.header_);
    return jobs.JobRequest.fromString(res);
  }

  /**
   * Starts the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function startJob
   * @param {string} jobId - the job ID
   * @throws {Error} if the request was unsuccessful
   */
  async startJob(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId + '/start';
    await requests.put(uri, this.header_);
  }

  /**
   * Gets the status of the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function getJobStatus
   * @param {string} jobId - the job ID
   * @return {object} an object describing the status of the job
   * @throws {Error} if the request was unsuccessful
   */
  async getJobStatus(jobId) {
    let uri = this.baseURL + '/jobs/' + jobId + '/status';
    let res = await requests.get(uri, this.header_);
    return JSON.parse(res);
  }

  /**
   * Downloads the output of the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function downloadJobOutput
   * @param {string} jobId - the job ID
   * @param {string} [outputPath='output.zip'] - the output path to write to
   * @throws {Error} if the request was unsuccessful
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
   * @memberof API
   * @instance
   * @function getTypesDoc
   * @return {object} an object containing the types documentation
   * @throws {Error} if the request was unsuccessful
   */
  async getTypesDoc() {
    let uri = this.baseURL + '/types/';
    let res = await requests.get(uri, this.header_);
    return JSON.parse(res);
  }
}

module.exports = API;
