// Example showing two methods how to log all cookies (with attributes) from a HTTP response.
import http from 'k6/http';

function logCookie(c) {
  // Here we log the name and value of the cookie along with additional attributes.
  // For full list of attributes see:
  // https://k6.io/docs/using-k6/cookies#properties-of-a-response-cookie-object
  const output = `
     ${c.name}: ${c.value}
     tdomain: ${c.domain}
     tpath: ${c.path}
     texpires: ${c.expires}
     thttpOnly: ${c.http_only}
  `;
  console.log(output);
}
export default function () {
  const res = http.get('https://www.google.com/');

  // Method 1: Use for-loop and check for non-inherited properties
  for (const name in res.cookies) {
    if (res.cookies.hasOwnProperty(name) !== undefined) {
      logCookie(res.cookies[name][0]);
    }
  }

  // Method 2: Use ES6 Map to loop over Object entries
  new Map(Object.entries(res.cookies)).forEach((v, k) => {
    logCookie(v[0]);
  });
}
