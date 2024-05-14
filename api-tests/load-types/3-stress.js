import http from 'k6/http';
import { sleep } from 'k6';

// Define stress test options with stages
export const options = {
    stages: [
      // Stage 1: Ramp-up (High Load)
      {
        duration: '10s', // Increase VUs quickly over 10 seconds
        target: 1000, // Aim for a high number of virtual users (stress)
      },
      // Stage 2: Sustained High Load
      {
        duration: '30s', // Maintain a high VU count for 30 seconds
        target: 1000, // Sustain stress on the system
      },
      // Stage 3: Ramp-down
      {
        duration: '10s', // Decrease VUs gradually over 10 seconds
        target: 0, // Ramp down to 0 virtual users at the end
      },
    ],
  };

export default function () {
    http.get('https://test.k6.io');
    sleep(1);
    http.get('https://test.k6.io/contact.php');
    sleep(2);
    http.get('https://test.k6.io/news.php');
    sleep(2);
}