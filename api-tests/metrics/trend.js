// Import necessary modules
import { Trend } from 'k6/metrics';  // Used for creating a trend metric to track server waiting time
import { sleep } from 'k6';     // Used for introducing delays between requests
import http from 'k6/http';    // Used for making HTTP POST requests

// Define a trend metric to track server waiting time
const serverWaitingTimeOnLogin = new Trend('serverWaitingTimeOnLogin', true);  // Tracks server wait time for login requests, with batching enabled

// Define test options
export const options = {
  vus: 1,                   // Number of virtual users (concurrent users)
  duration: '1m',            // Total test duration (1 minute)
  thresholds: {              // Define performance thresholds
    serverWaitingTimeOnLogin: ['p(95) < 200'],  // 95th percentile of server waiting time should be less than 200ms
  },
};

// Default test function executed by each VU
export default function () {
  // Send an HTTP POST request to login endpoint
  const resp = http.post('https://test-api.k6.io/auth/token/login/', {
    username: 'test-user',
    password: 'supersecure', 
  });

  // Update trend metric with server waiting time
  serverWaitingTimeOnLogin.add(resp.timings.waiting);  // Add server waiting time from the response timings

  // Introduce a 1-second delay between requests
  sleep(1);
}
