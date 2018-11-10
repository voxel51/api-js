/**
 * Query interface for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, LLC<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module query
 */

'use strict';

let qs = require('qs');

/**
 * Base class for API queries.
 *
 * Provides support for queries with fully-customizable return fields, sorting,
 * substring searching, and record limits.
 */
class BaseQuery {
  /**
   * Creates a new BaseQuery instance.
   *
   * @constructor
   * @param {string} supportedFields - an array of supported query fields
   */
  constructor(supportedFields) {
    this.supportedFields_ = supportedFields;
    this.fields = [];
    this.search = [];
    this.sort = null;
    this.limit = null;
  }

  /**
   * Adds the given field to the query.
   *
   * @param {string} field - a query field to add
   * @returns {BaseQuery} the updated query instance
   */
  addField(field) {
    if (this.isSupportedField_(field)) {
      this.fields.push(field);
    }
    return this;
  }

  /**
   * Adds the given fields to the query.
   *
   * @param {array} fields - an array of query fields to add
   * @returns {BaseQuery} the updated query instance
   */
  addFields(fields) {
    let self = this;
    fields.forEach(function(field) {
      this.addField(field);
    });
    return this;
  }

  /**
   * Adds all supported fields to the query.
   *
   * @returns {BaseQuery} the updated query instance
   */
  addAllFields() {
    return this.addFields(this.supportedFields_);
  }

  /**
   * Adds the given search to the query.
   *
   * @param {string} field - the query field on which to search
   * @param {string} searchStr - the search string
   * @returns {BaseQuery} the updated query instance
   */
  addSearch(field, searchStr) {
    if (isSupportedField_(field)) {
      this.search.push(`${field}:${searchStr}`);
    }
    return this;
  }

  /**
   * Sets the sorting behavior of the query.
   *
   * @param {string} field - the field on which to sort
   * @param {boolean} [descending=true] - whether to sort in descending order
   * @returns {BaseQuery} the updated query instance
   */
  sortBy(field, descending = true) {
    if (isSupportedField_(field)) {
      this.sort = `${field}:${descending ? 'desc' : 'asc'}`;
    }
    return this;
  }

  /**
   * Sets the record limit of the query.
   *
   * @param {number} limit - the desired record limit
   * @returns {BaseQuery} the updated query instance
   */
  setLimit(limit) {
    limit = Number.parseInt(limit);
    if (!isNaN(limit) && limit > 0) {
      this.limit = limit;
    }
    return this;
  }

  /**
   * Converts the query instance into a string.
   *
   * @returns {strings} the query string
   */
  toString() {
    // Remove keys that are private or have falsey values
    let obj = {};
    Object.keys(this).forEach(function(key) {
      let val = this[key];
      if (!key.endsWith('_') && val) {
        obj[key] = val;
      }
    });

    // Generate query string
    return qs.stringify(obj);
  }

  isSupportedField_(field) {
    return this.supportedFields_.includes(field);
  }
}

/**
 * Class representing an analytics query for the API.
 *
 * Provides support for queries with fully-customizable return fields, sorting,
 * substring searching, and record limits.
 *
 * @extends module:query~BaseQuery
 */
class AnalyticsQuery extends BaseQuery {
  /**
   * Creates a new AnalyticsQuery instance.
   *
   * @constructor
   */
  constructor() {
    super(['id', 'name', 'description', 'date']);
  }
}

/**
 * Class representing a data query for the API.
 *
 * Provides support for queries with fully-customizable return fields, sorting,
 * substring searching, and record limits.
 *
 * @extends module:query~BaseQuery
 */
class DataQuery extends BaseQuery {
  /**
   * Creates a new DataQuery instance.
   *
   * @constructor
   */
  constructor() {
    super(['id', 'name', 'encoding', 'type', 'size', 'date', 'expires']);
  }
}

/**
 * Class representing a jobs query for the API.
 *
 * Provides support for queries with fully-customizable return fields, sorting,
 * substring searching, and record limits.
 *
 * @extends module:query~BaseQuery
 */
class JobsQuery extends BaseQuery {
  /**
   * Creates a new JobsQuery instance.
   *
   * @constructor
   */
  constructor() {
    super(['id', 'name', 'state', 'archived', 'date']);
  }
}

module.exports = {
  AnalyticsQuery,
  DataQuery,
  JobsQuery,
};
