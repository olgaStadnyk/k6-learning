import { doPurchase } from '../../pages/api/do-purchase.js';
import { userJourney } from './03.average.js';
import { BreakpointOptions } from '../../config/load-options.js';

export const options = {
  executor: BreakpointOptions.executor,
  stages: BreakpointOptions.stages,
  thresholds: {
    http_req_failed: [{threshold: 'rate<0.005', abortOnFail: true}],
    http_req_duration: ['avg<300', 'p(95)<400'],
    'error_counter': [{threshold:'count < 100'}],
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

// K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PERIOD=5s K6_WEB_DASHBOARD_EXPORT=project/results/07.html-report.html k6 run project/tests/api/07.breakpoint.js