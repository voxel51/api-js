/*
 * Module that contains function to "instantiate" a new client library
 * session.
 *
 * Usage:
 *   const API = require('./index.js');
 *   let api = API();
 *
 * Copyright 2018, Voxel51, LLC
 * voxel51.com
*/

'use strict';

let ClientLibrary = require('./lib.js');

/**
 * Main function call to "instantiate" a new client library object.
 *
 * @return {Object} New client library object for API access
 */
function API() {
  let ClientLib = Object.create(ClientLibrary);
  return ClientLib;
}

module.exports = API;
