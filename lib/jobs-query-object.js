/**
 * Job query object for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, LLC<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module jobs-query-object
 */

'use strict';

let queryObject = require('./query-object.js');

let jobsQueryObj = function makeJobsQueryObject() {
  return queryObject([
    'id',
    'name',
    'state',
    'type',
    'archived',
    'date',
  ]);
};

module.exports = jobsQueryObj;
