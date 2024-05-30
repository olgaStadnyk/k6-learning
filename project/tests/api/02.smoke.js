import http from "k6/http";
import { check, sleep, group } from "k6";
import { BASE_URL, API_URL } from "../../config/constants.js";
import { SmokeOptions } from "../../config/load-options.js";
import { checkResponse } from "../../utils/check-response.js";
import { loginToApp } from '../../utils/login-to-app.js';
import { addToCart } from '../../utils/add-to-cart.js';
import { isItemAddedToCart } from '../../utils/is-item-added-to-cart.js';
import { generateTimer } from '../../utils/common-functions.js';

const PRODUCT_ID = 10;

export const options = {
  vus: SmokeOptions.vus,
  duration: SmokeOptions.duration,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['avg<300', 'p(95)<400'],
    checks: [{threshold: 'rate > 0.9', abortOnFail: true, delayAbortEval: '5s'}]
  },
};

export default function () {
  group('get home page', function () {
    const homePageResponse = http.get(BASE_URL);

    check(homePageResponse, {
      'status is 200': (r) => (r.status === 200) || (r.status === 304),
      'has proper data': (r) => r.body.includes('PRODUCT STORE'), // Basic content check
    });
  });

  generateTimer(1);

  loginToApp();

  generateTimer(1);

  group('get all items on Home Page', function () {
    const itemsResponse = http.get(`${API_URL}/entries`);
    checkResponse(itemsResponse, 200);
    check(itemsResponse, {
      'has correct amount': (r) => r.json().Items.length === 9, 
      'the last item is notebook': (r) => r.json().Items[8].cat === "notebook", 
    });
  });

  generateTimer(1); 

  group('get all monitors', function () {
    const payload = {cat: 'monitor'};

    const viewAllMonitorsResponse = http.post(`${API_URL}/bycat`, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json'},
    }); 
    checkResponse(viewAllMonitorsResponse, 200);
    check(viewAllMonitorsResponse, {
      'has correct amount': (r) => r.json().Items.length === 2, 
      'the first element category': (r) => r.json().Items[0].cat === "monitor",
      'the second element category': (r) => r.json().Items[1].cat === "monitor",
    });
  });

  generateTimer(1); 

  group('view monitor', function () {
    const payload = {id: 10};

    const viewMonitorResponse = http.post(`${API_URL}/view`, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json'},
    }); 
    checkResponse(viewMonitorResponse, 200);
    check(viewMonitorResponse, {
      'category is correct': (r) => r.json().cat === "monitor",
      'id is proper': (r) => r.json().id === PRODUCT_ID,
    });
  });

  generateTimer(1); 
  addToCart(PRODUCT_ID);
  isItemAddedToCart(PRODUCT_ID);
}