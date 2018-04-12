# Voxel51 JavaScript Client Library
>
> Copyright 2017-2018, Voxel51, LLC.
>
> David Hodgson, david@voxel51.com
>

This package defines a JavaScript client library for accessing the Voxel51
Vision Services API.

This library is Promise-based and thus compatibile with standard
`async/await`-based usage. It defines no callbacks, so JavaScript ES6+ or
proper pollyfills are required.


## Installation

> TODO: add npm installation instructions


## Sign-up and Authentication

To use the API, you must first create an account at [https://api.voxel51.com](
https://api.voxel51.com). Next, download an API authentication token from
[https://api.voxel51.com/authenticate](https://api.voxel51.com/authenticate).
**Keep this token private**---it is your access key to the API.

Each API request you make must be authenticated by your token. To activate your
token, set the `API_TOKEN` environment variable in your shell to the private
key of your token:

```shell
export API_TOKEN="XXXXXXXXXXXX"
```


## Example Usage

The following examples describe some actions you can take using the API.

To initialize an API session, issue the following commands from a Node REPL:
```js
const API = require('./index.js');

// Start an API session
let api = API();
```

### Data

Upload data to the cloud:
```js
(async function() {
  let res = await api.uploadData('water.mp4');
  console.log(res.statusCode, res.body);
})();
```

List uploaded data:
```js
(async function() {
  let res = await api.listData();
  console.log(res.statusCode, res.body);
})();
```

### Algorithms

List available algorithms:
```js
(async function() {
  let res = await api.listAlgorithms();
  console.log(res.statusCode);
  console.log(JSON.stringify(res.body, null, 2));
})();
```

Download algorithm documentation:
```js
(async function() {
  let res = await api.getAlgorithmInfo('f6275458-b39b-4933-9dca-58565500eadb');
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
  let res = await api.createJob('job.json', 'node-demo', 'false');
  console.log(res.statusCode, res.body);
})();
```

Start a job:
```js
(async function() {
  let res = await api.startJob('b2db6869-36fe-4960-a8a7-7622de7ba660');
  console.log(res.statusCode, res.body);
})();
```

Get the status of a job:
```js
(async function() {
  let res = await api.getJobStatus('b2db6869-36fe-4960-a8a7-7622de7ba660');
})();
```

Download the output of a completed job:
```js
(async function() {
  let res = await api.getJobOutput(
    'b2db6869-36fe-4960-a8a7-7622de7ba660', 'node-demo.zip');
  console.log('Done');
})();
```


## Promise Chain Example

This library is ES6+ Promise-compliant. The following shows a non-`async/await`
example of a data upload request:
```js
api.uploadData('/path/to/video.mp4').then(function(res) {
  // res contains the JSON response;
  // do something with it...
}).catch(function(error) {
  throw error;
});
```


## Error Handling

It is strongly recommended to wrap any `async/await` calls with `try/catch`
blocks to ensure all exceptions and errors are captured. These were omitted
from the examples above for brevity.
