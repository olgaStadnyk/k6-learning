import http from 'k6/http';
import { sleep } from 'k6';

/*
Soak Test Characteristics:

Sustained Load: The second stage maintains a constant VU count (1000) for a long duration (24 hours). 
This prolonged period of continuous load is a key characteristic of a soak test.

Focus on Stability: Soak tests aim to identify potential issues like memory leaks, resource exhaustion, 
or performance degradation that might only surface under extended load.
*/

export const options = {
    stages: [
        {
            duration: '5m',
            target: 1000
        },
        {
            duration: '24h',
            target: 1000
        },
        {
            duration: '5m',
            target: 0
        }
    ],
    thresholds: {
      // Define thresholds for response times in milliseconds
      http_req_duration: ['< 1000', '< 2000'], // Less than 1s, less than 2s
    },
}

export default function () {
  const response1 = http.get('https://test.k6.io');
  check(response1, { status: 200 });
  sleep(1);
  const response2 = http.get('https://test.k6.io/contact.php');
  check(response2, { status: 200 });
  sleep(2);
  const response3 = http.get('https://test.k6.io/news.php');
  check(response3, { status: 200 });
  sleep(2);
}