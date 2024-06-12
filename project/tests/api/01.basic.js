import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, API_URL } from "../../config/constants.js";

export const options = {
  vus: 1,
  duration: '15s',
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