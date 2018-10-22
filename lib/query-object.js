'use strict';

let queryObj = function({
  permittedFields,
  queryFn,
} = {}) {
  let fields = [];
  let searchFields = [];
  let searchSubstrings = [];
  let sortField;
  let sortDirection;
  let limit = 1000;

  return Object.freeze({ // public functions
    addField,
    addSort,
    addSearch,
    setLimit,
    listFields,
    showQueryString,
    query,
  });

  function addField(name) {
    if (permittedFields[name] !== undefined) {
      if (fields.indexOf(name) !== -1) {
        fields.push(name);
      }
    }
  }

  function addSort(name, direction = 'asc') {
    if (permittedFields[name] !== undefined) {
      if (fields.indexOf(name) !== -1) {
        if (direction === 'asc' || direction === 'desc') {
          sortField = name;
          sortDirection = direction;
        }
      }
    }
  }

  function addSearch(name, substring) {
    if (permittedFields[name] !== undefined) {
      if (fields.indexOf(name) !== -1) {
        if (typeof substring === 'string') {
          searchFields.push(name);
          searchSubstrings.push(substring);
        }
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

  function showQueryString() {
    // TODO call function to generate query string
    /*
     * let queryObj = constructQueryObj();
     * return generateQueryUri(queryObj);
     */
  }

  function query() {
    let queryObj = constructQueryObject();
    return Promise.resolve(queryFn(queryObj));
  }

  function constructQueryObject() {
    return {
      fields:
      search: {
        fields: searchFields,
        substrings: searchSubstrings,
      },
      sort: {
        field: sortField,
        direction: sortDirection,
      },
      limit,
    };
  }
};

module.exports = queryObj;
