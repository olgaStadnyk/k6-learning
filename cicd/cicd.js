import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  duration: '1m',
  vus: 5,
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
}

export default function () {
  let res = http.get('https://test.k6.io/news.php', {tags: { name: '02_News'}});
  check(res, {
    'is status 200': (r) => r.status === 200,
    'text verification': (r) => r.body.includes("In the news")
  });
  sleep(Math.random() * 5);
}