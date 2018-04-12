/*
 * Logger module. TODO: Remove from client library.
 *
 * Copyright 2018, Voxel51, LLC
 * voxel51.com
*/

'use strict';

exports.error = function(err) {
  return new Promise(function(resolve, reject) {
    console.log(err);
    if (err.response) {
      console.log(err.response.status);
      console.log(JSON.stringify(err.response.data, null, 2));
      // console.log(JSON.stringify(err.response.headers, null, 2));
    } else if (err.request) {
      console.log(JSON.stringify(err.request, null, 2));
    } else {
      console.log('Error', err.message);
    }
    reject(err);
  });
};
