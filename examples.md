# Examples

Example uses of the JavaScript Client Library to run analytics in the cloud on
the Voxel51 Vision Services Platform.

All of the following examples assume that you have activated a valid API token
either by setting the `VOXEL51_API_TOKEN` environment variable in your shell or
permanently activating it via `voxel51.auth.activateToken()`.


## vehicle-detector

The following code will upload the `road.mp4` video from your current working
directory to the Voxel51 Vision Services Platform, run the `vehicle-detector`
analytic on it, and download the output to `output.zip` when the job completes.

You can download this [dashcam video clip](
https://drive.google.com/file/d/1gg6zJpp8j_ZiUaAy3Sdl3VvD5zUq9LX7) to use as
an example input if you would like.

```js
let voxel51 = require('.');

// Create an API session
let api = new voxel51.API();

// Upload data
let dataId;
api.uploadData('road.mp4').then(function(metadata) {
  dataId = metadata.data_id;
});

// Upload job request
let jobId;
let jobRequest = new voxel51.jobs.JobRequest('vehicle-detector');
let remotePath = voxel51.jobs.RemoteDataPath.fromDataId(dataId);
jobRequest.setInput('video', remotePath);
api.uploadJobRequest(jobRequest, 'detect-vehicles').then(function(metadata) {
  jobId = metadata.job_id;
});

// Run job
api.startJob(jobId);

// Wait until job completes, and then download the output
api.waitUntilJobCompletes(jobId).then(function() {
  api.downloadJobOutput(jobId, 'output.zip');
});
```

Unzip the downloaded `output.zip` file to inspect the result of the job.
