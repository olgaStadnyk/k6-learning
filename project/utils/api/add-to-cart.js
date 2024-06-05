import http from 'k6/http';
import { sleep } from 'k6';
import { GetToken } from './login.js';
import { API_URL } from "../../config/constants.js";
import { checkResponse } from "./check-response.js";
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { generateGUID } from "../common-functions.js";

export function addToCart(prodId) {
  const url = `${API_URL}/addtocart`;
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = GetToken();
  if (!token) {
    return false;
  }

  const payload = {
    id: generateGUID(),
    cookie: token ? token : `user=${generateGUID()}`,
    prod_id: prodId,
    flag: token ? true : false,
  };

  sleep(1);

  describe('Add to cart', async () => {
    const response = http.post(url, JSON.stringify(payload), { headers });

    checkResponse(response, 200);
  });

  return true;
}