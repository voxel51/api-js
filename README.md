# Voxel51 Platform API JavaScript Client Library

A JavaScript client library built on [Node.js](https://nodejs.org/en) for
interacting with the Voxel51 Platform.

Available at [https://github.com/voxel51/api-js](https://github.com/voxel51/api-js).

The library is implemented with [ES6-style classes](http://es6-features.org/#ClassDefinition)
and uses `async`/`await` to deliver Promised-based asynchronous execution.

<img src="https://drive.google.com/uc?id=1j0S8pLsopAqF1Ik3rf-CdyAIU4kA0sOP" alt="voxel51-logo.png" width="40%"/>


## Installation

To install the library, first clone it:

```shell
git clone https://github.com/voxel51/api-js
cd api-js
```

and then run the install script:

```shell
bash install.bash
```


## Documentation

For full documentation of the Voxel51 Platform API, including usage of this
client library, see the [API Documentation](https://voxel51.com/docs/api).

To learn how to use this client library to create and run jobs that execute
each of the analytics exposed on the Voxel51 Platform, see the
[Analytics Documentation](https://voxel51.com/docs/analytics).


## User Quickstart

This section provides a brief guide to using the Platform API with your user
account.

### Sign-up and Authentication

To use the API, you must first create an account at https://console.voxel51.com
and download an API token.

Each API request you make must be authenticated by your token. To activate your
token, set the `VOXEL51_API_TOKEN` environment variable in your shell to point
to your API token file:

```shell
export VOXEL51_API_TOKEN="/path/to/your/api-token.json"
```

Alternatively, you can permanently activate a token by executing the following
commands:

```js
let voxel51 = require('.');

voxel51.users.auth.activateToken('/path/to/your/api-token.json');
```

In the latter case, your token is copied to `~/.voxel51/` and will be
automatically used in all future sessions. A token can be deactivated via the
`voxel51.users.auth.deactivateToken()` method.

After you have activated an API token, you have full access to the API.

### Creating an API Session

To initialize an API session, issue the following commands:

```js
let voxel51 = require('.');

let api = new voxel51.users.api.API();
```

### Analytics

List available analytics:

```js
api.listAnalytics().then(function(analytics) {
  // Use analytics
});
```

Get documentation for the analytic with the given ID:

```js
// ID of the analytic
let analyticId = 'XXXXXXXX';

api.getAnalyticDoc(analyticId).then(function(doc) {
  // Use doc
});
```

### Data

Upload data to the cloud storage:

```js
// Local path to the data
let dataPath = '/path/to/video.mp4';

api.uploadData(dataPath);
```

List uploaded data:

```js
api.listData().then(function(data) {
  // Use data
});
```

### Jobs

List jobs you have created:

```js
api.listJobs().then(function(jobs) {
  // Use jobs
});
```

Create a job request to perform an analytic on a data, where `<analytic>` is
the name of the analytic to run, `<data-id>` is the ID of the data to process,
and any `<param>` values are set as necessary to configre the analytic:

```js
let jobRequest = new voxel51.users.jobs.JobRequest('<analytic>');
let inputPath = voxel51.users.jobs.RemoteDataPath.fromDataId('<data-id>');
jobRequest.setInput('<input>', inputPath);
jobRequest.setParameter('<param>', val);

console.log(jobRequest.toString());
```

Upload a job request:

```js
api.uploadJobRequest(jobRequest, '<job-name>');
```

Start a job:

```js
// ID of the job
let jobId = 'XXXXXXXX';

api.startJob(jobId);
```

Wait until a job is complete and then download its output:

```js
// Local path to which to download the output
let outputPath = '/path/to/output.zip';

api.waitUntilJobCompletes(jobId).then(function() {
  api.downloadJobOutput(jobId, outputPath).then(function() {
    console.log('Download complete!');
  });
});
```

Get the status of a job:

```js
api.getJobStatus(jobId).then(function(status) {
  // Use status
});
```

Download the output of a completed job:

```js
// Local path to which to download the output
let outputPath = '/path/to/labels.json';

api.downloadJobOutput(jobId, outputPath).then(function() {
  console.log('Download complete!');
});
```


## Improving Request Efficiency

A common pattern when interacting with the platform is to perform an operation
to a list of data or jobs. In such cases, you can dramatically increase the
efficiency of your code by taking advantage of the Promise-based nature of this
library.

For example, the following code will run VehicleSense on a list of videos using
`Promise.all` to wait for the asynchronous requests to complete:

```js
let voxel51 = require('.');

let api = new voxel51.users.api.API();

async function runVehicleSense(paths) {
  // Upload all data
  let allData = await Promise.all(paths.map(api.uploadData));

  // Run VehicleSense jobs
  let promises = [];
  allData.forEach(function(data) {
    let jobRequest = new voxel51.users.jobs.JobRequest('voxel51/vehicle-sense');
    let remotePath = voxel51.users.jobs.RemoteDataPath.fromDataId(data.id);
    jobRequest.setInput('video', remotePath);
    let jobName = `vehicle-sense-${data.name}`;
    promises.push(api.uploadJobRequest(jobRequest, jobName, true));
  });

  return await Promise.all(promises);
}

// Run VehicleSense on all videos
let paths = ['1.mp4', '2.mp4', '3.mp4', ...];
let jobs = await runVehicleSense(paths);
```

Or, the following code will start all unstarted jobs on the platform, using
`Promise.all` to wait for the asynchronous requests to complete:

```js
let voxel51 = require('.');

let api = new voxel51.users.api.API();

async function startAllJobs() {
  // Get all unarchived jobs
  let jobsQuery = (new voxel51.users.query.JobsQuery()
    .addAllFields()
    .addSearch('archived', false));
  let result = await api.queryJobs(jobsQuery);
  let jobs = result.jobs;

  // Start all unstarted jobs
  let promises = [];
  jobs.forEach(function(job) {
    if (job.state === voxel51.users.jobs.JobState.READY) {
      promises.push(api.startJob(job.id));
    }
  });

  Promise.all(promises);
}

await startAllJobs();
```


## Generating Documentation

This project uses [JSDoc](https://github.com/jsdoc3/jsdoc) to generate its
documentation from source. To generate the documentation, run:

```shell
bash docs/generate_docs.bash
```

To view the documentation, open the `docs/build/index.html` file in your
browser.


## Copyright

Copyright 2017-2019, Voxel51, Inc.<br>
[voxel51.com](https://voxel51.com)
