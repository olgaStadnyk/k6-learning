import http from 'k6/http';
import { sleep } from 'k6';
import { GetToken } from './login.js';
import { API_URL } from "../config/constants.js";
import { checkResponse } from "./check-response.js";
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js'

export function addToCart(prodId) {
  const url = `${API_URL}/addtocart`;
  const headers = {
    'Content-Type': 'application/json'
  };

  function generateGUID() {
    let a = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return a;
  }

  const payload = {
    id: generateGUID(),
    cookie: GetToken(),
    prod_id: prodId,
    flag: true,
  };

  sleep(1);

  describe('Add to cart', async () => {
    const response = http.post(url, JSON.stringify(payload), { headers });

    checkResponse(response, 200);
  });
}