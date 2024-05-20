import http from 'k6/http';
import { check } from 'k6';
import { browser } from 'k6/experimental/browser';

const BASE_URL = 'https://quickpizza-demo.grafana.fun';

export const options = {
  scenarios: {
    load: {
      exec: 'getPizza',
      executor: 'ramping-vus',
      stages: [
        { duration: '5s', target: 5 },
        { duration: '10s', target: 5 },
        { duration: '5s', target: 0 },
      ],
      startTime: '10s',
    },
    browser: {
      exec: 'checkFrontend',
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
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
    browser_web_vital_fcp: ['p(95) < 1000'],
    browser_web_vital_lcp: ['p(95) < 2000'],
  },
};

export function getPizza() {
  let restrictions = {
    maxCaloriesPerSlice: 500,
    mustBeVegetarian: false,
    excludedIngredients: ['pepperoni'],
    excludedTools: ['knife'],
    maxNumberOfToppings: 6,
    minNumberOfToppings: 2,
  };

  let res = http.post(`${BASE_URL}/api/pizza`, JSON.stringify(restrictions), {
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': customers[Math.floor(Math.random() * customers.length)],
    },
  });

  check(res, {
    'status is 200': (res) => res.status === 200,
  });
}

export async function checkFrontend() {
  const page = browser.newPage();

  try {
    await page.goto(BASE_URL);
    check(page, {
      header: page.locator('h1').textContent() == 'Looking to break out of your pizza routine?',
    });

    await page.locator('//button[. = "Pizza, Please!"]').click();
    page.waitForTimeout(500);
    page.screenshot({ path: `screenshots/${__ITER}.png` });

    check(page, {
      recommendation: page.locator('div#recommendations').textContent() != '',
    });
  } finally {
    page.close();
  }
}