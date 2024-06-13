import http from 'k6/http';
import { check, fail } from 'k6';
import { checkResponse } from "../../utils/check-response.js";
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { API_URL } from "../../config/constants.js";
import { allErrors } from "../../config/metrics.js";

export function getAllProducts() {
  describe('Get all items on Home Page', async () => {
    const itemsResponse = http.get(`${API_URL}/entries`);
    try {
      checkResponse(itemsResponse, 200);
      const checksPassed = check(itemsResponse, {
        'has correct amount': (r) => r.json().Items.length === 9, 
        'the last item is notebook': (r) => r.json().Items[8].cat === "notebook", 
      });
      if (!checksPassed) {
        console.warn('getAllProducts: ' + response);
        allErrors.add(1);
      }

      return itemsResponse;
    } catch({ name, message }) {
      allErrors.add(1);
      console.error('getAllProductsErrorName: ' + name);
      console.error('getAllProductsErrorMessage: ' + message);
      fail('system failed');
    }
  });
}