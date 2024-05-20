# Load testing with GitHub Actions

## Setting up the GitHub Actions workflow

To have GitHub Actions pick up and execute our load test, we need to create a workflow configuration and place it in .github/workflows. Once this file has been pushed to our repository, each commit to our repository will result in the workflow being run.

```
k6_load_test:
  name: k6 Load Test
  runs-on: ubuntu-latest

  steps:
    - name: Checkout
      uses: actions/checkout@v1

    - name: Run local k6 test
      uses: grafana/k6-action@v0.2.0
      with:
        filename: cicd/cicd.md
  ```

## Running cloud tests

There are two common execution modes to run k6 tests as part of the CI process.

- Locally on the CI server.
- In Grafana Cloud k6, from one or multiple geographic locations.

You might want to use cloud tests in these common cases:

- If you’re going to run a test from multiple geographic locations (load zones).
- If you’re going to run a high-load test, that will need more compute resources than available in the runner.

Now, we will show how to trigger cloud tests using GitHub Actions. If you do not have an account with Grafana Cloud already, you should go and start your free trial.

After that, get your account token and add this token to your GitHub project’s Secrets page.

```
k6_cloud_test:
  name: k6 cloud test run
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v1

    - name: Run k6 cloud test
      uses: k6io/action@v0.1
      with:
        filename: test.js
        cloud: true
        token: ${{ secrets.K6_CLOUD_API_TOKEN }}
```

As you can see, the only changes needed in our workflow file is setting cloud to true and passing our API token to the action.

Once we commit and push these changes, k6 will now run the cloud test, and output the URL to our test results as part of the workflow logs.

![cli result](/assets/cloud-cicd.png)

## Storing test results as artifacts

```
on: [push]

jobs:
  k6_load_test:
    name: k6 Load Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v1

      - name: Run local k6 test
        uses: grafana/k6-action@v0.2.0
        with:
          filename: test.js
          flags: --out json=results.json

      - name: Upload performance test results
        uses: actions/upload-artifact@v3
        with:
          name: k6-report
          path: results.json
```

The results.json file will provide all the metric points collected by k6. Depending on the load options specified, the file can get quite large. Storing it on GitHub is convenient if you don’t need to analyze the raw data right away.

## Using handleSummary callback for test summary

k6 can also report the general overview of the test results (end of the test summary) in a custom file. To accomplish this, we will need to export a handleSummary function as demonstrated in the code snippet below:

```
import { sleep } from 'k6';
import http from 'k6/http';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export const options = {
  duration: '.5m',
  vus: 5,
  iterations: 10,
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<500'], // 95 percent of response times must be below 500ms
  },
};

export default function () {
  http.get('http://test.k6.io/contacts.php');
  sleep(3);
}

export function handleSummary(data) {
  console.log('Finished executing performance tests');

  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout...
    'summary.json': JSON.stringify(data), // and a JSON with all the details...
  };
}
```

In the handleSummary callback, we have specified the summary.json file to store the results. Below is an example of a GitHub workflow that demonstrates how to upload the summary results to GitHub:

```
name: Summary Workflow
on: [push]

jobs:
  k6_local_test:
    name: k6 local test run - summary example
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v1

      - name: Run local k6 test
        uses: grafana/k6-action@v0.2.0
        with:
          filename: src/summary_test.js

      - name: Store performance test results
        uses: actions/upload-artifact@v3
        with:
          name: k6-summary-report
          path: summary.json
```

## Using a different runner

### Using a Windows runner

```
on: [push]

jobs:
  k6_local_test:
    name: k6 local test run on windows
    runs-on: windows-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v1

      - name: download and extract k6 release binaries
        run: |
          curl -L https://github.com/grafana/k6/releases/download/v0.26.2/k6-v0.26.2-win64.zip -o k6.zip
          7z.exe e k6.zip
        shell: bash

      - name: k6 test
        run: ./k6.exe run ./test.js
        shell: bash
```

### Using a macOS runner

```
on: [push]

jobs:
  k6_local_test:
    name: k6 local test on macos
    runs-on: macos-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v1

      - name: Install k6 by homebrew
        run: brew install k6

      - name: Local k6 test
        run: k6 run ./test.js
```

The brew package manager is the best tool for grabbing and installing the latest version of k6 whenever the workflow is run.

## Nightly builds

It’s common to run some performance tests during the night when users do not access the system under test. For example, this can be helpful to isolate more extensive tests from other types of testing or to generate a performance report periodically.

To configure a scheduled nightly build that runs at a given time, head over to your GitHub action workflow and update the on section. Here is an example that triggers the workflow every 15 minutes:

```
on:
  schedule:
    # * is a special character in YAML, so you have to quote this string
    - cron: '*/15 * * * *'
```
https://crontab.guru/examples.html 

Simply save, commit, and push the file. GitHub will take care of running the workflow at the time intervals you specified.