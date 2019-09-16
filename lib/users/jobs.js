/**
 * Job request creation and manipulation library for the Voxel51 Platform API.
 *
 * Copyright 2017-2019, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module users/jobs
 */

'use strict';

const autoBind = require('auto-bind');

const utils = require('./utils.js');

const DATA_ID_FIELD = 'data-id';

/**
 * Enum describing the possible compute modes of a job.
 *
 * @enum {string}
 */
const JobComputeMode = {
  CPU: 'CPU',
  GPU: 'GPU',
  BEST: 'BEST'
}

/**
 * Enum describing the possible states of a job.
 *
 * @enum {string}
 */
const JobState = {
  READY: 'READY',
  QUEUED: 'QUEUED',
  SCHEDULED: 'SCHEDULED',
  RUNNING: 'RUNNING',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED'
}

/**
 * Enum describing the possible failure types for a job.
 *
 * @enum {string}
 */
const JobFailureType = {
  USER: 'USER',
  ANALYTIC: 'ANALYTIC',
  PLATFORM: 'PLATFORM',
  NONE: 'NONE'
}

/**
 * Error raised when there is a problem with the execution of a job.
 *
 * @extends module:users/utils~ExtendableError
 */
class JobExecutionError extends utils.ExtendableError {}

/**
 * Class encapsulating a job request for the API.
 *
 * @extends module:users/utils~Serializable
 */
class JobRequest extends utils.Serializable {

  /**
   * Creates a JobRequest instance.
   *
   * @constructor
   * @param {string} analytic - the name of the analytic to run
   * @param {string} [version=null] - the version of the analytic to run.
   *   If not specified, the latest available version is used
   * @param {boolean} [computeMode=null] - the JobComputeMode to use for the
   *   job. By default, JobComputeMode.BEST is used
   */
  constructor(analytic, version = null, computeMode = null) {
    super();
    this.analytic = analytic;
    this.version = version;
    this.computeMode = computeMode;
    this.inputs = {};
    this.parameters = {};
    autoBind(this);
  }

  /**
   * Sets the input of the given name.
   *
   * @param {string} name - the input name to set
   * @param {RemoteDataPath} path - a RemoteDataPath instance defining the
   *   path to the input data
   */
  setInput(name, path) {
    this.inputs[name] = path;
  }

  /**
   * Sets the data parameter of the given name.
   *
   * @param {string} name - the parameter name to set
   * @param {RemoteDataPath} path - a RemoteDataPath instance defining the
   *   path to the data for the parameter
   */
  setDataParameter(name, path) {
    this.parameters[name] = path;
  }

  /**
   * Sets the (non-data) parameter of the given name.
   *
   * @param {string} name - the parameter name to set
   * @param val - the parameter vale, which must be JSON serializable
   */
  setParameter(name, val) {
    this.parameters[name] = val;
  }

  /**
   * Constructs a JobRequest object from a JSON object representation of it.
   *
   * @param {object} obj - a JSON object representation of the JobRequest
   *   object
   * @returns {JobRequest} a JobRequest instance
   */
  static fromObject(obj) {
    // Note that we use `compute_mode` in the JSON, not `computeMode`
    let jobRequest = new JobRequest(
      obj.analytic, obj.version, obj.compute_mode);

    // Set inputs
    for (var name in obj.inputs) {
      if (obj.inputs.hasOwnProperty(name)) {
        let path = RemoteDataPath.fromObject(obj.inputs[name]);
        jobRequest.setInput(name, path);
      }
    }

    // Set parameters
    for (var name in obj.parameters) {
      if (obj.parameters.hasOwnProperty(name)) {
        let val = obj.parameters[name];
        if (RemoteDataPath.isRemotePathObject(val)) {
          // Data parameter
          jobRequest.setDataParameter(name, RemoteDataPath.fromObject(val));
        } else {
          // Non-data parameter
          jobRequest.setParameter(name, val);
        }
      }
    }

    return jobRequest;
  }

  attributes_() {
    let attrs = {};
    attrs.analytic = 'analytic';
    if (!utils.isNullOrUndefined(this.version)) {
      attrs.version = 'version';
    }
    if (!utils.isNullOrUndefined(this.computeMode)) {
      attrs.computeMode = 'compute_mode';
    }
    attrs.inputs = 'inputs';
    attrs.parameters = 'parameters';
    return attrs;
  }
}

/**
 * Class encapsulating a remote data path.
 *
 * @extends module:users/utils~Serializable
 *
 * @property {boolean} hasDataId true if this instance has a data ID, and false
 *   otherwise
 * @property {boolean} isValid true if this instance is valid, and false
 *   otherwise
 */
class RemoteDataPath extends utils.Serializable {

  /**
   * Creates a new RemoteDataPath instance.
   *
   * @constructor
   * @param {string} [dataId=null] - the ID of the data in cloud storage
   * @throws {RemoteDataPathError} if the instance creation failed
   */
  constructor(dataId = null) {
    super();
    this.dataId = dataId;
    if (!this.isValid) {
        throw new RemoteDataPathError('Invalid RemoteDataPath')
    }
    autoBind(this);
  }

  get hasDataId() {
    return this.dataId !== null;
  }

  get isValid() {
    return this.hasDataId;
  }

  /**
   * Creates a RemoteDataPath instance defined by the given data ID.
   *
   * @param [string] dataId - the ID of the data in cloud storage
   * @returns {RemoteDataPath} a RemoteDataPath instance with the given data ID
   */
  static fromDataId(dataId) {
    return new RemoteDataPath(dataId);
  }

  /**
   * Determines whether the given value defines a valid RemoteDataPath
   * dictionary.
   *
   * @param [val] - either a JSON object representation of a RemoteDataPath
   *   instance or another arbitrary value
   * @returns {boolean} true if val is a valid RemoteDataPath JSON object, and
   *   False otherwise
   */
  static isRemotePathObject(val) {
    try {
      RemoteDataPath.fromObject(val);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Constructs a RemoteDataPath instance from a JSON object.
   *
   * @param {object} [obj] - a JSON object defining a RemoteDataPath instance
   * @returns {RemoteDataPath} a RemoteDataPath instance
   * @throws {RemoteDataPathError} if the instance creation failed
   */
  static fromObject(obj) {
    if (DATA_ID_FIELD in obj) {
      return RemoteDataPath.fromDataId(obj[DATA_ID_FIELD]);
    }
    throw new RemoteDataPathError(
      'Invalid RemoteDataPath object: ' + JSON.stringify(obj, null, 4));
  }

  attributes_() {
    if (this.hasDataId) {
      return {dataId: DATA_ID_FIELD};
    }
    throw new RemoteDataPathError('Invalid RemoteDataPath')
  }
}

/**
 * Error raised when an invalid RemoteDataPath instance is found.
 *
 * @extends module:users/utils~ExtendableError
 */
class RemoteDataPathError extends utils.ExtendableError {}

exports.JobComputeMode = JobComputeMode;
exports.JobState = JobState;
exports.JobFailureType = JobFailureType;
exports.JobExecutionError = JobExecutionError;
exports.JobRequest = JobRequest;
exports.RemoteDataPath = RemoteDataPath;
