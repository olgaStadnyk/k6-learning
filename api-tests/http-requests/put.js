import http from 'k6/http';

const url = 'https://httpbin.test.k6.io/put';

export default function () {
  const headers = { 'Content-Type': 'application/json' };
  const data = { name: 'Bert' };

  const res = http.put(url, JSON.stringify(data), { headers: headers });

  console.log(JSON.parse(res.body).json.name);
}