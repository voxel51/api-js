/*
 * Utility functions for the Voxel51 Vision Services API.
 *
 * Copyright 2017-2018, Voxel51, LLC
 * voxel51.com
 *
 * Brian Moore, brian@voxel51.com
*/

'use strict';

let fs = require('fs');
let path = require('path');
let mkdirp = require('mkdirp');

exports.ensureBaseDir = function(filePath) {
  let baseDir = path.basename(filePath);
  if (!fs.existsSync(baseDir)) {
    mkdirp.sync(baseDir);
  }
}
