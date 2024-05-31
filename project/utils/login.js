import http from 'k6/http';
import { check, sleep } from 'k6';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from "k6/data";
import { API_URL } from "../config/constants.js";
import { checkResponse } from "./check-response.js";
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { generateTimer } from './common-functions.js';

const csvData = new SharedArray("data name", function () {
  return papaparse.parse(open('../data/credentials.csv'), { header: true }).data;
});

let username;
let authToken;

function getRandomUser() {
  return csvData[Math.floor(Math.random() * csvData.length)];
}

export function loginToApp() {
  const url = `${API_URL}/login`;
  const headers = {
    'Content-Type': 'application/json'
  };
  const user = getRandomUser();
  username = user.Username;
  const payload = {
    username: username,
    password:  user.Password,
  };

  describe(`Login as user ${username}`, async () => {

    const response = http.post(url, JSON.stringify(payload), { headers });

    checkResponse(response, 200);
    const loginSuccess = check(response, {
      'auth token received:' : (r) => r.body.includes('"Auth_token:')
    });

    authToken = response.body.substring(13, 25);
    
    return loginSuccess;
  });
  
}

export function GetUsername() {
  return username;
}

export function GetToken() {
  return authToken;
}