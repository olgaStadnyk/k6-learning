import http from 'k6/http';
import { check } from 'k6';
import { browser } from 'k6/experimental/browser';

const quickpizza_url = 'https://quickpizza-demo.grafana.fun';

export const options = {
  scenarios: {
    // Define a "load" scenario that simulates concurrent users
    load: {
      // This scenario will execute the "getPizza" function
      exec: 'getPizza',
      // Use the "ramping-vus" executor to gradually increase the number of virtual users (VUs)
      executor: 'ramping-vus',
      // Define stages for the VUs:
      //  - Increase VUs to 5 over 5 seconds
      //  - Maintain 5 VUs for 10 seconds
      //  - Decrease VUs to 0 over 5 seconds
      stages: [
        { duration: '5s', target: 5 },
        { duration: '10s', target: 5 },
        { duration: '5s', target: 0 },
      ],
      // Start this scenario 10 seconds after the test begins
      startTime: '10s',
    },
    // Define a "browser" scenario for browser-based testing
    browser: {
      // This scenario will execute the "checkFrontend" function
      exec: 'checkFrontend',
      // Use the "constant-vus" executor to maintain a constant number of VUs
      executor: 'constant-vus', // scenarios in k6  must contain an executor
      // Use 1 VU for the browser scenario
      vus: 1,
      // Run the browser scenario for 30 seconds
      duration: '30s',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  // Define performance thresholds for the test
  thresholds: {
    // HTTP request failure rate should be less than 1%
    http_req_failed: ['rate<0.01'],
    // 95th percentile of HTTP request duration should be less than 500ms
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    // 95th percentile of First Contentful Paint (FCP) should be less than 1000ms (browser test)
    browser_web_vital_fcp: ['p(95) < 1000'],
    // 95th percentile of Largest Contentful Paint (LCP) should be less than 2000ms (browser test)
    browser_web_vital_lcp: ['p(95) < 2000'],
  },
};

// Define a function to send a POST request to the "/api/pizza" endpoint with sample pizza restrictions
export function getPizza() {
  // Define restrictions for the pizza recommendation (replace with your actual logic if needed)
  const restrictions = {
    maxCaloriesPerSlice: 500,
    mustBeVegetarian: false,
    excludedIngredients: ['pepperoni'],
    excludedTools: ['knife'],
    maxNumberOfToppings: 6,
    minNumberOfToppings: 2,
  };

  // Send a POST request with the restrictions as JSON payload
  const res = http.post(`${quickpizza_url}/api/pizza`, JSON.stringify(restrictions), {
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': 885792,
    },
  });

  // Check the response status code to ensure it's 200 (OK)
  check(res, {
    'status is 200': (res) => res.status === 200,
  });
}

// Define an async function to perform browser-based testing
export async function checkFrontend() {
  const page = browser.newPage();

  try {
    // Open the base URL in the browser
    await page.goto(quickpizza_url);

    // Check if the main heading matches the expected text
    check(page, {
      'header': p => p.locator('h1').textContent() == 'Looking to break out of your pizza routine?',
    });

    // Click the button with text "Pizza, Please!"
    await page.locator('//button[. = "Pizza, Please!"]').click();

    // Wait for 500 milliseconds to allow the page to react to the click
    page.waitForTimeout(500);

    // Take a screenshot of the page and save it with a filename based on the iteration number (`__ITER`)
    page.screenshot({ path: `screenshots/${__ITER}.png` });

    // Check if the content of the element with ID "recommendations" is not empty
    check(page, {
      'recommendation': p => p.locator('div#recommendations').textContent() != '',
    });
  } finally {
    page.close();
  }
}

// k6 run browser-test/browser_and_http.js