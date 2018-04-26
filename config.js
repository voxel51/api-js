/*
 * Configuration module that provides the base URL, token environment variable,
 * and authorization header for the API.
 *
 * Copyright 2017-2018, Voxel51, LLC
 * voxel51.com
 *
 * David Hodgson, david@voxel51.com
*/

'use strict';

let auth = require('./auth.js');

let config = {
  TOKEN: auth.setToken() || process.env.VOXEL51_API_TOKEN,
  BASE_URL: 'https://api.voxel51.com/v1/',
};

config.HEADER = {'Authorization': 'Bearer ' + config.TOKEN};

module.exports = config;
