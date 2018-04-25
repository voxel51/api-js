/*
 * Authorization module of JS client library. Checks for a set
 * API_TOKEN environment variable. If not present, throws error.
 *
 * Copyright 2018, Voxel51, LLC
 * voxel51.com
*/

'use strict';

let fs = require('fs');

let auth = {
  setToken: function setToken() {
    this.tokenFile = process.env.VOXEL51_API_TOKEN || "~/.voxel51/api-token.json";
    if (!fs.existsSync(this.token)) {
      throw new Error('Set VOXEL51_API_TOKEN to credentials or move to ' + 
        '~/.voxel51/api-token.json.');
    } else {
      let file = fs.readFileSync(this.tokenFile);
      let data = JSON.parse(file);
      this.token = data.private_key;
      return this.token;
    }
  },
};

module.exports = auth;
