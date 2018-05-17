/*
 * Configuration module for the API.
 *
 * Copyright 2017-2018, Voxel51, LLC
 * voxel51.com
 *
 * David Hodgson, david@voxel51.com
 * Brian Moore, brian@voxel51.com
*/

'use strict';

let os = require('os');
let path = require('path');

module.exports = {
  TOKEN_ENVIRON_VAR: "VOXEL51_API_TOKEN",
  TOKEN_PATH: path.join(os.homedir(), '.voxel51/api-token.json'),
  ACCESS_TOKEN_FIELD: "access_token",
  PRIVATE_KEY_FIELD: "private_key",
  BASE_URL: 'https://api.voxel51.com/v1',
};
