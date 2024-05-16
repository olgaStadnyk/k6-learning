import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 10,
    duration: '10s'
}

export default function () {
    http.get('https://test.k6.io');
    sleep(1);
}

// login to cloud: k6 login cloud --token <YOUR_API_TOKEN>
// run: k6 run --out cloud cloud/cloud-default.js

// find the result under the grafana default project

