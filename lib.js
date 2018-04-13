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

let Logger = require('./logger.js');
let Request = require('./requests.js');
let Config = require('./config.js');
let fs = require('fs');

let ClientLibrary = Object.create(Config);

// ALGORITHM ROUTES
ClientLibrary.listAlgorithms = async function() {
  try {
    return await Request.get('/algo/list');
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

ClientLibrary.getAlgorithmDoc = async function(algoId) {
  try {
    Request.req('/algo/' + algoId).pipe(process.stdout);
  } catch (error) {
    await Logger.error(error);
  }
};

ClientLibrary.getDocsPage = async function() {
  try {
    return await Request.get('/algo');
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

// DATA ROUTES
ClientLibrary.listData = async function() {
  try {
    return await Request.get('/data/list');
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

ClientLibrary.uploadData = async function(filePath) {
  try {
    let formData = {
      file: fs.createReadStream(filePath),
    };

    return await Request.post({
      uri: '/data',
      formData: formData,
    });
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

ClientLibrary.getDataDetails = async function(dataId) {
  try {
    return await Request.get('/data/' + dataId);
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

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
    Request.req('/data/' + dataId + '/download').pipe(stream);
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

ClientLibrary.deleteData = async function(dataId) {
  try {
    return await Request.delete('/data/' + dataId);
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

ClientLibrary.getDataPage = async function() {
  try {
    return await Request.get('/data');
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

// DATASET ROUTES
ClientLibrary.getDatasetInfo = async function(datasetName) {
  try {
    return 'Not yet implemented';
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

ClientLibrary.deleteDataset = async function(datasetName) {
  try {
    return 'Not yet implemented';
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

ClientLibrary.downloadDataset = async function(datasetName) {
  try {
    return 'Not yet implemented';
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

// JOB ROUTES
ClientLibrary.listJobs = async function() {
  try {
    return await Request.get('/job/list');
  } catch (error) {
    await Logger.error(error);
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

    return await Request.post({
      uri: '/job',
      formData: formData,
    });
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

ClientLibrary.getJobDetails = async function(jobId) {
  try {
    return await Request.get('/job/' + jobId);
  } catch (error) {
    throw error;
  }
};

ClientLibrary.getJobRequest = async function(jobId) {
  try {
    Request.req('/job/' + jobId + '/request').pipe(process.stdout);
  } catch (error) {
    throw error;
  }
};

ClientLibrary.startJob = async function(jobId) {
  try {
    return await Request.put('/job/' + jobId + '/start');
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

ClientLibrary.getJobStatus = async function(jobId) {
  try {
    Request.req('/job/' + jobId + '/status').pipe(process.stdout);
  } catch (error) {
    await Logger.error(error);
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

    Request.req('/job/' + jobId + '/output').pipe(stream);
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

ClientLibrary.getJobsPage = async function() {
  try {
    return await Request.get('/job');
  } catch (error) {
    await Logger.error(error);
    throw error;
  }
};

module.exports = ClientLibrary;
