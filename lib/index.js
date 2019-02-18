/*
 * Main module for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2019, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 */

'use strict';

exports.API = require('./api.js');
exports.auth = require('./auth.js');
exports.jobs = require('./jobs.js');
exports.query = require('./query.js');
exports.utils = require('./utils.js');

exports.ApplicationAPI = require('./apps/api.js');
exports.appsAuth = require('./apps/auth.js');
