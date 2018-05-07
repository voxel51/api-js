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
   * Returns a list of the available algorithms, including their name and
   * unique ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function listAlgorithms
   * @return {Array} an Array of objects describing the available algorithms
   * @throws {Error} If the request was unsuccessful
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
   * @param {string} algoId - Algorithm's unique ID
   * @return {object} an object containing the algorithm documentation
   * @throws {Error} If the request was unsuccessful
   */
  async getAlgorithmDoc(algoId) {
    let uri = this.baseURL + '/algo/' + algoId;
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
   * @return {Array} an array of data IDs
   * @throws {Error} If the request was unsuccessful
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
   * @param {string} filePath - Path to data file
   * @return {object} metadata about the uploaded data
   * @throws {Error} If the request was unsuccessful
   */
  async uploadData(filePath) {
    let formData = {
      file: fs.createReadStream(filePath),
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
   * @param {string} dataId - The data's unique ID
   * @return {Response} HTTP response with the data's JSON metadata
   * @throws {Error} If the request was unsuccessful
   */
  async getDataDetails(dataId) {
    let uri = this.baseURL + '/data/' + dataId;
    return await requests.get(uri, this.header);
  }

  /**
   * Downloads the data with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function downloadData
   * @param {string} dataId - The data's unique ID
   * @param {string} outputPath - Optional output path at which to write the
   *   data
   * @throws {Error} If the request was unsuccessful
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
   * @param {string} dataId - The data's unique ID
   * @return {Response} HTTP response with the 204 status code
   * @throws {Error} If the request was unsuccessful
   */
  async deleteData(dataId) {
    let uri = this.baseURL + '/data/' + dataId;
    return await requests.delete(uri, this.header);
  }

  // DATASET FUNCTIONS

  /**
   * Returns a list of all datasets in cloud storage.
   *
   * @async
   * @memberof API
   * @instance
   * @function listDatasets
   * @return {Response} HTTP response with JSON dataset list
   * @todo Not yet implemented
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
   * @param {string} datasetName - Name of new dataset
   * @return {Response} HTTP response with JSON of new dataset
   * @todo Not yet implemented
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
   * @param {string} dataId - The data's unique ID
   * @param {string} datasetId - the dataset's unique ID
   * @return {Response} HTTP response with JSON list of data in dataset
   * @todo Not yet implemented
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
   * @param {string} dataId - The data's unique ID
   * @param {string} datasetId - The dataset's unique ID
   * @param {boolean} [deleteFiles=false] - Whether to delete the specified
   *   data file from cloud storage
   * @return {Response} HTTP response with JSON of updated dataset
   * @todo Not yet implemented
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
   * @param {string} datasetId - The dataset's unique ID
   * @return {Response} HTTP response with JSON dataset metadata
   * @todo Not yet implemented
   */
  async getDatasetDetails(datasetId) {
    throw new Error('Not yet implemented');
  }

  /**
   * Downloads the dataset with the given ID as a zip file.
   *
   * @async
   * @memberof API
   * @instance
   * @function downloadDataset
   * @param {string} datasetName = The dataset's unique ID
   * @return {Response} HTTP response stream
   * @todo Not yet implemented
   */
  async downloadDataset(datasetName) {
    throw new Error('Not yet implemented');
  }

  /**
   * Deletes the dataset with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function deleteDataset
   * @param {string} datasetName - The dataset's unique ID
   * @return {Response} HTTP response with 204 status code
   * @todo Not yet implemented
   */
  async deleteDataset(datasetName) {
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
   * @return {Response} HTTP response with JSON job list
   * @throws {Error} If the request was unsuccessful
   */
  async listJobs() {
    let uri = this.baseURL + '/job/list';
    return await requests.get(uri, this.header);
  }

  /**
   * Uploads a job request to the cloud.
   *
   * @async
   * @memberof API
   * @instance
   * @function uploadJobRequest
   * @param {string} jobJSONPath - Path to the job JSON request file
   * @param {string} jobName - Name for the new job
   * @param {boolean} [autoStart=false] - Whether the job should be
   *   automatically started
   * @return {Response} HTTP response with JSON job upload success
   * @throws {Error} If the request was unsuccessful
   */
  async uploadJobRequest(jobJSONPath, jobName, autoStart=false) {
    let formData = {
      'file': fs.createReadStream(jobJSONPath),
      'job_name': jobName,
      'auto_start': autoStart.toString()
    };
    let uri = this.baseURL + '/job';
    return await requests.post(uri, this.header, {formData: formData});
  }

  /**
   * Gets details about the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function getJobDetails
   * @param {string} jobId - The job's unique ID
   * @return {Response} HTTP response with JSON job metadata
   * @throws {Error} If the request was unsuccessful
   */
  async getJobDetails(jobId) {
    let uri = this.baseURL + '/job/' + jobId;
    return await requests.get(uri, this.header);
  }

  /**
   * Gets and streams the job request for the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function getJobRequest
   * @param {string} jobId - The job's unique ID
   * @throws {Error} If the request was unsuccessful
   */
  async getJobRequest(jobId) {
    let uri = this.baseURL + '/job/' + jobId + '/request';
    requests.raw(uri, this.header).pipe(process.stdout);
  }

  /**
   * Starts the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function startJob
   * @param {string} jobId - The job's unique ID
   * @return {Response} HTTP response with updated JSON of job status
   * @throws {Error} If the request was unsuccessful
   */
  async startJob(jobId) {
    let uri = this.baseURL + '/job/' + jobId + '/start';
    return await requests.put(uri, this.header);
  }

  /**
   * Gets and streams the status of the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function getJobStatus
   * @param {string} jobId - The job's unique ID
   * @throws {Error} If the request was unsuccessful
   */
  async getJobStatus(jobId) {
    let uri = this.baseURL + '/job/' + jobId + '/status';
    requests.raw(uri, this.header).pipe(process.stdout);
  }

  /**
   * Downloads the output of the job with the given ID.
   *
   * @async
   * @memberof API
   * @instance
   * @function downloadJobOutput
   * @param {string} jobId - The job's unique ID
   * @param {string} outputPath - Output path at which to write.
   * @throws {Error} If the request was unsuccessful
   */
  async downloadJobOutput(jobId, outputPath) {
    let stream = fs.createWriteStream(outputPath);
    stream.on('error', function(error) { throw error; });
    stream.on('end', function() { return; });
    let uri = this.baseURL + '/job/' + jobId + '/output';
    requests.raw(uri, this.header).pipe(stream);
  }
}

module.exports = API;
