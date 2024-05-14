import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

export const options = {
    stages: [
        { duration: '10m', target: 1000 },
        { duration: '10m', target: 2000 },
        { duration: '10m', target: 3000 },
        { duration: '10m', target: 4000 },
        { duration: '10m', target: 5000 },
        { duration: '10m', target: 6000 },
        { duration: '10m', target: 7000 },
        { duration: '10m', target: 8000 },
        { duration: '10m', target: 9000 },
        { duration: '10m', target: 10000 },
        { duration: '10m', target: 11000 },
        { duration: '10m', target: 12000 },
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
        'http_req_failed': ['rate<0.01'], // Less than 1% of requests should fail
    },
};

const errorCount = new Counter('errors');
const failureRate = new Rate('failed_requests');

export default function () {
    const res = http.get('https://test.k6.io');

    // Check if the response status is 200
    const checkRes = check(res, {
        'status is 200': (r) => r.status === 200,
    });

    // Log failures
    if (!checkRes) {
        errorCount.add(1);
        failureRate.add(1);
        console.error(`Request failed with status ${res.status} at iteration ${__ITER}`);
    }

    sleep(1);
}

// k6 run api-tests/load-types/5-breakpoint.js                