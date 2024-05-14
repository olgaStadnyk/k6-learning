import http from 'k6/http';
import { sleep } from 'k6';

// Define load test options with stages
export const options = {
  stages: [
    // Stage 1: Ramp-up
    {
      duration: '10s', // Increase VUs gradually over 10 seconds
      target: 10, // Target 10 virtual users by the end of the stage
    },
    // Stage 2: Sustained Load
    {
      duration: '30s', // Maintain 10 virtual users for 30 seconds
      target: 10, // Steady state with constant load
    },
    // Stage 3: Ramp-down
    {
      duration: '10s', // Decrease VUs gradually over 10 seconds
      target: 0, // Ramp down to 0 virtual users at the end
    },
  ],
};

// Define the default function executed by each virtual user
export default function () {
  // Simulate user behavior with HTTP requests
  http.get('https://test.k6.io'); // GET request to homepage
  sleep(1); // Simulate user think time (1 second)

  http.get('https://test.k6.io/contact.php'); // GET request to contact page
  sleep(2); // Simulate user think time (2 seconds)

  http.get('https://test.k6.io/news.php'); // GET request to news page
  sleep(2); // Simulate user think time (2 seconds)
}

// to run script with csv results:
// k6 run api-tests/load-types/2-average-load.js -o csv=results.csv