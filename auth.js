/*
 * Authorization module of JS client library. Checks for a set
 * API_TOKEN environment variable. If not present, throws error.
 *
 * Copyright 2018, Voxel51, LLC
 * voxel51.com
*/

'use strict';

let auth = {
  setToken: function setToken() {
    this.token = process.env.API_TOKEN || undefined;
    if (!this.token) {
      throw new Error('API_TOKEN is undefined: ' + process.env.API_TOKEN);
    }
    return this.token;
  },
};

module.exports = auth;
