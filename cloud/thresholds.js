import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_failed: [{
      threshold: 'rate<=0.05',
      abortOnFail: true,
    }],
    http_req_duration: ['p(95)<=100'],
    checks: ['rate>=0.99'],
  },
};

export default function() {
  let url = 'https://httpbin.test.k6.io/post';
  let response = http.post(url, 'Hello world!');
  check(response, {
      'Application says hello': (r) => r.body.includes('Hello world!')
  });

  sleep(Math.random() * 3);
}

// k6 cloud cloud/thresholds.js