/*
 * Main client library module. Creates the client library
 * object with all user-facing functions.
 *
 * Copyright 2017-2018, Voxel51, LLC
 * voxel51.com
 *
 * David Hodgson, david@voxel51.com
*/


'use strict';

let request = require('./requests.js');
let config = require('./config.js');
let fs = require('fs');

let ClientLibrary = Object.create(config);

// ALGORITHM ROUTES
// @module @voxel51/algorithm

/**
 * Returns a list of the available algorithms, including their name and
 * unique ID.
 *
 * @async
 * @function listAlgorithms
 * @return {Response} HTTP response with JSON algorithm list
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.listAlgorithms = async function() {
  return await request.get('/algo/list');
};

/**
 * Gets and streams the algorithm documentation with given ID.
 *
 * @async
 * @function getAlgorithmDoc
 * @param {string} algoId - Algorithm's unique ID
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.getAlgorithmDoc = async function(algoId) {
  request.base('/algo/' + algoId).pipe(process.stdout);
};

// DATA ROUTES
// @module @voxel51/data

/**
 * Returns a list of all user data uploaded to cloud storage.
 *
 * @async
 * @function listData
 * @return {Response} HTTP response with JSON data list
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.listData = async function() {
  return await request.get('/data/list');
};

/**
 * Uploads data to cloud storage.
 *
 * @async
 * @function uploadData
 * @param {string} filePath - Path to data file
 * @return {Response} HTTP response with JSON metadata
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.uploadData = async function(filePath) {
  let formData = {
    file: fs.createReadStream(filePath),
  };

  return await request.post({
    uri: '/data',
    formData: formData,
  });
};

/**
 * Gets details about the data with the given ID.
 *
 * @async
 * @function getDataDetails
 * @param {string} dataId - The data's unique ID
 * @return {Response} HTTP response with the data's JSON metadata
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.getDataDetails = async function(dataId) {
  return await request.get('/data/' + dataId);
};

/**
 * Downloads the data with the given ID.
 *
 * @async
 * @function downloadData
 * @param {string} dataId - The data's unique ID
 * @param {string} outputPath - Optional output path at which to write the data
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.downloadData = async function(dataId, outputPath) {
  if (!outputPath) {
    throw new Error('Output path must be specified');
  }
  let stream = fs.createWriteStream(outputPath);
  stream.on('error', function(err) {
    throw err;
  });
  stream.on('end', function() {
    return;
  });
  request.base('/data/' + dataId + '/download').pipe(stream);
};

/**
 * Deletes the data with the given ID from the cloud.
 *
 * @async
 * @function deleteData
 * @param {string} dataId - The data's unique ID
 * @return {Response} HTTP response with the 204 status code
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.deleteData = async function(dataId) {
  return await request.delete('/data/' + dataId);
};

// DATASET ROUTES
/**
 * Returns a list of all datasets in cloud storage.
 *
 * @async
 * @function listDatasets
 * @return {Response} HTTP response with JSON dataset list
 * @todo Not yet implemented
 */
ClientLibrary.listDatasets = async function() {
  throw new Error('Not yet implemented');
};

/**
 * Creates a new dataset in the cloud with the given name.
 *
 * @async
 * @function createDataset
 * @param {string} datasetName - Name of new dataset
 * @return {Response} HTTP response with JSON of new dataset
 * @todo Not yet implemented
 */
ClientLibrary.createDataset = async function(datasetName) {
  throw new Error('Not yet implemented');
};

/**
 * Adds the data with the given ID to the dataset with the given ID.
 *
 * @async
 * @function addDataToDataset
 * @param {string} dataId - The data's unique ID
 * @param {string} datasetId - the dataset's unique ID
 * @return {Response} HTTP response with JSON list of data in dataset
 * @todo Not yet implemented
 */
ClientLibrary.addDataToDataset = async function(dataId, datasetId) {
  throw new Error('Not yet implemented');
};

/**
 * Removes the data with the given ID from the dataset with the given ID.
 *
 * @async
 * @function removeDataFromDataset
 * @param {string} dataId - The data's unique ID
 * @param {string} datasetId - The dataset's unique ID
 * @param {boolean} deleteFiles - Whether to delete the specified data file
 * from cloud storage. Default is false
 * @return {Response} HTTP response with JSON of updated dataset
 * @todo Not yet implemented
 */
