import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { allErrors } from '../config/metrics.js';

export const checkResponse = (res, status, describeText = 'Check response status is OK') => {
  describe(describeText, () => {
    const isValidStatus = status ? res.status === status : (res.status >= 200 && res.status < 300);

    expect(isValidStatus, `response status is ${status || '2xx'}`).to.be.true;
    
    if (!isValidStatus) {
      allErrors.add(1); 
    }
    if (!status && isValidStatus) {
      expect(res).to.have.validJsonBody();
    }
  });
};