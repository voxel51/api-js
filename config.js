/*
 * Configuration module that provides the base URL, API_TOKEN,
 * and authorization header for all subsequent API requests.
 *
 * Copyright 2018, Voxel51, LLC
 * voxel51.com
*/

'use strict';

let auth = require('./auth.js');

let config = {
  TOKEN: auth.setToken() || process.env.API_TOKEN,
  BASE_URL: 'https://api.voxel51.com/v1/',
};

config.HEADER = {'Authorization': 'Bearer ' + config.TOKEN};

module.exports = config;
