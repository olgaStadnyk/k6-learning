# API load testing

An API load test generally starts with small loads on isolated components. As your testing matures, your strategy can consider how to test the API more completely. In this process, you’ll test your API with more requests, longer durations, and on a wider test scope—from isolated components to complete end-to-end workflows.

When you design your API tests, first consider why you want to test the API at all:

- What flows or components do you want to test?
- How will you run the test?
- What criteria determine acceptable performance?

Once you can answer these questions, your API testing strategy will likely follow something like this procedure:

1. **Script the test.** Write user flows, parameterize test data, and group URLs.
2. **Assert performance and correctness.** Use Checks to assert system responses and use Thresholds to ensure that the system performs within your SLOs.
3. **Model and generate load.** Choose the executors to correctly model the workload that’s appropriate to your test goals. Make sure the load generators are located where they should be.
4. **Iterate over your test suite.** Over time, you’ll be able to reuse script logic (e.g., a user log-in flow or a throughput configuration). You’ll also be able to run tests with a wider scope or as a part of your automated testing suite.

Your load test suite should include a wide range of tests. But, when you start, start small and simple, testing individual APIs and uncomplicated integration tests.

## Determined the reason for the test
Before you configure test load, you should know what traffic patterns you want to test the API for. A load test typically aims to do one of two things:

- Validate reliability under expected traffic
- Discover problems and system limits under unusual traffic.

For example, your team might create one set of tests for frequent user flows on average traffic, and another set to find breaking points in the API. Even **if the test logic stays the same, its load might change.**

**The test goal determines the test type, which in turn determines the test load**. Consider the following test types, which correspond to different goals load profiles:

- **Smoke test**. Verify the system functions with minimal load.
- **“Average” load test**. Discover how the system functions with typical traffic.
- **Stress test**. Discover how the system functions with the load of peak traffic.
- **Spike test**. Discover how the system functions with sudden and massive increases in traffic.
- **Breakpoint test**. Progressively ramp traffic to discover system breaking points.
- **Soak test**. Discover whether or when the system degrades under loads of longer duration.

![checks](/assets/chart-load-test-types-overview.png)

> [!IMPORTANT]  
> “Start simple and test frequently. Iterate and grow the test suite”.

## Model the workload

k6 provides two broad ways to model load:

- Through **virtual users (VUs)**, to simulate concurrent users
- Through **requests per second**, to simulate raw, real-world throughput

### Virtual users
When you model load according to VUs, the basic load options are:

- vus
- duration
- iterations

You can define these options in the test script. In the following test, 50 concurrent users continuously run the default flow for 30 seconds.

```
import http from 'k6/http';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const payload = JSON.stringify({
    name: 'lorem',
    surname: 'ipsum',
  });
  const headers = { 'Content-Type': 'application/json' };
  http.post('https://httpbin.test.k6.io/post', payload, { headers });
}
```
When analyzing API endpoint performance, the load is generally reported by request rate—either requests per second or per minute.

To configure workloads according to a target request rate, use the constant arrival rate executor.

constant-arrival-rate sets a constant rate of iterations that execute the script function. Each iteration can generate one or multiple requests.

To reach a request-rate target (RequestsRate), follow this approach:

1. Set the rate frequency to the time unit of the target. Per second or per minute.
2. Get the number of requests per iteration (RequestsPerIteration).
3. Set the iteration rate to the requests per second target divided by the number of requests per iteration.

`rate = RequestsRate ÷ RequestsPerIteration.`
To reach target of 50 reqs/s with the previous example:

- Set the timeUnit options to 1s.
- The number of requests per iteration is 1.
- Set the rate option to 50/1 (so it equals 50).

