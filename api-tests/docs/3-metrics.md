# Metrics

In k6, metrics are a fundamental concept for measuring and analyzing the performance of your application under load during testing. They provide valuable insights into various aspects of your system's behavior.

By default, k6 automatically collects built-in metrics. Besides built-ins, you can also make custom metrics.

Types of Metrics in k6:

**Built-in Metrics**: k6 automatically collects several built-in metrics for each virtual user (VU) during the test. These metrics include:
- HTTP request durations and status codes
- Number of active VUs
- Iteration durations
- Throughput (requests per second)

**Custom Metrics**: You can define custom metrics within your k6 script to track specific aspects of your application's behavior. These metrics can be  anything relevant to your testing goals, such as:
- Database query execution times
- User login success rates
- Resource utilization (CPU, memory)

## Metrics fall into four broad types:

- Counters sum values.
- Gauges track the smallest, largest, and latest values.
- Rates track how frequently a non-zero value occurs.
- Trends calculates statistics for multiple values (like mean, mode or percentile).

## What metrics to look at?
Each metric provides a different perspective on performance. So the best metric for your analysis depends on your goals.

However, if you're unsure about the metrics to focus on, you can start with the metrics that measure the requests, errors, and duration (the criteria of the RED method).

- `http_reqs`, to measure requests
- `http_req_failed`, to measure error rate
- `http_req_duration`, to measure duration


In the cli output, all the metrics that start with `http`, `iteration`, and `vu` are built-in metrics, which get written to stdout at the end of a test. 

## Benefits of Using Metrics:

- **Performance Analysis**: Metrics provide data to analyze different aspects of your application's performance under load. You can identify bottlenecks, resource usage patterns, and response time distributions.
- **Test Insights**: Metrics offer insights into user behavior within the test. You can track user login attempts, API usage patterns, and overall application usage trends.
- **Comparison and Visualization**: Metrics enable comparison between different test runs or scenarios. You can visualize metrics using tools like Grafana to gain deeper understanding.
- **Customizable Tracking**: Custom metrics allow you to track specific aspects of your application that are not captured by built-in metrics, providing a more comprehensive performance picture.

## Accessing and Using Metrics:

You can access and use metrics within your k6 script to:

- **Conditionally execute actions**: Use metric values to control test flow or trigger actions based on specific performance criteria.
- **Set thresholds**: Define performance expectations (thresholds) based on metrics to determine test success or failure.
- **Log custom data**: Include metric values in test reports for further analysis.

# Create custom metrics

Here's how to create custom metrics in k6:

**1. Choose the Metric Type:**

First, determine the appropriate metric type based on the data you want to track:

* **Counters:** Use counters for values that accumulate over time, like the number of successful logins or API calls.
    * Example: Tracking successful user registrations:

    ```javascript
    import { Counter } from 'k6/metrics';

    const successfulRegistrations = new Counter();

    export default function() {
      // Perform user registration logic
      if (registrationSuccessful) {
        successfulRegistrations.add(1);
      }
    }
    ```

* **Gauges:** Use gauges to track the minimum, maximum, and latest value observed during the test. This is useful for monitoring resource usage like memory or CPU.
    * Example: Tracking peak memory usage:

    ```javascript
    import { Gauge } from 'k6/metrics';

    const peakMemoryUsage = new Gauge('peak_memory_usage');

    export default function() {
      const currentUsage = process.memoryUsage().heapUsed / 1024 / 1024;
      peakMemoryUsage.add(Math.max(peakMemoryUsage.get() || 0, currentUsage));
    }
    ```

* **Rates:** Use rates to measure the frequency of non-zero values. These are good for tracking events that occur repeatedly, like failed requests per second.
    Rate is an object for representing a custom metric keeping track of the percentage of added values that are non-zero.
    * Example: Tracking rate of failed API requests:

    ```javascript
    import { Rate } from 'k6/metrics';

    const failedApiRequests = new Rate('failed_api_requests');

    export default function() {
      const response = http.get('https://api.example.com/data');
      if (response.status !== 200) {
        failedApiRequests.add(1);
      }
    }
    ```

    <details>
      <summary>details</summary>

      <table border="1">
        <thead>
          <tr>
            <th>PARAMETER</th>
            <th>TYPE</th>
            <th>DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>name</td> 
            <td>string</td>
            <td>The name of the custom metric.</td>
          </tr>
        </tbody>
      </table>

      `Rate.add(value, [tags])` -	Add a value to the rate metric.

      ### Rate usage in Thresholds
      When Rate is used in a threshold expression, the variable must be called rate (lower case). For example:

      - rate < 0.1 // less than 10%
      - rate >= 0.9 // more or equal to 90%
      - The value of the rate variable ranges between 0.00 and 1.00.

    _________
    </details> 

* **Trends:** Use trends to calculate statistics like min, median, and percentiles for a series of values. This is useful for analyzing response time distributions or user session durations.
    * Example: Tracking response time distribution:

    ```javascript
    import { Trend } from 'k6/metrics';

    const responseTimes = new Trend('response_times');

    export default function() {
      const response = http.get('https://api.example.com/data');
      responseTimes.add(response.duration);
    }
    ```
    

<details>
  <summary>details</summary>

### Trend usage in Thresholds
  When Trend is used in a threshold expression, there are a range of variables that can be used.

  - `avg` for average
  - `min` for minimum
  - `max` for maximum
  - `med` for median
  - `p(N)` for specific percentile. N is a number between 0.0 and 100.0 meaning the percentile value to look at, e.g. `p(99.99)` means the 99.99th percentile.

  The unit of these variables and functions are all in milliseconds.

### Example threshold expressions:
- `p(95) < 400` // 95% of requests must finish below 400ms
- `p(99) < 1000` // 99% of requests must finish within 1s.
- `p(50) < 200` // half of requests must finish within 200ms.
- `max < 3000` // the slowest request must finish within 3s.

| :warning: Don't use min and max in thresholds|
|:----------------------------|
|We don't recommend using min and max for specifying thresholds because these values represent outliers. Use percentiles instead. |


</details>  

**2. Create the Metric Object:**

Import the appropriate module (`Counter`, `Gauge`, `Rate`, or `Trend`) from `k6/metrics`. Then, create a new instance of the chosen metric type with a descriptive name for easier identification.

**3. Update the Metric Value:**

Within your test logic, use the `add` method on the metric object to update its value. For counters and rates, simply provide a number to increment the value. For gauges, provide the new value to be tracked. For trends, provide the new data point to be included in the distribution.

**4. Accessing Metric Values (Optional):**

While not always necessary for basic tracking, you can access the current value of a metric using the `get` method. This can be useful for conditionally executing actions based on metric values.

**Remember:**

* Choose a meaningful name for your metric to improve readability and understanding.
* Track metrics that are relevant to your testing goals and application behavior.
* Utilize these metrics for further analysis, setting thresholds, or logging data for deeper insights.

More about custom metrics: https://k6.io/docs/using-k6/metrics/create-custom-metrics/ 
