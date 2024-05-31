import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config/constants.js';
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { checkResponse } from './check-response.js';

export function logout() {
  const url = `${BASE_URL}/index.html`;
  const headers = {
    'Cookie': 'user=6522186a-a0e7-0a2e-a716-5a6d2909716d',
  };

  describe(`Log out`, async () => {
    const response = http.get(url, { headers });

    checkResponse(response, 200);
    check(response, { '"Log in" is shown': (r) => r.body.includes(`<a class="nav-link" href="#" id="login2" data-toggle="modal" data-target="#logInModal">Log in</a>`) });
    check(response, { '"Log out" is NOT shown': (r) => r.body.includes(`<a class="nav-link" href="#" style="display:none" id="logout2" onClick="logOut()">Log out</a>`) });
  });
}
