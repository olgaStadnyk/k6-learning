import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js'

export const checkResponse = (res, status, describeText = 'Check response status is OK') => {
  describe(describeText, () => {
    if (status) {
      expect(res.status == status, `response status = ${status}`).to.be.ok;
    } else {
      expect(res.status >= 200, 'response status >= 200').to.be.ok;
      expect(res.status < 300, 'response status < 300').to.be.ok;
      expect(res).to.have.validJsonBody();
    }
  });
};