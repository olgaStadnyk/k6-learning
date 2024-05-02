// 1. init code
import http from 'k6/http';
import { sleep } from 'k6';

/*
For a test to run, you need to have init code, which prepares the test;
 and VU code, which makes requests.

Code in the init context defines functions and configures the test options (like duration).
Code in the init context prepares the script, loading files, importing modules, and defining the test lifecycle functions. Required.

Every test also has a default function, which defines the VU logic.
VU code runs in the default or scenario function. Required.
A VU executes the default() function from start to end in sequence. Once the VU reaches the end of the function, it loops back to the start and executes the code all over.

Init code runs first and is called only once per VU. The default code runs as many times or as long as is configured in the test options.
*/

export const options = {
  vus: 10,  // VUS (Virtual Users): The number of users used/going to be used during the test.
  duration: '20s', // Duration: How long the test will last. The value given here is in milliseconds (MS).
}

export default function () {
  // 2. VU code
  http.get('https://test.k6.io'); // A GET request
  sleep(1);  // (Duration, in seconds) Real users don't bombard a website with requests instantly. They take time to read, interact with elements, and navigate between pages. Adding sleep() between requests can help simulate more realistic user behavior and prevent your load test from overwhelming the target system.
}