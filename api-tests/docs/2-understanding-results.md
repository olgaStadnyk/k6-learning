## The End-of-test summary report
```
import http from 'k6/http';

export default function() {
  let url = 'https://httpbin.test.k6.io/post';
  let response = http.post(url, 'Hello world!');

  console.log(response.json().data);
} 
```
Here's the output:

```plain
$ k6 run test.js

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: test.js
     output: -

  scenarios: (100.00%) 1 scenario, 1 max VUs, 10m30s max duration (incl. graceful stop):
           * default: 1 iterations for each of 1 VUs (maxDuration: 10m0s, gracefulStop: 30s)

INFO[0001] Hello world!                                  source=console

running (00m00.7s), 0/1 VUs, 1 complete and 0 interrupted iterations
default ✓ [======================================] 1 VUs  00m00.7s/10m0s  1/1 iters, 1 per VU

     data_received..................: 5.9 kB 9.0 kB/s
     data_sent......................: 564 B  860 B/s
     http_req_blocked...............: avg=524.18ms min=524.18ms med=524.18ms max=524.18ms p(90)=524.18ms p(95)=524.18ms
     http_req_connecting............: avg=123.28ms min=123.28ms med=123.28ms max=123.28ms p(90)=123.28ms p(95)=123.28ms
     http_req_duration..............: avg=130.19ms min=130.19ms med=130.19ms max=130.19ms p(90)=130.19ms p(95)=130.19ms
       { expected_response:true }...: avg=130.19ms min=130.19ms med=130.19ms max=130.19ms p(90)=130.19ms p(95)=130.19ms
     http_req_failed................: 0.00%  ✓ 0        ✗ 1
     http_req_receiving.............: avg=165µs    min=165µs    med=165µs    max=165µs    p(90)=165µs    p(95)=165µs
     http_req_sending...............: avg=80µs     min=80µs     med=80µs     max=80µs     p(90)=80µs     p(95)=80µs
     http_req_tls_handshaking.......: avg=399.48ms min=399.48ms med=399.48ms max=399.48ms p(90)=399.48ms p(95)=399.48ms
     http_req_waiting...............: avg=129.94ms min=129.94ms med=129.94ms max=129.94ms p(90)=129.94ms p(95)=129.94ms
     http_reqs......................: 1      1.525116/s
     iteration_duration.............: avg=654.72ms min=654.72ms med=654.72ms max=654.72ms p(90)=654.72ms p(95)=654.72ms
     iterations.....................: 1      1.525116/s

```

This is the end-of-test summary report. It's the default way that k6 displays test results.

Let's go through it, line by line.

### Execution parameters

```plain
execution: local
```

You can use k6 OSS (Open Source Software) to run test scripts locally (`local`) or on k6 Cloud (`cloud`).
In this test, the test script was executed on your local machine.

```plain
script: test.js`
```

This is the filename of the script that was executed.

```plain
output: -`
```

This indicates the default behavior: k6 printed your test results to standard output.

