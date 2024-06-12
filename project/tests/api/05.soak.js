import { doPurchase } from '../../pages/api/do-purchase.js';
import { userJourney } from './03.average.js';
import { SoakStages } from '../../config/load-options.js';

export const options = {
  stages: SoakStages,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['avg<300', 'p(95)<400'],
    checks: [{threshold: 'rate > 0.9', abortOnFail: true, delayAbortEval: '5s'}]
  },
  cloud: {
    projectID: 3699789,
  },
};

export default function () {
  userJourney();
}

export function teardown(data) {
  doPurchase(false);
}