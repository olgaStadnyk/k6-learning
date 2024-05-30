import http from 'k6/http';
import { check } from 'k6';
import { GetToken } from './login-to-app.js';
import { API_URL } from "../config/constants.js";
import { checkResponse } from "./check-response.js";
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { generateTimer } from './common-functions.js';

export function isItemAddedToCart(id) {
  const url = `${API_URL}/viewcart`;
  const headers = {
    'Content-Type': 'application/json'
  };

  const payload = {
    cookie: GetToken(),
    flag: true,
  };

  generateTimer(1);

  describe(`Is product ${id} added to the cart`, async () => {
    const response = http.post(url, JSON.stringify(payload), { headers });

    check(response, { 
      'product is successfully added to the cart' : (r) => r.body.includes(`"prod_id":${id}`)
    });
    checkResponse(response, 200);
  });
}