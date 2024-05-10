// Import necessary modules
import http from 'k6/http';  // Used for making HTTP requests
import { sleep } from 'k6';     // Used for introducing delays
import { Counter, Trend } from 'k6/metrics';  // Used for creating custom metrics

// Define test options
export const options = {
  vus: 5,                   // Number of virtual users (concurrent users)
  duration: '5s',            // Total test duration
  thresholds: {              // Define performance thresholds
    http_req_duration: ['p(95)<265'],  // 95th percentile of HTTP request duration < 265ms
    my_counter: ['count>9'],     // Custom counter 'my_counter' value must be greater than 9
    response_time_news_page: [  // Thresholds for news page response time
      'p(95)<150',            // 95th percentile < 150ms
      'p(99)<200'             // 99th percentile < 200ms
    ]
  }
};

// Create custom metrics
let myCounter = new Counter('my_counter');  // Tracks how many times the counter is incremented
let newsPageResponseTrend = new Trend('response_time_news_page');  // Tracks response time trend for news page

// Default test function executed by each VU
export default function () {
  // Send an HTTP GET request to the homepage
  let res = http.get('https://test.k6.io/');

  // Increase the custom counter by 1
  myCounter.add(1);

  // Introduce a 1-second delay
  sleep(1);

  // Send an HTTP GET request to the news page
  res = http.get('https://test.k6.io/news.php');

  // Add the news page response time to the trend metric
  newsPageResponseTrend.add(res.timings.duration);  // Extract response duration from timings

  // Introduce another 1-second delay
  sleep(1);
}
