/**
 * Utility functions for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, LLC<br>
 * voxel51.com
 *
 * Brian Moore, brian@voxel51.com
 *
 * @module utils
 */

'use strict';

let fs = require('fs');
let path = require('path');
let mkdirp = require('mkdirp');

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
 * Makes the base directory of the given path, if necessary.
 *
 * @instance
 * @param {string} filePath - a file path
 */
function ensureBaseDir(filePath) {
  let baseDir = path.basename(filePath);
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
    throw new NotImplementedError("subclass must implement fromObject()");
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
   * Subclasses may override this method, but, by default, this method simply
   * reads the JSON and calls fromObject(), which subclasses must implement.
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

exports.readJSON = readJSON;
exports.JSONToStr = JSONToStr;
exports.writeJSON = writeJSON;
exports.ensureBaseDir = ensureBaseDir;
exports.Serializable = Serializable;
exports.ExtendableError = ExtendableError;
