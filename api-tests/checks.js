import { check } from 'k6';
import http from 'k6/http';

export default function () {
    const res = http.get('https://test.k6.io/');

    console.log(res.status) // INFO[0001] 200
    // console.log(res.body)

    check(true, {
        'true is true': (value) => value === true
    });
    
    // Check for HTTP response code
    check(res, {
      'is status 200': (r) => r.status === 200,
    });

    // Check for text in response body
    check(res, {
      'verify homepage text': (r) =>
        r.body.includes('Collection of simple web-pages suitable for load testing'),
    });

    // Check for response body size
    check(res, {
      'body size is 11278 bytes': (r) => r.body.length == 11278,
    });

    // You can also add multiple checks within a single check() statement:
    check(res, {
      'is status 200?': (r) => r.status === 200,
      'body size is 11278 bytes': (r) => r.body.length == 11278,
      'verify homepage text': (r) =>
        r.body.includes('Collection of simple web-pages suitable for load testing'),
    });
}