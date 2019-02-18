/**
 * Utility functions for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module utils
 */

'use strict';

let fs = require('fs');
let mkdirp = require('mkdirp');
let path = require('path');

/**
 * Reads JSON from file.
 *
 * @instance
 * @param {string} path - the path to a JSON file
 * @returns {object} the JSON object
 */
function readJSON(path) {
  let json = fs.readFileSync(path);
  return JSON.parse(json);
}

/**
 * Generates a string representation of the JSON object.
 *
 * @instance
 * @param {object} obj - an object that can be directly dumped to a JSON file
 * @returns {string} a string representation of the JSON object
 */
function JSONToStr(obj) {
  return JSON.stringify(obj, null, 4);
}

/**
 * Writes JSON object to file, creating the output directory if necessary.
 *
 * @instance
 * @param {object} obj - an object that can be directly dumped to a JSON file
 * @param {string} path - the output path
 */
function writeJSON(obj, path) {
  ensureBaseDir(path);
  fs.writeFileSync(path, JSONToStr(obj));
}

/**
 * Copies the input file to the output location, creating the output directory
 * if necessary.
 *
 * @instance
 * @param {string} inPath - the input file
 * @param {string} outPath - the output file location
 */
function copyFile(inPath, outPath) {
  ensureBaseDir(outPath);
  fs.copyFileSync(inPath, outPath);
}

/**
 * Makes the base directory of the given path, if necessary.
 *
 * @instance
 * @param {string} filePath - a file path
 */
function ensureBaseDir(filePath) {
  let baseDir = path.dirname(filePath);
  if (!fs.existsSync(baseDir)) {
    mkdirp.sync(baseDir);
  }
}

/**
 * Base class for objects that can be represented in JSON format.
 */
class Serializable {
  /**
   * Generates a JSON representation of the object.
   *
   * @returns {object} a JSON representation of the object
   */
  toObject() {
    let attrs = this.attributes_();
    let obj = {};
    for (var name in attrs) {
      if (this.hasOwnProperty(name)) {
        obj[attrs[name]] = _recurse(this[name]);
      }
    }
    return obj;
  }

  /**
   * Generates a string representation of the Serializable object.
   *
   * @returns {string} a string representation of the object
   */
  toString() {
    return JSONToStr(this.toObject());
  }

  /**
   * Writes the object to disk in JSON format.
   *
   * @param {string} path - the output JSON file path. The base output
   *   directory is created, if necessary
   */
  toJSON(path) {
    writeJSON(this.toObject(), path);
  }

  /**
   * Constructs a Serializable object from a JSON representation of it.
   *   Subclasses must implement this method.
   *
   * @abstract
   * @param {object} obj - a JSON representation of a Serializable subclss
   * @returns {Serializable} an instance of the Serializable subclass
   */
  static fromObject(obj) {
    throw new NotImplementedError('subclass must implement fromObject()');
  }

  /**
   * Constructs a Serializable object from a string representation of it.
   *
   * @param {string} str - a string representation of a Serializable subclass
   * @returns {Serializable} an instance of the Serializable subclass
   */
  static fromString(str) {
    return this.fromObject(JSON.parse(str));
  }

  /**
   * Constructs a Serializable object from a JSON file.
   *
   * @param {string} path - the path to a JSON file
   * @returns {Serializable} an instance of the Serializable subclass
   */
  static fromJSON(path) {
    return this.fromObject(readJSON(path));
  }

  /**
   * Returns an object describing the class attributes to be serialized.
   *
   * Subclasses may override this method, but, by default, all attributes in
   * Object.keys(this) are returned, minus private attributes (those ending
   * with '_')
   *
   * @private
   * @method attributes_
   * @returns {object} an object mapping attribute names to field names (as
   *   they should appear in the JSON file)
   */
  attributes_() {
    return Object.keys(this).reduce(
      function(attrs, name) {
        if (!name.endsWith('_')) {
          attrs[name] = name;
        }
        return attrs;
      }, {});
  }
}

function _recurse(v) {
  if (v instanceof Array) {
    return v.reduce(
      function(a, vi) {
        a.push(_recurse(vi));
        return a;
      }, []);
  } else if (v instanceof Serializable) {
    return v.toObject();
  } else if (v instanceof Object) {
    return Object.keys(v).reduce(
      function(o, name) {
        o[name] = _recurse(v[name]);
        return o;
      }, {});
  }
  return v;
}

class ExtendableError extends Error {
  constructor(message, ...args) {
    super(message, ...args);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class NotImplementedError extends ExtendableError {}

/**
 * Error raised when a timeout occurs when waiting for the API.
 */
class APITimeoutError extends ExtendableError {}

/**
 * Waits for a condition to be satisfied before returning.
 *
 * @private
 * @instance
 * @param {function} condition - an async function to periodically evaluate
 *   until it resolves
 * @param {Array} conditionArg - an array of arguments to pass to condition
 *   function call(s)
 * @param {number} sleepTime - the number of milliseconds to wait between
 *   condition checks
 * @param {number} maxWaitTime - the maximum number of milliseconds to wait
 *   for the condition to resolve
 * @returns {Promise} a Promise that resolves when the condition is met
 * @throws {APITimeoutError} if the maximum wait time is exceeded
 */
function waitForCondition(condition, conditionArgs, sleepTime, maxWaitTime) {
  return new Promise(function(resolve, reject) {
    let endTime = (new Date()).getTime() + maxWaitTime;

    async function checkCondition() {
      let result = await condition(...conditionArgs);
      if (result) {
        // Condition is satisfied
        return resolve(result);
      } else if ((new Date()).getTime() > endTime) {
        // Maximum wait time exceeded
        return reject(new APITimeoutError('Maximum wait time exceeded'));
      }
      // Wait for awhile before checking condition again
      setTimeout(checkCondition, sleepTime);
    };

    checkCondition();
  });
};

exports.readJSON = readJSON;
exports.JSONToStr = JSONToStr;
exports.writeJSON = writeJSON;
exports.ensureBaseDir = ensureBaseDir;
exports.copyFile = copyFile;
exports.Serializable = Serializable;
exports.ExtendableError = ExtendableError;
exports.NotImplementedError = NotImplementedError;
exports.APITimeoutError = APITimeoutError;
exports.waitForCondition = waitForCondition;
