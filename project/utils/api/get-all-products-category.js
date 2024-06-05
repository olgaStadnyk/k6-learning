import http from 'k6/http';
import { check } from 'k6';
import { checkResponse } from "./check-response.js";
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { API_URL } from "../../config/constants.js";

const url = `${API_URL}/bycat`;
const headers = {
  'Content-Type': 'application/json'
};

export function getAllProductsByCat(category) {
  describe('Get all products by Category', async () => {
    const payload = {cat: category};
    const response = http.post(url, JSON.stringify(payload), { headers }); 
    const allProducts = response.json().Items;
    const amount = (category === 'phone') ? 7 : ((category === 'notebook') ? 6 : 2);

    checkResponse(response, 200);
    check(response, {
      'has correct amount': (r) => r.json().Items.length === amount,
    });
    allProducts.forEach((r, i) => expect(r.cat === category, `${i+1} product's category is ${r.cat}`).to.be.ok);

    return response;
  });
}