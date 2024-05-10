import { Counter } from 'k6/metrics'; 
import { sleep } from 'k6';   
import http from 'k6/http';   

// Define a counter metric to track all errors
const allErrors = new Counter('error_counter'); // Tracks total number of errors encountered during the test

// Define test options (configuration for the entire test)
export const options = {
  vus: 1,                   
  duration: '1m',         
  thresholds: {              // Define performance thresholds
    'error_counter': [       // Threshold for the total error count
      'count < 10',           // The test will fail if there are 10 or more errors
    ],
    'error_counter{errorType:authError}': [ // Threshold on a sub-metric with a tag
      'count <= 2',          // The test will fail if there are more than 2 authentication errors
    ],
  },
};

// Default test function executed by each virtual user (VU)
export default function () {
  const auth_resp = http.post('https://test-api.k6.io/auth/token/login/', {
    username: 'test-user',
    password: 'supersecure', 
  });

  // Check login response status code
  if (auth_resp.status >= 400) {
    allErrors.add(1, { errorType: 'authError' });  // Increment error counter with tag "authError"
  }

  // Send an HTTP GET request to another endpoint
  const other_resp = http.get('https://test-api.k6.io/public/crocodiles/1/');

  // Check response status code for the second request
  if (other_resp.status >= 400) {
    allErrors.add(1);  // Increment error counter without a tag (general error)
  }

  // Introduce a 1-second delay between requests
  sleep(1);
}
