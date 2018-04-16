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

/**
 * @module @voxel51/algorithm
 */

/**
 * Returns a list of the available algorithms, including their name and
 * unique ID.
 *
 * @example
 * // assuming api is instance of ClientLibrary()
 * api.listAlgorithms().then(function(result) {
 *   console.log(result.body);
 * }).catch(function(error) {
 *   console.error(error);
 * });
 *
 * @async
 * @function listAlgorithms
 * @return {Response} HTTP response with JSON algorithm list
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.listAlgorithms = async function() {
  try {
    return await request.get('/algo/list');
  } catch (error) {
    throw error;
  }
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
  try {
    request.req('/algo/' + algoId).pipe(process.stdout);
  } catch (error) {
    throw error;
  }
};

// DATA ROUTES

/** @module @voxel51/data **/

/**
 * Returns a list of all user data uploaded to cloud storage.
 *
 * @async
 * @function listData
 * @return {Response} HTTP response with JSON data list
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.listData = async function() {
  try {
    return await request.get('/data/list');
  } catch (error) {
    throw error;
  }
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
  try {
    let formData = {
      file: fs.createReadStream(filePath),
    };

    return await request.post({
      uri: '/data',
      formData: formData,
    });
  } catch (error) {
    throw error;
  }
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
  try {
    return await request.get('/data/' + dataId);
  } catch (error) {
    throw error;
  }
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
  try {
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
    request.req('/data/' + dataId + '/download').pipe(stream);
  } catch (error) {
    throw error;
  }
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
  try {
    return await request.delete('/data/' + dataId);
  } catch (error) {
    throw error;
  }
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
  try {
    return 'Not yet implemented';
  } catch (error) {
    throw error;
  }
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
  try {
    return 'Not yet implemented';
  } catch (error) {
    throw error;
  }
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
  try {
    return 'Not yet implemented';
  } catch (error) {
    throw error;
  }
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
  try {
    return 'Not yet implemented';
  } catch (error) {
    throw error;
  }
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
  try {
    return 'Not yet implemented';
  } catch (error) {
    throw error;
  }
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
  try {
    return 'Not yet implemented';
  } catch (error) {
    throw error;
  }
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
  try {
    return 'Not yet implemented';
  } catch (error) {
    throw error;
  }
};

// JOB ROUTES

/** @module @voxel51/job **/

/**
 * Returns a list of all jobs in the cloud.
 *
 * @async
 * @function listJobs
 * @return {Response} HTTP response with JSON job list
 * @throws {Error} API error if the request was unsuccessful
 */
ClientLibrary.listJobs = async function() {
  try {
    return await request.get('/job/list');
  } catch (error) {
    throw error;
  }
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
  try {
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
  } catch (error) {
    throw error;
  }
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
  try {
    return await request.get('/job/' + jobId);
  } catch (error) {
    throw error;
  }
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
  try {
    request.req('/job/' + jobId + '/request').pipe(process.stdout);
  } catch (error) {
    throw error;
  }
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
  try {
    return await request.put('/job/' + jobId + '/start');
  } catch (error) {
    throw error;
  }
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
  try {
    request.req('/job/' + jobId + '/status').pipe(process.stdout);
  } catch (error) {
    throw error;
  }
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
  try {
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

    request.req('/job/' + jobId + '/output').pipe(stream);
  } catch (error) {
    throw error;
  }
};

module.exports = ClientLibrary;
