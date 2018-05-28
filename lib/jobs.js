/**
 * Job request creation and manipulation library for the Voxel51 Vision
 * Services API.
 *
 * Copyright 2017-2018, Voxel51, LLC<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * Brian Moore, brian@voxel51.com
 *
 * @module jobs
 */

'use strict';

let utils = require('./utils.js');

const DATA_ID_FIELD = 'data-id';
const SIGNED_URL_FIELD = 'signed-url';

/**
 * Class encapsulating a job request for the API.
 *
 * @extends module:utils~Serializable
 */
class JobRequest extends utils.Serializable {
  /**
   * Creates a new JobRequest instance.
   *
   * @constructor
   * @param {string} analyticId - the ID of the analytic to run
   */
  constructor(analyticId) {
    super();
    this.analytic = analyticId;
    this.inputs = {};
    this.parameters = {};
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
    let jobRequest = new JobRequest(obj.analytic);

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
}

/**
 * Class encapsulating a remote data path.
 *
 * @extends module:utils~Serializable
 *
 * @property {boolean} hasDataId true if this instance has a data ID, and false
 *   otherwise
 * @property {boolean} hasSignedUrl true if this instance has a signed URL, and
 *   false otherwise
 * @property {boolean} isValid true if this instance is valid, and false
 *   otherwise
 */
class RemoteDataPath extends utils.Serializable {
  /**
   * Creates a new RemoteDataPath instance.
   *
   * @constructor
   * @param {string} [dataId=null] - the ID of the data in cloud storage
   * @param {string} [signedUrl=null] - a signed URL with access to the data of
   *   interest in third-party cloud storage
   * @throws {RemoteDataPathError} if the instance creation failed
   */
  constructor(dataId = null, signedUrl = null) {
    super();
    this.dataId = dataId;
    this.signedUrl = signedUrl;
    if (!this.isValid) {
        throw new RemoteDataPathError('Invalid RemoteDataPath')
    }
  }

  get hasDataId() {
    return this.dataId !== null;
  }

  get hasSignedUrl() {
    return this.signedUrl !== null;
  }

  get isValid() {
    return this.hasDataId || this.hasSignedUrl;
  }

  /**
   * Creates a RemoteDataPath instance defined by the given data ID.
   *
   * @param [string] dataId - the ID of the data in cloud storage
   * @returns {RemoteDataPath} a RemoteDataPath instance with the given data ID
   */
  static fromDataId(dataId) {
    return new RemoteDataPath(dataId, null);
  }

  /**
   * Creates a RemoteDataPath instance defined by the given signed URL.
   *
   * @param [string] signedUrl - a signed URL with access to the data of
   *   interest in third-party cloud storage
   * @returns {RemoteDataPath} a RemoteDataPath instance with the given signed
   *   URL
   */
  static fromSignedUrl(signedUrl) {
    return new RemoteDataPath(null, signedUrl);
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
    return val instanceof Object && RemoteDataPath.fromObject(val).isValid;
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
        return new RemoteDataPath(obj[DATA_ID_FIELD], null);
    } else if (SIGNED_URL_FIELD in obj) {
        return new RemoteDataPath(null, obj[SIGNED_URL_FIELD]);
    }
    throw new RemoteDataPathError(
      'Invalid RemoteDataPath object: ' + JSON.stringify(obj, null, 4));
  }

  attributes_() {
    if (this.hasDataId) {
      return {dataId: DATA_ID_FIELD};
    } else if (this.hasSignedUrl) {
      return {signedUrl: SIGNED_URL_FIELD};
    }
    throw new RemoteDataPathError('Invalid RemoteDataPath')
  }
}

/**
 * Error raised when an invalid RemoteDataPath instance is found.
 */
class RemoteDataPathError extends utils.ExtendableError {}

exports.JobRequest = JobRequest;
exports.RemoteDataPath = RemoteDataPath;
