import http from 'k6/http';
import { check, sleep } from 'k6';

/*
This script defines a load test that sends POST requests with a message to a test endpoint
for a specified duration with varying user loads. 
It then verifies the response and introduces random delays to mimic real-world user behavior.
*/

export let options = {
  stages: [
    { duration: '30m', target: 100 },
    { duration: '1h', target: 100 },
    { duration: '5m', target: 0 },
  ],
};

export default function() {
  let url = 'https://httpbin.test.k6.io/post';
  let response = http.post(url, 'Hello world!');
  check(response, {
      'Application says hello': (r) => r.body.includes('Hello world!')
  });

  sleep(Math.random() * 5);
}