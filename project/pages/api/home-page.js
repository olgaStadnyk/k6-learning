import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from "../../config/constants.js";
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { allErrors } from "../../config/metrics.js";

export function openHomePage() {
  describe('Get home page', async () => {
    const homePageResponse = http.get(BASE_URL);

    const checksPassed = check(homePageResponse, {
      'status is 200': (r) => (r.status === 200) || (r.status === 304),
      'has proper data': (r) => r.body.includes('PRODUCT STORE'), // Basic content check
    });

    if (!checksPassed) {
      allErrors.add(1);
    }

    return homePageResponse;
  });
}