/**
 * General query object wrapper for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, LLC<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module query-object-wrapper
 */

'use strict';

let qs = require('qs');
let constructQueryUri = require('./utils.js').constructQueryUri;

let queryObj = function makeQueryObject(permittedFields) {
  let fields = [];
  let search = [];
  let sort;
  let limit = 1000;

  return Object.freeze({ // public functions
    addField,
    addSort,
    addSearch,
    setLimit,
    listFields,
    toQueryString,
    toQueryObject,
  });

  /**
   * Adds a valid query field.
   *
   * @param {String} name
   */
  function addField(name) {
    if (isPermittedField(name)) {
      if (fields.indexOf(name) === -1) {
        fields.push(String(name));
      }
    }
  }

  function addSort(name, direction = 'asc') {
    if (isPermittedField(name)) {
      if (direction === 'asc' || direction === 'desc') {
        sort = `${String(name)}:${direction}`;
      }
    }
  }

  function addSearch(name, substring) {
    if (isPermittedField(name)) {
      if (typeof substring === 'string') {
        search.push(`${String(name)}:${substring}`);
      }
    }
  }

  function setLimit(value) {
    let cleanVal = Number.parseInt(value);
    if (isNumber(cleanVal) && !(isNaN(cleanVal)) && value > 0) {
      limit = cleanVal;
    }
  }

  function listFields() {
    return permittedFields;
  }

  function toQueryString(encode = false) {
    let queryObj = toQueryObject();
    return qs.stringify(queryObj, {encode});
  }

  function toQueryObject() {
    return {
      fields,
      search,
      sort,
      limit,
    };
  }

  function isPermittedField(name) {
    return permittedFields.indexOf(name) !== -1;
  }
};

module.exports = queryObj;
