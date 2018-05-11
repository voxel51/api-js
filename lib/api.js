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
let config = require('./config.js');
let requests = require('./requests.js');

/**
 * Main class for managing a session with the Voxel51 Vision Services API.
 *
 * @class
 */
class API {

  /** Creates a new API instance. */
  constructor() {
    this.baseURL = config.BASE_URL;
    this.header = auth.getRequestHeader();
  }

  // ALGORITHM FUNCTIONS

  /**
   * Returns a list of all available algorithms.
   *
   * @async
   * @memberof API
   * @instance
   * @function listAlgorithms
   * @return {Array} an array of objects describing the available algorithms
   * @throws {Error} if the request was unsuccessful
   */
  async listAlgorithms() {
    let uri = this.baseURL + '/algo/list';
    let res = await requests.get(uri, this.header);
    return JSON.parse(res).algorithms;
  }

  /**
   * Gets documentation about the algorithm with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function getAlgorithmDoc
   * @param {string} algoId - the algorithm ID
   * @return {object} an object containing the algorithm documentation
   * @throws {Error} if the request was unsuccessful
   */
  async getAlgorithmDoc(algoId) {
    let uri = this.baseURL + '/algo/' + algoId;
    let res = await requests.get(uri, this.header);
    return JSON.parse(res);
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
    let res = await requests.get(uri, this.header);
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
    let res = await requests.get(uri, this.header);
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
    let res = await requests.post(uri, this.header, {formData: formData});
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
    let res = await requests.get(uri, this.header);
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
    requests.raw(uri, this.header).pipe(stream);
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
    await requests.delete(uri, this.header);
  }

  // DATASET FUNCTIONS

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
  async removeDataFromDataset(dataId, datasetId, deleteFiles=false) {
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
    let uri = this.baseURL + '/job/list';
    let res = await requests.get(uri, this.header);
    return JSON.parse(res).jobs;
  }

  /**
   * Uploads a job request to the cloud.
   *
   * @async
   * @memberof API
   * @instance
   * @function uploadJobRequest
   * @param {string} jobJSONPath - the path to a job JSON request file
   * @param {string} jobName - a name for the job
   * @param {boolean} [autoStart=false] - whether to automatically start the
   *   job upon creation
   * @return {object} metadata about the job
   * @throws {Error} if the request was unsuccessful
   *
   * @todo allow jobJSONPath to accept a job JSON object directly
   */
  async uploadJobRequest(jobJSONPath, jobName, autoStart=false) {
    let formData = {
      'file': fs.createReadStream(jobJSONPath),
      'job_name': jobName,
      'auto_start': autoStart.toString()
    };
    let uri = this.baseURL + '/job';
    let res = await requests.post(uri, this.header, {formData: formData});
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
    let uri = this.baseURL + '/job/' + jobId;
    let res = await requests.get(uri, this.header);
    return JSON.parse(res).job;
  }

  /**
   * Gets the job request for the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function getJobRequest
   * @param {string} jobId - the job ID
   * @return {object} the job request instance describing the job
   * @throws {Error} if the request was unsuccessful
   */
  async getJobRequest(jobId) {
    let uri = this.baseURL + '/job/' + jobId + '/request';
    let res = await requests.get(uri, this.header);
    return JSON.parse(res);
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
    let uri = this.baseURL + '/job/' + jobId + '/start';
    await requests.put(uri, this.header);
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
    let uri = this.baseURL + '/job/' + jobId + '/status';
    let res = await requests.get(uri, this.header);
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
    let uri = this.baseURL + '/job/' + jobId + '/output';
    requests.raw(uri, this.header).pipe(stream);
  }
}

module.exports = API;
