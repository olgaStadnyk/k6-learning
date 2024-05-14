import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    // Stage 1: Instantaneous Spike (almost)
    {
      duration: '10s', // Very short duration for a near-instantaneous spike
      target: 10000, // High number of virtual users for significant load
    },
    // Stage 2: Immediate Ramp-down
    {
      duration: '1s', // Short duration to quickly decrease VUs
      target: 0, // Ramp down to 0 virtual users
    },
  ],
};

export default function () {
  http.get('https://test.k6.io');
  sleep(1); // You can remove sleep entirely for an even faster spike
}
