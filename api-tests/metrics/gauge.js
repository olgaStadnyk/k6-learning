// Import necessary modules
import http from 'k6/http';    // Used for making HTTP GET requests
import { sleep } from 'k6';     // Used for introducing delays between requests
import { Gauge } from 'k6/metrics';  // Used for creating a gauge metric to track content size

// Define a gauge metric to track content size
// Gauge - a custom metric holding only the latest value added
const GaugeContentSize = new Gauge('ContentSize');  // Tracks the size of the response body

// Define test options
export const options = {
  thresholds: {              // Define performance thresholds
    ContentSize: ['value<4000'],  // The content size should be less than 4000 bytes
  },
};

// Default test function executed by each VU
export default function () {
  // Send an HTTP GET request to the specified URL
  const res = http.get('https://test-api.k6.io/public/crocodiles/1/');

  // Update gauge metric with the content size
  GaugeContentSize.add(res.body.length);  // Add the length of the response body to the gauge metric

  // Introduce a 1-second delay between requests
  sleep(1);
}
