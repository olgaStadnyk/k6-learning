// Import necessary libraries
import { browser } from 'k6/experimental/browser';
import { check } from 'k6';

/*
The preceding code launches a Chromium-based browser, visits the application and mimics a user logging in to the application. 
Once submitted, it checks if the text of the header matches what is expected.
*/

// Define test options
export const options = {
  // Define scenarios for running the test
  scenarios: {
    // Scenario named "ui" (user interface)
    ui: {
      // Use shared iterations for running multiple browser instances
      // Note that providing an executor and setting the browser scenario option's type to chromium is mandatory.
      executor: 'shared-iterations',
      // Configure browser options for this scenario
      options: {
        browser: {
          // Specify the browser type (Chromium in this case)
          type: 'chromium',
        },
      },
      vus: 10,
      iterations: 10,
    },
  },
  // Define performance thresholds for checks (performance expectations in checks)
  thresholds: {
    checks: ["rate==1.0"], // Aim for 100% success rate in checks
  }
};

// Main test function (async for using await)
export default async function () {
  // Create a new browser page instance
  const page = browser.newPage();

  try {
    // Open the target URL in the browser page
    await page.goto('https://test.k6.io/my_messages.php');
    // page.screenshot({ path: 'assets/screenshots/screenshot-login.png' });

    // Simulate user input for login form
    page.locator('input[name="login"]').type('admin');
    page.locator('input[name="password"]').type('123');

    // Locate the submit button using its selector
    const submitButton = page.locator('input[type="submit"]');

    // Wait for navigation after clicking and perform click action
    await Promise.all([page.waitForNavigation(), submitButton.click()]);

    // Define a check to validate the page content after login
    check(page, {
      'header': p => p.locator('h2').textContent() == 'Welcome, admin!', // Check for successful login message
    });
    // page.screenshot({ path: 'assets/screenshots/screenshot-header.png' });
  } finally {
    // Close the browser page after the test finishes (always recommended)
    page.close();
  }
}

// k6 run browser-test/browser-test.js

// K6_BROWSER_HEADLESS=false k6 run browser-test/browser-test.js

// k6 cloud browser-test/browser-test.js