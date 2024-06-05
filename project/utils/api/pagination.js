import http from 'k6/http';
import { checkResponse } from "./check-response.js";

export function NavigateToNextPage(pageId = 1) {
  const url = 'https://api.demoblaze.com/pagination';
  const headers = {
    "Content-Type": "application/json",
  };

  const payload = {
    id: pageId,
  };

  const response = http.post(url, JSON.stringify(payload), { headers });

  checkResponse(response, 200);
}