# Voxel51 API JavaScript Client Library

This package defines a JavaScript client library built on
[Node.js](https://nodejs.org/en) for accessing the Voxel51 Vision Services API.

The library is asynchronous and ES6+ Promise-compliant, so it is compatible
with standard `async/await`-based usage.


## Installation

To install the library, first clone it:

```shell
git clone https://github.com/voxel51/api-js
cd api-js
```

and then install the package:

```shell
npm install
```


## Sign-up and Authentication

To use the API, you must first create an account at
[https://console.voxel51.com](https://console.voxel51.com) and download an API
token. **Keep this token private**. It is your access key to the API.

Each API request you make must be authenticated by your token. To activate your
token, set the `VOXEL51_API_TOKEN` environment variable in your shell to point
to your API token file:

```shell
export VOXEL51_API_TOKEN="/path/to/your/api-token.json"
```

Alternatively, you can permanently activate a token with:

```js
let voxel51 = require('@voxel51/api');

voxel51.auth.activateToken("/path/to/your/api-token.json");
```

In the latter case, your token is copied to `~/.voxel51/` and will be
automatically used in all future sessions. A token can be deactivated via the
`voxel51.auth.deactivateToken()` method.

After you have activated an API token, you have full access to the API.


## Example Usage

The following examples describe some actions you can take using the API.

To initialize an API session, issue the following commands:

```js
let voxel51 = require('@voxel51/api');

let api = new voxel51.API();
```

### Analytics

List available analytics:

```js
let analytics = (async function() {
  return await api.listAnalytics();
})();
```

Get documentation for an analytic:

```js
let doc = (async function() {
  return await api.getAnalyticDoc('<analyticId>');
})();
```

### Data

Upload data to the cloud:

```js
let metadata = (async function() {
  return await api.uploadData('/path/to/video.mp4');
})();
```

List uploaded data:

```js
let data = (async function() {
  return await api.listData();
})();
```

### Jobs

Upload a job request:

```js
// Create a job request
let jobRequest = new voxel51.jobs.JobRequest('<analyticId>');
let inputPath = voxel51.jobs.RemoteDataPath.fromDataId('<dataId>');
jobRequest.setInput("<input>", inputPath);
jobRequest.setParameter("<param1>", val1);
jobRequest.setParameter("<param2>", val2);

// Upload the request
let metadata = (async function() {
  return await api.uploadJobRequest(jobRequest, 'test-job');
})();
```

Start a job:

```js
(async function() {
  await api.startJob('<jobId>');
})();
```

Get the status of a job:

```js
let status = (async function() {
  return await api.getJobStatus('<jobId>');
})();
```

Download the output of a completed job:

```js
(async function() {
  await api.downloadJobOutput('<jobId>', 'output.zip');
})();
```


## Asynchronous Execution

This library is ES6+ Promise-compliant, so you can use it to interact
asynchronously with the API server. For example, the following code shows how
to perform an asynchronous data upload request:

```js
api.uploadData('/path/to/video.mp4').then(
  function(metadata) {
    // do something with the returned metadata
  }
).catch(
  function(error) {
    throw error;
  }
);
```


## Generating Documentation

This project uses [JSDoc](https://github.com/jsdoc3/jsdoc) to generate its
documentation from source. To generate the documentation, run:

```shell
bash generate_docs.bash
```

To view the documentation, open the `docs/index.html` file in your browser.


## Copyright

Copyright 2018, Voxel51, LLC<br>
voxel51.com

David Hodgson, david@voxel51.com<br>
Brian Moore, brian@voxel51.com
