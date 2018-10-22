/**
 * Analytics query object for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, LLC<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module analytics-query-object
 */

'use strict';

let queryAnalytics = require('./api.js').queryAnalytics;
let queryObject = require('./query-object.js');

let analyticsQueryObj = function makeAnalyticsQueryObject() {
  return queryObject([
    'id',
    'name',
    'description',
    'date',
  ], queryAnalytics);
};

module.exports = analyticsQueryObj;
