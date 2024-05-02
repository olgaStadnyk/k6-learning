// Request to ChatGPT: create the load test with the jsonplaceholder.typicode.com api k6

// Response:
// Sure, here's a basic example of a load test using the jsonplaceholder.typicode.com API with k6:

import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 10, // 10 virtual users
  duration: '30s', // duration of the test
};

export default function () {
  const post = http.get('https://jsonplaceholder.typicode.com/posts/1');
  check(post, {
    'status is 200': (r) => r.status === 200,
    'content type is application/json': (r) => r.headers['Content-Type'] === 'application/json; charset=utf-8',
  });
  sleep(1);
}

/*
This script sends a GET request to retrieve a single post from the jsonplaceholder.typicode.com API and verifies that the response status is 200 
and the content type is JSON. Adjust the vus and duration options according to your needs for load testing.
*/

