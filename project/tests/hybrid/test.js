import { userJourney } from '../api/03.average.js';
import { webJourney } from '../browser/test.js';

export const options = {
  scenarios: {
    load: {
      exec: 'httpLoad',
      executor: 'ramping-vus',
      stages: [
        { duration: '5s', target: 3 },
        { duration: '10s', target: 3 },
        { duration: '5s', target: 0 },
      ],
    },
    browser: {
      exec: 'webUserJourney',
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    browser_web_vital_fcp: ['p(95) < 1000'], // Measures the time it takes for the browser to render the first DOM element on the page, whether that's a text, image or header.
    browser_web_vital_lcp: ['p(95) < 2000'], // Measures a page's loading performance
  },
};

export function httpLoad() {
  userJourney();
}

export function webUserJourney() {
  webJourney();
}