```
import http from 'k6/http';

export const options = {
  scenarios: {
    my_scenario1: {
      executor: 'constant-arrival-rate',
      duration: '30s', // total duration
      preAllocatedVUs: 50, // to allocate runtime resources     preAll

      rate: 50, // number of constant iterations given `timeUnit`
      timeUnit: '1s',
    },
  },
};

export default function () {
  const payload = JSON.stringify({
    name: 'lorem',
    surname: 'ipsum',
  });
  const headers = { 'Content-Type': 'application/json' };
  http.post('https://httpbin.test.k6.io/post', payload, { headers });
}
```

This test outputs the total number of HTTP requests and RPS on the http_reqs metric:

```
# the reported value is close to the 50 RPS target
 http_reqs......................: 1501   49.84156/s

# the iteration rate is the same as rps, because each iteration runs only one request
iterations.....................: 1501   49.84156/s
```

## Verify functionality with Checks

Traditionally, performance tests care most about:

- Latency, how fast the system responds
- Availability, how often the system returns errors.

The `http_req_duration` metric reports the latency, and `http_req_failed` reports the error rate for HTTP requests. 

**Checks** validate conditions during the test execution. For example, you can use checks verify and track API responses. With checks, you can confirm expected API responses, such as the HTTP status or any returned data.

```
import { check } from 'k6';
import http from 'k6/http';

export const options = {
  scenarios: {
    my_scenario1: {
      executor: 'constant-arrival-rate',
      duration: '30s', // total duration
      preAllocatedVUs: 50, // to allocate runtime resources

      rate: 50, // number of constant iterations given `timeUnit`
      timeUnit: '1s',
    },
  },
};

export default function () {
  const payload = JSON.stringify({
    name: 'lorem',
    surname: 'ipsum',
  });
  const headers = { 'Content-Type': 'application/json' };
  const res = http.post('https://httpbin.test.k6.io/post', payload, { headers });

  check(res, {
    'Post status is 200': (r) => res.status === 200,
    'Post Content-Type header': (r) => res.headers['Content-Type'] === 'application/json',
    'Post response name': (r) => res.status === 200 && res.json().json.name === 'lorem',
  });
}
```

By default, a failed check doesn’t fail or abort the test. In this regard, a check differs from how assertions work for other types of testing.

## Test your reliability goals with Thresholds
Every test should have a goal. Engineering organizations set their reliability goals using Service Level Objectives (SLOs) to validate availability, performance, or any performance requirements.

SLOs maybe defined at distinct scopes, such as on the level of an infrastructure component, of an API, or of the entire application. Some example SLOs could be:

- That 99% of APIs returning product information respond in less than 600ms.
- That 99.99% of failed log-in requests respond in less than 1000ms.

```
export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  },
  ...
```

## Data parameterization
Data parameterization happens when you replace hard-coded test data with dynamic values. Parameterization makes it easier to manage a load test with varied users and API calls. A common case for parameterization happens when you want to use different userID and password values for each virtual user or iteration.

For example, consider a JSON file with a list of user info such as:

```
{
  "users": [
    { "username": "lorem", "surname": "ipsum" },
    { "username": "dolorem", "surname": "ipsum" }
  ]
}
```

You can parameterize the users with the SharedArray object as follows:

```
import { check } from 'k6';
import http from 'k6/http';
import { SharedArray } from 'k6/data';

const users = new SharedArray('users.json', function () {
  return JSON.parse(open('./users.json')).users;
});

export const options = {};

export default function () {
  // now, user data is not the same for all the iterations
  const user = users[Math.floor(Math.random() * users.length)];
  const payload = JSON.stringify({
    name: user.username,
    surname: user.surname,
  });

  const headers = { 'Content-Type': 'application/json' };
  const res = http.post('https://httpbin.test.k6.io/post', payload, {
    headers,
  });

  check(res, {
    'Post status is 200': (r) => res.status === 200,
    'Post Content-Type header': (r) => res.headers['Content-Type'] === 'application/json',
    'Post response name': (r) => res.status === 200 && res.json().json.name === user.username,
  });
}
```