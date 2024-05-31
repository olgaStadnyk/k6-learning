import http from 'k6/http';
import { check } from 'k6';
import { API_URL } from "../../config/constants.js";
import { checkResponse } from "./check-response.js";
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';

const url = `${API_URL}/view`;
const headers = {
  'Content-Type': 'application/json'
};

/**
 * Open the product with id
 * 
 * @param {number} productId - product id that should be opened.
 * @param {string} category - the category of the product: 'monitor', 'phone', 'notebook'.
 */
export function viewProduct(productId, category) {
  describe(`View product ${productId}`, async () => {
    const payload = {id: productId};
    const response = http.post(url, JSON.stringify(payload), { headers });

    checkResponse(response, 200);
    check(response, {
      'category is correct': (r) => r.json().cat === category,
      'id is proper': (r) => r.json().id === productId,
    });
  });
}