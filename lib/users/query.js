/**
 * Query interface for the Voxel51 Platform API.
 *
 * Copyright 2017-2019, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module users/query
 */

'use strict';

const autoBind = require('auto-bind');
const qs = require('qs');

/**
 * Base class for API queries.
 *
 * Provides support for queries with fully-customizable return fields, sorting,
 * substring searching, and record offset/limits.
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
    this.offset = null;
    this.limit = null;
    autoBind(this);
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
      self.addField(field);
    });
    return this;
  }

  /**
   * Adds all supported fields to the query.
   *
   * @returns {BaseQuery} the updated query instance
   */
  addAllFields() {
    this.addFields(this.supportedFields_);
    return this;
  }

  /**
   * Adds the given search to the query.
   *
   * The resulting query will return results where the specified field matches
   * the specified search string.
   *
   * @param {string} field - the query field on which to search
   * @param {string} searchStr - the search string
   * @returns {BaseQuery} the updated query instance
   */
  addSearch(field, searchStr) {
    if (this.isSupportedField_(field)) {
      this.search.push(`${field}:${searchStr}`);
    }
    return this;
  }

  /**
   * Adds the given "OR" search to the query.
   *
   * The resulting query will return results where the specified field matches
   * any of the specified search strings.
   *
   * @param {string} field - the query field on which to search
   * @param {string} searchStrs - the search strings to form an "or" query
   * @returns {BaseQuery} the updated query instance
   */
  addSearchOr(field, searchStrs) {
    return this.addSearch(field, searchStrs.join('|'));
  }

  /**
   * Sets the sorting behavior of the query.
   *
   * @param {string} field - the field on which to sort
   * @param {boolean} [descending=true] - whether to sort in descending order
   * @returns {BaseQuery} the updated query instance
   */
  sortBy(field, descending = true) {
    if (this.isSupportedField_(field)) {
      this.sort = `${field}:${descending ? 'desc' : 'asc'}`;
    }
    return this;
  }

  /**
   * Sets the record offset of the query.
   *
   * @param {number} offset - the desired record offset
   * @returns {BaseQuery} the updated query instance
   */
  setOffset(offset) {
    offset = Number.parseInt(offset);
    if (!isNaN(offset) && offset >= 0) {
      this.offset = offset;
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
   * Converts the query instance into an object suitable for passing to the
   * `request` library.
   *
   * @returns {object} the query object
   */
  toObject() {
    // Remove keys that are private or have falsey values
    let obj = {};
    let self = this;
    Object.keys(this).forEach(function(key) {
      let val = self[key];
      if (!key.endsWith('_') && val) {
        obj[key] = val;
      }
    });
    return obj;
  }

  /**
   * Converts the query instance into a string.
   *
   * @returns {strings} the query string
   */
  toString() {
    return qs.stringify(this.toObject());
  }

  isSupportedField_(field) {
    return this.supportedFields_.includes(field);
  }
}

/**
 * Class representing an analytics query for the API.
 *
 * Provides support for queries with fully-customizable return fields, sorting,
 * substring searching, and record offset/limits.
 *
 * @extends module:users/query~BaseQuery
 */
class AnalyticsQuery extends BaseQuery {

  /**
   * Creates a new AnalyticsQuery instance.
   *
   * @constructor
   */
  constructor() {
    super([
      'id', 'name', 'version', 'upload_date', 'description', 'scope',
      'supports_cpu', 'supports_gpu', 'pending']);
    this.all_versions = false;
    autoBind(this);
  }

  /**
   * Sets the `all_versions` parameter of the query
   *
   * @param {boolean} allVersions - whether to include all versions of each
   *   analytic in the query
   * @returns {BaseQuery} the updated query instance
   */
  setAllVersions(allVersions) {
    this.all_versions = allVersions;
    return this;
  }
}

/**
 * Class representing a data query for the API.
 *
 * Provides support for queries with fully-customizable return fields, sorting,
 * substring searching, and record offset/limits.
 *
 * @extends module:users/query~BaseQuery
 */
class DataQuery extends BaseQuery {

  /**
   * Creates a DataQuery instance.
   *
   * @constructor
   */
  constructor() {
    super([
      'id', 'name', 'encoding', 'type', 'size', 'upload_date',
      'expiration_date']);
    autoBind(this);
  }
}

/**
 * Class representing a jobs query for the API.
 *
 * Provides support for queries with fully-customizable return fields, sorting,
 * substring searching, and record offset/limits.
 *
 * @extends module:users/query~BaseQuery
 */
class JobsQuery extends BaseQuery {

  /**
   * Creates a JobsQuery instance.
   *
   * @constructor
   */
  constructor() {
    super([
      'id', 'name', 'state', 'archived', 'upload_date', 'analytic_id',
      'auto_start', 'compute_mode', 'start_date', 'completion_date',
      'fail_date', 'failure_type']);
    autoBind(this);
  }
}

exports.AnalyticsQuery = AnalyticsQuery;
exports.DataQuery = DataQuery;
exports.JobsQuery = JobsQuery;
