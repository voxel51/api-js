# Voxel51 API JavaScript Client Library

This package defines a JavaScript client library built on
[Node.js](https://nodejs.org/en) for interacting with the Voxel51 Vision
Services Platform.

The library is implemented with
[ES6-style classes](http://es6-features.org/#ClassDefinition) and uses
`async`/`await` to deliver Promised-based asynchronous execution.


## Installation

To install the library, first clone it:

```shell
git clone https://github.com/voxel51/api-js
cd api-js
```

and then install the package:

```shell
npm ci
```


## Documentation

For full documentation of the Voxel51 Vision Services API, including usage of
this client library, see https://console.voxel51.com/docs/api.

To learn how to use this client library to create and run jobs that execute
each of the analytics exposed on the Voxel51 Vision Services Platform, see
https://console.voxel51.com/docs/analytics.


## User Quickstart

This section provides a brief guide to using the Vision Services API with your
user account.

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

voxel51.auth.activateToken('/path/to/your/api-token.json');
```

In the latter case, your token is copied to `~/.voxel51/` and will be
automatically used in all future sessions. A token can be deactivated via the
`voxel51.auth.deactivateToken()` method.

After you have activated an API token, you have full access to the API.

### Creating an API Session

To initialize an API session, issue the following commands:

```js
let voxel51 = require('.');

let api = new voxel51.API();
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
let jobRequest = new voxel51.jobs.JobRequest('<analytic>');
let inputPath = voxel51.jobs.RemoteDataPath.fromDataId('<data-id>');
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


## Application Quickstart

This section provides a brief guide to using the Vision Services API with your
application admin account.

### Sign-up and Authentication

To use the API with your application, you must first download an API token from
your application admin account at https://console.voxel51.com/admin and
download an API token.

> Keep your API token private; it is your access key to the API.

Each API request you make must be authenticated by your application token. To
activate your application token, set the `VOXEL51_APP_TOKEN` environment
variable in your shell to point to your API token file:

```shell
export VOXEL51_APP_TOKEN="/path/to/your/app-token.json"
```

Alternatively, you can permanently activate an application token by executing
the following commands:

```js
let voxel51 = require('.');

voxel51.appsAuth.activateApplicationToken('/path/to/your/app-token.json');
```

In the latter case, your token is copied to `~/.voxel51/` and will be
automatically used in all future sessions. An application token can be
deactivated via the `voxel51.appsAuth.deactivateApplicationToken()` method.

After you have activated an application API token, you have full access to the
API.

### Creating an Application API Session

To initialize an API session for your application, issue the following
commands:

```js
let voxel51 = require('.');

let api = new voxel51.ApplicationAPI();
```

### User Management

The application API provides methods to manage the users of your application.

For example, you can list the current users of your application:

```js
api.listUsers().then(function(users) {
  // Use users
});
```

Create a new user:

```py
api.createUser('<username>');
```

And update the usage limits of a user:

```py
// The new limits to apply for the user
limits = {
    <limit-name>: <limit-value>,
    ...
}

api.updateUserUsageLimits('<username>', limits);
```

### Performing User Actions

To perform actions for a user of your application, you must first activate the
user:

```py
// Activate an application user
api.withUser('<username>');
```

With a user activated, all subsequent API requests will be applied to that
user. To deactivate the user, use the `api.exitUser()` method.

For example, you can upload data for the user:

```js
// Local path to the data
let dataPath = '/path/to/video.mp4';

api.uploadData(dataPath);
```

And run a job on the user's data:

```js
let jobRequest = new voxel51.jobs.JobRequest('<analytic>');
let inputPath = voxel51.jobs.RemoteDataPath.fromDataId('<data-id>');
jobRequest.setInput('<input>', inputPath);
jobRequest.setParameter('<param>', val);
api.uploadJobRequest(jobRequest, '<job-name>', true);
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
