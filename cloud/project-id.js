import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { target: 50, duration: '30s' },
    { target: 0, duration: '5s' },
  ],
  cloud: {
    projectID: 3693228,
    distribution: {
      'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
    },
  },
}

export default function () {
  http.get('https://test.k6.io');
    sleep(1);
}


// k6 cloud cloud/project-id.js   

// note: when you run `k6 run --out cloud cloud/project-id.js` (run locally and export to the cloud) -> the load zone will be 'Local execution'