k6 can also [output results in other formats](https://k6.io/docs/getting-started/results-output/#external-outputs). These options, when used, are displayed in `output`.

```plain
scenarios: (100.00%) 1 scenario, 1 max VUs, 10m30s max duration (incl. graceful stop):
```

An execution [scenario](https://k6.io/docs/misc/glossary/#scenario) is a set of instructions about running a test: what code should run, when and how often it should run, and other configurable parameters. In this case, your first test was executed using default parameters: one scenario, one [virtual user (VU)](https://k6.io/docs/misc/glossary/#virtual-user), and a max duration of 10 minutes and 30 seconds.

The max duration is the execution time limit; it is the time beyond which the test will be forcibly stopped. In this case, k6 received a response to the request in the script long before this time period elapsed.

A [graceful stop](https://k6.io/docs/misc/glossary/#graceful-stop) is a period at the end of the test when k6 finishes any running [iterations](https://k6.io/docs/misc/glossary/#iteration), if possible. By default, k6 includes a graceful stop of 30 seconds within the max duration of 10 minutes and 30 seconds.

```plain
* default: 1 iterations for each of 1 VUs (maxDuration: 10m0s, gracefulStop: 30s)
```

`default` here refers to the scenario name. Since the test script did not have any explicitly set up, k6 used the default name.

An iteration is a single execution loop of the test. Load tests typically involve repeated execution loops within a certain amount of time so that requests are continuously made. Unless otherwise specified, k6 runs through the default function once.

Think of a virtual user as a single thread or instance that attempts to simulate a real end user of your application. In this case, k6 started one virtual user to run the test.

### Console output

This section of the end-of-test summary is usually empty, but your test script included a line to save part of the response body to the console (`console.log(response.json().data);`). Here's what that looks like in the report:

```plain
INFO[0001] Hello world!                                  source=console`
```

The test script's target endpoint, `https://httpbin.test.k6.io/post` returns whatever was sent in the POST body, so this is a good sign! The target endpoint received the `Hello world!` that you sent in your script and sent the same body back.

If you had used multiple `console.log()` statements in the test script, they would all appear in this section.

### Execution summary

The execution summary shows an overview of what happened during the test run.

```plain
running (00m00.7s), 0/1 VUs, 1 complete and 0 interrupted iterations
default ✓ [======================================] 1 VUs  00m00.7s/10m0s  1/1 iters, 1 per VU
```

In this case, the test ran for 0.7 seconds with 1 VU. A single iteration was executed and fully completed (i.e., it was not interrupted). 1 iteration per VU was executed (a total of 1).

### k6 built-in metrics

Now for the [metrics](https://k6.io/docs/misc/glossary/#metric)! k6 comes with [many built-in metrics](https://k6.io/docs/using-k6/metrics/#built-in-metrics).

```plain
     data_received..................: 5.9 kB 9.0 kB/s
     data_sent......................: 564 B  860 B/s
     http_req_blocked...............: avg=524.18ms min=524.18ms med=524.18ms max=524.18ms p(90)=524.18ms p(95)=524.18ms
     http_req_connecting............: avg=123.28ms min=123.28ms med=123.28ms max=123.28ms p(90)=123.28ms p(95)=123.28ms
     http_req_duration..............: avg=130.19ms min=130.19ms med=130.19ms max=130.19ms p(90)=130.19ms p(95)=130.19ms
       { expected_response:true }...: avg=130.19ms min=130.19ms med=130.19ms max=130.19ms p(90)=130.19ms p(95)=130.19ms
     http_req_failed................: 0.00%  ✓ 0        ✗ 1
     http_req_receiving.............: avg=165µs    min=165µs    med=165µs    max=165µs    p(90)=165µs    p(95)=165µs
     http_req_sending...............: avg=80µs     min=80µs     med=80µs     max=80µs     p(90)=80µs     p(95)=80µs
     http_req_tls_handshaking.......: avg=399.48ms min=399.48ms med=399.48ms max=399.48ms p(90)=399.48ms p(95)=399.48ms
     http_req_waiting...............: avg=129.94ms min=129.94ms med=129.94ms max=129.94ms p(90)=129.94ms p(95)=129.94ms
     http_reqs......................: 1      1.525116/s
     iteration_duration.............: avg=654.72ms min=654.72ms med=654.72ms max=654.72ms p(90)=654.72ms p(95)=654.72ms
     iterations.....................: 1      1.525116/s
```

The following metrics are usually the most important for test analysis.

#### Response time

```plain
http_req_duration..............: avg=130.19ms min=130.19ms med=130.19ms max=130.19ms p(90)=130.19ms p(95)=130.19ms
```

"Response time" can be vague, because it can be broken down into multiple components. However, in most cases, `http_req_duration` is the metric you're looking for. It includes:
- `http_req_sending` (the time it took to send data to the target host)
- `http_req_waiting` (Time to First Byte or "TTFB"; the time it took before the target server began to respond to the request)
- `http_req_receiving` (the time it took for the target server to process and fully respond to k6)

The response time in this line is reported as an average, minimum, median, maximum, 90th percentile, and 95th percentile, in milliseconds (ms). If you're not sure which to use, take the 95th percentile figure.

A 95th percentile response time of 130.19 ms means that 95% of the requests had a response time of 130.19 ms or less. In this particular situation, however, your test script only made a single request, so all the metrics in this line are reporting the same value: 130.19 ms. When you run tests with multiple requests, you'll see a variation in these values.

Something to keep in mind here is that `http_req_duration` is the value for *all* requests, whether or not they passed. This behavior can cause misunderstandings when interpreting response times, because failed requests can often have a shorter or longer response time than successful ones.

The line below reports the response time for only the successful requests.

```plain
  { expected_response:true }...: avg=130.19ms min=130.19ms med=130.19ms max=130.19ms p(90)=130.19ms p(95)=130.19ms
```

To improve accuracy and prevent failed requests from skewing results, use the 95th percentile value of the successful requests as a response time.

#### Error rate

The `http_req_failed` metric describes the error rate for the test. The error rate is the number of requests that failed during the test as a percentage of the total requests.

```plain
http_req_failed................: 0.00%  ✓ 0        ✗ 1
```

`http_req_failed` automatically marks HTTP response codes of between 200 and 399. This means that HTTP 4xx and HTTP 5xx response codes are considered errors by k6 by default. (Note: This behavior can be changed using [`setResponseCallback`](https://k6.io/docs/javascript-api/k6-http/setresponsecallback-callback).)

This test run had an error rate of `0.00%`, because the single request it ran succeeded. It may seem counter-intuitive, but the `✓` on this line actually means that no requests had `http_req_failed = true`, meaning that there were no failures. Conversely, the `✗` means that 1 request had `http_req_failed = false`, meaning that it was successful.

#### Number of requests

The number of total requests sent by all VUs during the test is described in the line below.

```plain
http_reqs......................: 1      1.525116/s
```

Additionally, the number `1.525116/s` is the number of **requests per second (rps)** that the test executed throughout the test. In some tools, this is described as "test throughput". This helps you further quantify how much load your application experienced during the test.

#### Iteration duration

`http_req_duration` measures the time taken for an HTTP request within the script to get a response from the server. But what if you have multiple HTTP requests strung together in a user flow, and you'd like to know how the entire flow would take for a user?

In that case, the iteration duration is the metric to look at.

```plain
iteration_duration.............: avg=654.72ms min=654.72ms med=654.72ms max=654.72ms p(90)=654.72ms p(95)=654.72ms
```

The iteration duration is the amount of time it took for k6 to perform a single loop of your VU code. If your script included steps like logging in, browsing a product page, adding to a cart, and entering payment information, then the iteration duration gives you an idea of how long one of your application's users might take to purchase a product.

This metric could be useful when you're trying to decide on what is an acceptable response time for each HTTP request. For example, perhaps the payment request takes 2 seconds, but if the total iteration duration is still only 3 seconds, you might decide that's acceptable anyway.

Like the other metrics, the iteration duration is expressed in terms of the average, minimum, median, maximum, 90th percentile, and 95th percentile times, in milliseconds.

#### Number of iterations

The number of iterations describes how many times k6 looped through your script in total, including the iterations for all VUs. This metric can be useful when you want to verify some output associated with each iteration, such as an account signup.

```plain
iterations.....................: 1      1.525116/s
```

The number `1.525116/s` on the same line is the **iterations per second**. It describes the rate at which k6 did full iterations through the script. This, like [requests per second](03-Understanding-k6-results.md#Number-of-requests), is a measure of the speed or rate at which k6 sent messages to the application server.

## Custom summary

With handleSummary(), you can completely customize your end-of-test summary.

After your test runs, k6 aggregates your metrics into a JavaScript object. The handleSummary() function takes this object as an argument (called data in all examples here).

You can use handleSummary() to create a custom summary or return the default summary object. To get an idea of what the data looks like, run this script and open the output file, summary.json.

`k6 run api-tests/summary.js`

Fundamentally, handleSummary() is just a function that can access a data object. As such, you can transform the summary data into any text format: JSON, HTML, console, XML, and so on. You can pipe your custom summary to standard output or standard error, write it to a file, or send it to a remote server.

k6 calls handleSummary() at the end of the test lifecycle.

If handleSummary() is exported, k6 does not print the default summary. However, if you want to keep the default output, you could import textSummary from the K6 JS utilities library. For example, you could write a custom HTML report to a file, and use the textSummary() function to print the default report to the console.

```
import http from 'k6/http';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export default function () {
  http.get('https://test.k6.io');
}

export function handleSummary(data) {
  delete data.metrics['http_req_duration{expected_response:true}'];

  for (const key in data.metrics) {
    if (key.startsWith('iteration')) delete data.metrics[key];
  }

  return {
    stdout: textSummary(data, { indent: '→', enableColors: true }),
  };
}
```

## Web dashboard

k6 provides a built-in web dashboard that you can enable to visualize and monitor your tests results in real-time.

The dashboard provides a real-time overview of the performance observed by k6 **while a test is running**, and can help you identify potential reliability issues as they occur.

### How to use
The web dashboard is a built-in feature of k6. You can enable it by setting the K6_WEB_DASHBOARD environment variable to true when running your test script, for example:

```
K6_WEB_DASHBOARD=true ./k6 run script.js

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

     execution: local
        script: ../extensions/xk6-dashboard/script.js
 web dashboard: http://127.0.0.1:5665
        output: -
```
![checks](/assets/web_dashboard.png)

### Generate HTML test reports
You can generate detailed, downloadable HTML reports directly from the web dashboard or the command line. These reports are self-contained, making them ideal for sharing with your team.

To generate a report from the web dashboard, click Report on the dashboard’s menu.

**Generate report from the command line**
To automatically generate a report from the command line once the test finishes running, use the K6_WEB_DASHBOARD_EXPORT option. For example:

`K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run api-tests/thresholds.js`

![report](/assets/report1.png)
![report](/assets/report2.png)


