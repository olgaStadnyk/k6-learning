import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, API_URL } from "../../config/constants.js";
import checks from "../../../api-tests/checks.js";

export const options = {
  vus: 1,
  duration: '15s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['avg<200', 'p(95)<250'],
    checks: ['rate > 0.9']
  },
};

export default function () {
  const homePageResponse = http.get(BASE_URL);

  check(homePageResponse, {
    'status is 200': (r) => (r.status === 200) || (r.status === 304),
    'has proper data': (r) => r.body.includes('PRODUCT STORE'), // Basic content check
  });

  sleep(1);

  const itemsResponse = http.get(`${API_URL}/entries`);
  check(itemsResponse, {
    'status is 200': (r) => r.status === 200,
    'has correct amount': (r) => r.json().Items.length === 9, 
    'the last item is notebook': (r) => r.json().Items[8].cat === "notebook", 
  });
}