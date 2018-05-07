# Voxel51 API JavaScript Client Library

This package defines a JavaScript client library built on
[Node.js](https://nodejs.org/en) for accessing the Voxel51 Vision Services API.

The library is asynchronous and ES6+ Promise-compliant, so it is compatible
with standard `async/await`-based usage.


## Installation

> @todo update when we publish the npm package

To install the library, navigate to the project's root directory and
run:

```shell
npm install
```


## Sign-up and Authentication

To use the API, you must first create an account at [https://api.voxel51.com](
https://api.voxel51.com). Next, download an API authentication token from
[https://api.voxel51.com/authenticate](https://api.voxel51.com/authenticate).
**Keep this token private**---it is your access key to the API.

Each API request you make must be authenticated by your token. To activate your
token, set the `VOXEL51_API_TOKEN` environment variable in your shell to point
to your API token file:

```shell
export VOXEL51_API_TOKEN="/path/to/your/token.json"
```

Alternatively, you can permanently activate a token with:

```js
let voxel51api = require('@voxel51/api');

voxel51api.auth.activateToken("/path/to/your/token.json");
```

In the latter case, your token is copied to `~/.voxel51/` and will be
automatically used in all future sessions. A token can be deactivated via the
`voxel51api.auth.deactivateToken()` method.

After you have activated an API token, you have full access to the API.


## Example Usage

The following examples describe some actions you can take using the API.

To initialize an API session, issue the following commands:
```js
let voxel51api = require('@voxel51/api');

// Start an API session
let api = voxel51api.API();
```

### Algorithms

List available algorithms:
```js
(async function() {
  let algos = await api.listAlgorithms();
  console.log(algos);
})();
```

Download algorithm documentation:
```js
(async function() {
  let doc = await api.getAlgorithmDetails('<algoId>');
  console.log(doc);
})();
```

### Data

Upload data to the cloud:
```js
(async function() {
  let metadata = await api.uploadData('/path/to/video.mp4');
  console.log(metadata);
})();
```

List uploaded data:
```js
(async function() {
  let data = await api.listData();
  console.log(data);
})();
```

### Jobs

Define a valid job request JSON file. For example:
```json
{
    "algorithm": "f6275458-b39b-4933-9dca-58565500eadb",
    "inputs": {
        "raw-video": {
            "data-id": "f320a7a3-6fb3-4819-9a24-f780437675be"
        }
    },
    "parameters" : {
        "scale": 0.5,
        "fps": 5
    }
}
```

Upload a job request:
```js
(async function() {
  let jobJSONPath = '/path/to/job.json';
  let metadata = await api.uploadJobRequest(jobJSONPath, 'test-job');
  console.log(metadata);
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
(async function() {
  let status = await api.getJobStatus('<jobId>');
  console.log(status);
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
api.uploadData('/path/to/video.mp4').then(function(metadata) {
  // do something with the returned metadata
}).catch(function(error) {
  throw error;
});
```


## Generating Documentation

This project uses [JSDoc](https://github.com/jsdoc3/jsdoc) to generate its
documentation from source. To generate the documentation, run:

```shell
bash generate_docs.bash
```

To view the documentation, open the `docs/index.html` file in your browser.


## Copyright

Copyright 2018, Voxel51, LLC\
voxel51.com

David Hodgson, david@voxel51.com\
Brian Moore, brian@voxel51.com
