import http from 'k6/http';
import { sleep, check } from 'k6';

/*
- The test uses only 1 virtual user (VU), simulating minimal load and focusing on verifying core functionalities 
rather than system performance under heavy load.
- The assertions check for successful HTTP status codes (200) and basic content presence, 
ensuring the targeted pages respond and contain expected elements. 

These checks aim to identify major issues that would prevent basic functionality.

By checking for successful responses and basic content, the test can identify major problems like server outages,
missing pages, or unexpected content changes that could significantly impact the system's usability. 
This allows for early detection and resolution of critical issues before further testing commences.
*/

export const options = {
    vus: 3,
    duration: '35s'
}

export default function () {
  const homepageResponse = http.get('https://test.k6.io');

  console.warn('Hello warn');

  check(homepageResponse, {
    'status is 200': (r) => r.status === 200,
    'has title': (r) => r.body.includes('Collection of simple web-pages suitable for load testing.'), // Basic content check
  });

  console.error('Hello error');

  sleep(1);
  console.info('Hello info');

  const contactsResponse = http.get('https://test.k6.io/contacts.php');
  check(contactsResponse, {
    'status is 200': (r) => r.status === 200,
    'has contacts text': (r) => r.body.includes('Contact us'), // Specific content check
  });

  console.debug('Hello debug');

  sleep(2);

  console.log('Hello');

  const newsResponse = http.get('https://test.k6.io/news.php');
  check(newsResponse, {
    'status is 200': (r) => r.status === 200,
    'has news text': (r) => r.body.includes('In the news'), // Specific content check
  });
}

 // k6 cloud cloud/logs.js