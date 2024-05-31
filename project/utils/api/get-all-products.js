import http from 'k6/http';
import { check } from 'k6';
import { checkResponse } from "./check-response.js";
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { API_URL } from "../../config/constants.js";

export function getAllProducts() {
  describe('Get all items on Home Page', async () => {
    const itemsResponse = http.get(`${API_URL}/entries`);
    checkResponse(itemsResponse, 200);
    check(itemsResponse, {
      'has correct amount': (r) => r.json().Items.length === 9, 
      'the last item is notebook': (r) => r.json().Items[8].cat === "notebook", 
    });

    return itemsResponse;
  });
}