ClientLibrary.removeDataFromDataset = async function(
  dataId,
  datasetId,
  deleteFiles=false) {
  throw new Error('Not yet implemented');
};

/**
 * Gets details about the dataset with the given ID.
 *
 * @async
 * @function getDatasetDetails
 * @param {string} datasetId - The dataset's unique ID
 * @return {Response} HTTP response with JSON dataset metadata
 * @todo Not yet implemented
 */
ClientLibrary.getDatasetDetails = async function(datasetId) {
  throw new Error('Not yet implemented');
};

/**
 * Downloads the dataset with the given ID as a zip file.
 *
 * @async
 * @function downloadDataset
 * @param {string} datasetName = The dataset's unique ID
 * @return {Response} HTTP response stream
 * @todo Not yet implemented
 */
ClientLibrary.downloadDataset = async function(datasetName) {
  throw new Error('Not yet implemented');
};

/**
 * Deletes the dataset with the given ID.
 *
 * @async
 * @function deleteDataset
 * @param {string} datasetName - The dataset's unique ID
 * @return {Response} HTTP response with 204 status code
 * @todo Not yet implemented
 */
ClientLibrary.deleteDataset = async function(datasetName) {
  throw new Error('Not yet implemented');
};

// JOB ROUTES
// @module @voxel51/job

/**
 * Returns a list of all jobs in the cloud.
 *
 * @async
 * @function listJobs
 * @return {Response} HTTP response with JSON job list
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.listJobs = async function() {
  return await request.get('/job/list');
};

/**
 * Uploads a job request to the cloud.
 *
 * @async
 * @function uploadJobRequest
 * @param {string} jobJSONPath - Path to the job JSON request file
 * @param {string} jobName - Name for the new job
 * @param {boolean} autoStart - Determines if job will be automatically started.
 * Default value: false
 * @return {Response} HTTP response with JSON job upload success
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.uploadJobRequest = async function(
  jobJSONPath,
  jobName,
  autoStart=false) {
  if (!jobName) {
    throw new Error('Job name must be specified');
  }

  let formData = {
    'job_name': jobName.toString(),
    'auto_start': autoStart.toString(),
    'file': fs.createReadStream(jobJSONPath),
  };

  return await request.post({
    uri: '/job',
    formData: formData,
  });
};

/**
 * Gets details about the job with the given ID.
 *
 * @async
 * @function getJobDetails
 * @param {string} jobId - The job's unique ID
 * @return {Response} HTTP response with JSON job metadata
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.getJobDetails = async function(jobId) {
  return await request.get('/job/' + jobId);
};

/**
 * Gets and streams the job request for the job with the given ID.
 *
 * @async
 * @function getJobRequest
 * @param {string} jobId - The job's unique ID
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.getJobRequest = async function(jobId) {
  request.base('/job/' + jobId + '/request').pipe(process.stdout);
};

/**
 * Starts the job with the given ID.
 *
 * @async
 * @function startJob
 * @param {string} jobId - The job's unique ID
 * @return {Response} HTTP response with updated JSON of job status
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.startJob = async function(jobId) {
  return await request.put('/job/' + jobId + '/start');
};

/**
 * Gets and streams the status of the job with the given ID.
 *
 * @async
 * @function getJobStatus
 * @param {string} jobId - The job's unique ID
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.getJobStatus = async function(jobId) {
  request.base('/job/' + jobId + '/status').pipe(process.stdout);
};

/**
 * Downloads the output of the job with the given ID.
 *
 * @async
 * @function downloadJobOutput
 * @param {string} jobId - The job's unique ID
 * @param {string} outputPath - Output path at which to write.
 * Default is output.zip
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.downloadJobOutput = async function(
  jobId,
  outputPath='output.zip') {
  if (!(typeof outputPath === 'string')) {
    throw new Error('Path must be valid string');
  }
  let stream = fs.createWriteStream(outputPath);
  stream.on('error', function(error) {
      throw error;
  });
  stream.on('end', function() {
      return;
  });

  request.base('/job/' + jobId + '/output').pipe(stream);
};

module.exports = ClientLibrary;
