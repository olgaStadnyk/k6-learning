import http from 'k6/http';
import { GetUsername } from './login.js';
import { waitTime } from './common-functions.js'
import { checkResponse } from "./check-response.js";
import { API_URL } from "../config/constants.js";

export function doPurchase() {
  const url = `${API_URL}/deletecart`;
  const headers = {
    'Content-Type': 'application/json'
  };

  const payload = {
    cookie: GetUsername(),
  };

  waitTime(1, 2);

  const response = http.post(url, JSON.stringify(payload), { headers });
  checkResponse(response, 200);
}
