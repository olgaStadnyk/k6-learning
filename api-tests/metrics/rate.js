import { Rate } from 'k6/metrics';
import { sleep } from 'k6';
import http from 'k6/http';

const errorRate = new Rate('errorRate');

export const options = {
  vus: 1,
  duration: '5m',
  thresholds: {
    errorRate: [
      // more than 10% of errors will abort the test
      { threshold: 'rate < 0.1', abortOnFail: true, delayAbortEval: '1m' },
    ],
    /*
      { threshold: 'rate < 0.1', abortOnFail: true, delayAbortEval: '1m' }: This object defines the specific criteria for the threshold:

        threshold: 'rate < 0.1': This sets the actual threshold. It checks if the errorRate (which is a rate metric) falls below 0.1 (which translates to less than 10% errors).

        abortOnFail: true: This instructs k6 to abort the test execution if the threshold condition (rate < 0.1) is not met. In simpler terms, 
                            if the error rate goes above 10%, the test will be stopped.

        `delayAbortEval: '1m': This defines a delay of 1 minute before evaluating the abort condition. This can be useful to avoid 
                                immediate test termination due to temporary fluctuations in the error rate.
                                It allows the test to run for 1 minute after the error rate first exceeds 10% before making the final decision to abort.
    */
  },
};

export default function () {
  const resp = http.get('https://test-api.k6.io/public/crocodiles/1/');

  // Update error rate metric based on response status code
  errorRate.add(resp.status >= 400);  // Increment error rate if status code is 400 or higher (error)

  sleep(1);
}