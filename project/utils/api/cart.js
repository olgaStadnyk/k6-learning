import http from 'k6/http';
import { check } from 'k6';
import { GetToken } from './login.js';
import { API_URL } from "../../config/constants.js";
import { checkResponse } from "./check-response.js";
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';

const url = `${API_URL}/viewcart`;
const headers = {
  'Content-Type': 'application/json'
};

export function isItemAddedToCart(id) {
  const token = GetToken();
  if (token) {
    const payload = {
      cookie: token,
      flag: true,
    };
  
    describe(`Is product ${id} added to the cart`, async () => {
      const response = http.post(url, JSON.stringify(payload), { headers });
  
      check(response, { 
        'product is successfully added to the cart' : (r) => r.body.includes(`"prod_id":${id}`)
      });
      checkResponse(response, 200);
    });
  }
  return token ? true : false;
}

export function isCartEmpty() {
  const token = GetToken();
  if (token) {
    const payload = {
      cookie: token,
      flag: true,
    };
    
    describe(`Is cart empty`, async () => {
      const response = http.post(url, JSON.stringify(payload), { headers });
  
      check(response, { 
        'cart empty' : (r) => r.json().Items.length === 0
      });
      checkResponse(response, 200);
    });
  }
}