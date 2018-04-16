/*
 * Main client library module. Creates the client library
 * object with all user-facing functions.
 *
 * Copyright 2017-2018, Voxel51, LLC
 * voxel51.com
 *
 * David Hodgson, david@voxel51.com
*/

/**
 * Voxel51 Node Client Library
 * @module @voxel51/lib
 */
'use strict';

let request = require('./requests.js');
let config = require('./config.js');
let fs = require('fs');

let ClientLibrary = Object.create(config);

// ALGORITHM ROUTES

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
 * @return {Response} HTTP response stream of JSON algorithm documentation
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
 * @todo Not yet implemented
 */
ClientLibrary.addDataToDataset(dataId, datasetId) {
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
 * @todo Not yet implemented
 */
ClientLibrary.removeDataFromDataset(dataId, datasetId, deleteFiles=false) {
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
ClientLibrary.listJobs = async function() {
  try {
    return await request.get('/job/list');
  } catch (error) {
    throw error;
  }
};

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

ClientLibrary.getJobDetails = async function(jobId) {
  try {
    return await request.get('/job/' + jobId);
  } catch (error) {
    throw error;
  }
};

ClientLibrary.getJobRequest = async function(jobId) {
  try {
    request.req('/job/' + jobId + '/request').pipe(process.stdout);
  } catch (error) {
    throw error;
  }
};

ClientLibrary.startJob = async function(jobId) {
  try {
    return await request.put('/job/' + jobId + '/start');
  } catch (error) {
    throw error;
  }
};

ClientLibrary.getJobStatus = async function(jobId) {
  try {
    request.req('/job/' + jobId + '/status').pipe(process.stdout);
  } catch (error) {
    throw error;
  }
};

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

ClientLibrary.getJobsPage = async function() {
  try {
    return await request.get('/job');
  } catch (error) {
    throw error;
  }
};

module.exports = ClientLibrary;
