/**
 * Data query object for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, LLC<br>
 * {@link https://voxel51.com voxel51.com}
 *
 * @module data-query-object
 */

'use strict';

let queryObject = require('./query-object.js');

let dataQueryObj = function makeDataQueryObject() {
  return queryObject([
    'id',
    'name',
    'encoding',
    'type',
    'size',
    'date',
    'expires',
  ]);
};

module.exports = dataQueryObj;
