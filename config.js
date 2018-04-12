/*
 * Configuration module that provides the base URL, API_TOKEN,
 * and authorization header for all subsequent API requests.
 *
 * Copyright 2018, Voxel51, LLC
 * voxel51.com
*/

'use strict';

let Authorization = require('./auth.js');

let Config = {
  TOKEN: Authorization.setToken() || process.env.API_TOKEN,
  URI: 'https://api.voxel51.com/v1/',
};

Config.HEADER = {
  'Authorization': 'Bearer ' + Config.TOKEN,
};

module.exports = Config;
