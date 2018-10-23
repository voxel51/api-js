/**
 * General query object wrapper for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, LLC<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module query-object-wrapper
 */

'use strict';

let constructQueryUri = require('./utils.js').constructQueryUri;

let queryObj = function makeQueryObject(permittedFields, queryFn) {
  let fields = [];
  let searches = [];
  let sortField;
  let sortDirection;
  let limit = 1000;
  console.log(queryFn);

  return Object.freeze({ // public functions
    addField,
    addSort,
    addSearch,
    setLimit,
    listFields,
    showQueryString,
    query,
  });

  /**
   * Adds a valid query field.
   *
   * @param {String} name
   */
  function addField(name) {
    if (isPermittedUniqueField(name)) {
      fields.push(String(name));
    }
  }

  function addSort(name, direction = 'asc') {
    if (isPermittedUniqueField(name)) {
      if (direction === 'asc' || direction === 'desc') {
        sortField = String(name);
        sortDirection = direction;
      }
    }
  }

  function addSearch(name, substring) {
    if (isPermittedUniqueField(name)) {
      if (typeof substring === 'string') {
        searches.push({
          field: String(name),
          substring,
        });
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

  async function showQueryString() {
    let queryObj = constructQueryObj();
    return await constructQueryUri(queryObj);
  }

  // TODO not working
  async function query() {
    let queryObj = constructQueryObject();
    return await queryFn(queryObj);
  }

  function constructQueryObject() {
    return {
      fields,
      searches,
      sort: {
        field: sortField,
        direction: sortDirection,
      },
      limit,
    };
  }

  function isPermittedUniqueField(name) {
    if (permittedFields.indexOf(name) !== -1) {
      if (fields.indexOf(name) !== -1) {
        return true;
      }
    }
    return false;
  }
};

module.exports = queryObj;
