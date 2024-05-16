# Cloud

Besides running local tests, you can also run cloud tests:

- Grafana Cloud k6
- k6 Cloud (only available for existing customers)

![cloudk6](/assets/cloudk6.png)

Grafana Cloud k6 is a performance-testing application in your Grafana Cloud instance powered by k6 OSS.

Grafana Cloud k6 lets you leverage all of k6 capabilities, while Grafana handles the infrastructure work of scaling servers, handling distributed load zones, and storing and aggregating metrics from your tests.

### Pre Requisites
- k6 installed
- A basic k6 script.
- An IDE like Visual Studio code.

## 1. Sign Up for Grafana Cloud (Free Trial Available)

Head over to https://grafana.com/ and click on "Sign Up."
Choose a plan (the free trial is a good starting point) and create your account.

Once a verification email has been received, a team url will be displayed for the user and they will be given the option to choose a region for deploying their server.

When the finish setup button is clicked, the user will be presented with multiple options. Select performance testing.
Once in the performance testing section, select the ‘projects’ option.

In the projects section, click the start testing button.

A default project will be created. Projects are a way of grouping tests together. The user can create and delete different projects, but the default project cannot be deleted.

## 2. Authentication to k6 Cloud

To connect your scripts to Grafana k6 cloud, you can authenticate from the CLI. 

If you navigate to the settings tab in the performance testing section, there is an option to copy a personal API token.

![token](/assets/token.png)

Then enter the following command into the cli:

`k6 login cloud — token <YOUR_K6_CLOUD_API_TOKEN>`

A message in the CLI will indicate that authentication was successful.

## 3. Executing Tests on The Cloud
Now that we have established a connection with our Grafana k6 cloud, let’s move to executing our k6 scripts on the cloud. However, it is crucial to know that the script needs to be linked to a project. When we connect to our Grafana k6 cloud, it is automatically connected to the default project. However, if you wish that your tests are executed under a different project, then you need to configure that project’s ID in your script. Upon opening a project, the ID is displayed directly under the name, as shown in the image below.

![id](/assets/id.png)

Use the following code to connect your tests to a specific project:

```
export const options = {
  ext: {
    loadimpact: {
      projectID:<your project ID>,
    },
  },
};
```

Now to execute the test locally and send the output to k6 Grafana Cloud, use the following command:

`k6 run <fileName>.js — out cloud`

To execute the script on cloud, use the following command:

`k6 cloud <fileName>.js`

Now upon refreshing the projects section, the multiple test runs will show up there.

![run](/assets/cloudrun.png)

As evident in the image attached above, multiple runs of the same script can also be compared to each other side by side. This gives us an accurate picture of overall performance trends.

### Individual Test Results:
A sample of detailed results for a single test can be found in the image attached below. The graph below depicts various parameters like response time, request rate and failure rate.

![run](/assets/testrun.png)

Moreover, in the performance insights section the user is provided with a detailed overview of different metrics like number of thresholds/checks breached, details about each API call etc.

![run](/assets/runtest.png)

## Load Zones

k6 in Grafana Cloud lets you run load tests from different geographical locations (load zones). This simulates real-world traffic and tests how your application handles load and scales across various regions.

```
export const options = {
  ext: {
    loadimpact: {
      distribution: {
        distributionLabel1: { loadZone: 'amazon:us:ashburn', percent: 50 },
        distributionLabel2: { loadZone: 'amazon:ie:dublin', percent: 50 },
      },
    },
  },
};
```

Do note that whatever number of load zones you utilize, their cumulative percentage should be 100. Also bear in mind that during the free trial version only a single load zone can be utilized.
A load zone for a test run is displayed as shown in the image below

![loadzone](/assets/loadzone.png)


## cloud-default.js result

![default](/assets/cloud-default.png)
![default](/assets/cloud-default1.png)
![default](/assets/cloud-default2.png)


After running the command, the console shows an URL. Copy this URL and paste it in your browser's address bar to visualize the test results.

```
     execution: local
        script: cloud/cloud-default.js
        output: cloud (https://olha22.grafana.net/a/k6-app/runs/2768501)
```
If you deliberately abort your test (e.g. by pressing Ctrl-C), your test will end up as Aborted by User. You can still look and analyze the test data you streamed so far. The test will just have run shorter than originally planned.

# Cloud options
When executing a k6 test, you can run them locally, or in the cloud. When running tests on Grafana Cloud, you have access to additional configuration options that you can define in the options object, such as load zones, or static IP addresses.

These configuration options are optional.

### Example
In your test script, you can configure cloud options by using the options.cloud object:

```
export const options = {
  cloud: {
    name: 'Hello k6 cloud!',
    projectID: 123456,
    staticIPs: true,
    drop_metrics: ['http_req_tls_handshaking', 'http_req_waiting', 'http_req_connecting'],
    drop_tags: { '*': ['instance_id'] },
    keep_tags: { http_req_waiting: ['instance_id'] },
    distribution: {
      distributionLabel1: { loadZone: 'amazon:us:ashburn', percent: 50 },
      distributionLabel2: { loadZone: 'amazon:ie:dublin', percent: 50 },
    },
    note: 'Anything that may be worth noting about your test.',
  },
};
```

https://grafana.com/docs/grafana-cloud/testing/k6/author-run/cloud-scripting-extras/cloud-options/#options-and-syntax 

# Test results

### Performance overview
The Performance Overview section displays high-level data for your test. While the test runs, it displays live metrics.

### Indicators of good and bad results
The first sign of a good or bad result is usually in the Performance Overview panel.

#### Typical signs of a good result:

- Response time has a flat trend for the duration of the test.
- Request rates follow the same ramping pattern as Virtual Users (if VUs increase, so does the request rate).

#### Typical signs of a performance issue or bottleneck:

- Response times increase during the test.
- Response times increase, then quickly bottom out and stay flat.
- Request rates don’t increase with VUs (and response times start to increase).

### Performance insights
Below the Performance Overview panel, the Performance Insights section lists any issues that the cloud service algorithms detect. 

### Inspect logs
Logs are messages you can add to your test script to help you debug tests. You can use the following methods:

```
console.log()
console.info()
console.warn()
console.error()
console.debug()
```

Only shown when running k6 with the -v/--verbose flag.
To view all the logs for a test run, click the Logs tab. Depending on the method you’re using, a green, yellow, or red marking is displayed next to each log.

![logs](/assets/logs.png)

You can select a log message to expand it and see more details such as:

- instance_id
- level
- lz (load zone)
- source
- test_run_id

![logs](/assets/logs1.png)

### Inspect thresholds
Thresholds are the pass/fail criteria that you define for your test metrics. If the performance of the system under test (SUT) doesn’t meet the conditions of your threshold, the test finishes with a failed status.

The Thresholds tab includes a list of all the thresholds configured for that test run. A green or red marking is displayed next to each threshold to help you visualize if it passed or failed.

You can also filter the list by using the Quick select and the Add filter options.

To see visualizations for the metric, select the threshold and inspect the graph.

![thresholds](/assets/thresholds.png)