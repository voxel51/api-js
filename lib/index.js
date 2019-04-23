/*
 * Main module for the Voxel51 Platform API.
 *
 * Copyright 2017-2019, Voxel51, Inc.<br>
 * {@link https://voxel51.com voxel51.com}
 */

'use strict';

exports.users = {
    api: require('./users/api.js'),
    auth: require('./users/auth.js'),
    jobs: require('./users/jobs.js'),
    query: require('./users/query.js'),
    utils: require('./users/utils.js'),
};

exports.apps = {
    api: require('./apps/api.js'),
    auth: require('./apps/auth.js'),
};
