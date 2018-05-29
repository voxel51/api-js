# Voxel51 API JavaScript Client Library

This package defines a JavaScript client library built on
[Node.js](https://nodejs.org/en) for accessing the Voxel51 Vision Services API.

The library is implemented with
[ES6-style classes](http://es6-features.org/#ClassDefinition) and uses
`async`/`await` to deliver Promised-based asynchronous execution.


## Installation

To install the library, first clone it:

```shell
git clone https://github.com/voxel51/api-javascript
cd api-javascript
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
let voxel51 = require('@voxel51/api-javascript');

voxel51.auth.activateToken("/path/to/your/api-token.json");
```

In the latter case, your token is copied to `~/.voxel51/` and will be
automatically used in all future sessions. A token can be deactivated via the
`voxel51.auth.deactivateToken()` method.

After you have activated an API token, you have full access to the API.


## Example Usage

To initialize an API session, issue the following commands:

```js
let voxel51 = require('@voxel51/api-javascript');

let api = new voxel51.API();

// Convenience function to view JSON outputs
function pprint(obj) {
    console.log(JSON.stringify(obj, null, 4));
}
```

### Analytics

List available analytics:

```js
let analytics = api.listAnalytics();
```

Get documentation for an analytic:

```js
let analyticId = 'XXXXXXXX';

api.getAnalyticDoc(analyticId).then(function(doc) {
  pprint(doc);
});
```

### Data

Upload data to the cloud:

```js
let uploadDataPath = '/path/to/video.mp4';

api.uploadData(uploadDataPath).then(function(metadata) {
  pprint(metadata);
});
```

List uploaded data:

```js
api.listData().then(function(data) {
  pprint(data);
});
```

### Jobs

List jobs you have created:

```js
api.listJobs().then(function(metadata) {
  pprint(metadata);
});
```

Create a job request:

```js
let jobRequest = new voxel51.jobs.JobRequest(analyticId);
let inputPath = voxel51.jobs.RemoteDataPath.fromDataId(dataId);
jobRequest.setInput('<input>', inputPath);
jobRequest.setParameter('<param1>', val1);
jobRequest.setParameter('<param2>', val2);

console.log(jobRequest.toString());
```

Upload a job request:

```js
api.uploadJobRequest(jobRequest, 'test-job').then(function(metadata) {
  pprint(metadata);
});
```

Get job details:

```js
let jobId = 'XXXXXXXX';

api.getJobDetails(jobId).then(function(details) {
  pprint(details);
});
```

Start a job:

```js
api.startJob(jobId).then(function(state) {
  console.log('Job started!');
});
```

Wait until a job is complete and then download its output:

```js
let jobOutputPath = '/path/to/output.zip';

api.waitUntilJobCompletes(jobId).then(function() {
  api.downloadJobOutput(jobId, jobOutputPath).then(function() {
    console.log('Download complete!');
  });
});
```

Get the status of a job:

```js
api.getJobStatus(jobId).then(function(status) {
  pprint(status);
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

Copyright 2018, Voxel51, LLC<br>
[voxel51.com](https://voxel51.com)

David Hodgson, david@voxel51.com<br>
Brian Moore, brian@voxel51.com
