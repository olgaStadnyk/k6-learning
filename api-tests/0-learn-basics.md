## HTTP Requests
k6 supports multiple protocols, but for now, let's stick to HTTP. 
When testers create new load test, the first step is often to define the HTTP requests to test the system with.

<details>
  <summary>details</summary>

### Make HTTP Requests
A GET request looks like this:

```
import http from 'k6/http';

export default function () {
  http.get('http://test.k6.io');
}
```

For something slightly more complex, this example shows a POST request with an email/password authentication payload:

```
import http from 'k6/http';

export default function () {
  const url = 'http://test.k6.io/login';
  const payload = JSON.stringify({
    email: 'aaa',
    password: 'bbb',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}
```
</details>

## Checks

Checks validate boolean conditions in your test. Testers often use checks to validate that the system is responding with the expected content. For example, a check could validate that a POST request has a response.status == 201, or that the body is of a certain size.

<details>
  <summary>details</summary>

Checks are similar to what many testing frameworks call an assert, but **failed checks do not cause the test to abort or finish with a failed status**. Instead, k6 keeps track of the rate of failed checks as the test continues to run.

To make a check abort or fail a test, you can combine it with a Threshold.
This is particularly useful in specific contexts, such as integrating k6 into your CI pipelines or receiving alerts when scheduling your performance tests.

### Check for HTTP response code
Checks are great for codifying assertions relating to HTTP requests and responses. 

```
import { check } from 'k6';
import http from 'k6/http';

export default function () {
  const res = http.get('http://test.k6.io/');
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}
```

### Check for text in response body
Sometimes, even an HTTP 200 response contains an error message. 
In these situations, consider adding a check to verify the response body, like this:

```
check(res, {
    'verify homepage text': (r) =>
      r.body.includes('Collection of simple web-pages suitable for load testing'),
  });
```

### See percentage of checks that passed
When a script includes checks, the summary report shows how many of the tests' checks passed:

![checks](/assets/checks.png)

### Types of Checks:

- **Equality Checks**: These verify if a value equals a specific value or falls within a certain range. (e.g., `response.status === 200`)
- **Comparison Checks**: These compare values using operators like greater than, less than, or regular expressions. (e.g., `response.body.indexOf("success") !== -1`)
- **Existence Checks**: These confirm if a property exists or if a string is not empty. (e.g., `headers.has("Content-Type")`)

### Benefits of using k6 checks:

- Improved Test Reliability: Checks ensure tests only pass when the application behaves as expected.
- Early Detection of Issues: Failures highlight potential problems during the test run, allowing for quicker fixes.
- Enhanced Test Reporting: Checks provide details about test failures, making it easier to identify and understand issues.
- Automated Test Validation: Checks enable automated test execution and pass/fail determinations.

The check function is used to define checks in your k6 script. You provide the object to be checked, a set of assertions, and optionally, tags for organization. 
</details>

## Think time

Think time is the amount of time that a script pauses during test execution to simulate delays that real users have in the course of using an application.

<details>
  <summary>details</summary>

### When should you use think time?
In general, using think time to accurately simulate end users' behavior makes a load testing script more realistic. If realism would help you achieve your test objectives, using think time can help with that.

### You should consider adding think time in the following situations:

- Your test follows a user flow, like accessing different parts of the application in a certain order
- You want to simulate actions that take some time to carry out, like reading text on a page or filling out a form
- Your load generator, or the machine you're running k6 from, displays high (> 80%) CPU utilization during test execution.

The main danger in removing or reducing think time is that it increases how quickly requests are sent, which can, in turn, increase CPU utilization. When CPU usage is too high, the load generator itself is struggling with sending the requests, which could lead to inaccurate results such as false negatives. 

### Think time is unnecessary in the following situations:

- You want to do a stress test to find out how many requests per second your application can handle
- The API endpoint you're testing experiences a high amount of requests per second in production that occur without delays
- Your load generator can run your test script without crossing the 80% CPU utilization mark.

When in doubt, use think time.

`sleep(1);` means that the script will pause for 1 second when it is executed.

Including sleep does not affect the response time (http_req_duration); the response time is always reported with sleep removed. Sleep is, however, included in the iteration duration.

**Testing best practice:** Use dynamic think time.

A dynamic think time is more realistic, and simulates real users more accurately, in turn improving the accuracy and reliability of your test results.

**Random sleep**
One way to implement dynamic think time is to use the JavaScript Math.random() function:

`sleep(Math.random() * 5);`

**Random sleep between**
If you'd prefer to define your think time in integers, try the randomIntBetween function from the k6 library of useful functions, called *jslib*.

First, import the relevant function:

`import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";`
Then, add this within your default function:

`sleep(randomIntBetween(1,5));`
The script will pause for a number of seconds between 1 and 5, inclusive of both 1 and 5.



</details>
