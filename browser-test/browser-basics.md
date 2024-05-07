# Browser testing
EXPERIMENTAL MODULE

Browser testing is a valuable approach to evaluate performance at the browser level and assess user experience. 
It allows you to discover issues that might remain unnoticed if you only conduct testing at the backend level.

In addition to the API load testing, k6 can also be effectively utilized for browser testing. This valuable approach enables the evaluation of performance at the browser level and provides insights into the user experience. By incorporating browser testing into your testing strategy, you can uncover potential issues that may go unnoticed if testing is solely conducted at the backend level.

Browser-level testing can help you answer questions like:

- When my application is receiving thousands of simultaneous requests from the protocol-level, what happens to the frontend?
- How can I get metrics specific to browsers, like total page load time?
- Are all my elements interactive on the frontend?
- Are there any loading spinners that take a long time to disappear?

___

### Does not run natively in a browser

By default, k6 does not render web pages the same way a browser does. Browsers can consume significant system resources. Skipping the browser allows running more load within a single machine.

However, with k6 browser, you can interact with real browsers and collect frontend metrics as part of your k6 tests.
____

NOTE:
To work with the browser module, make sure you are using the latest k6 version, and install a Chromium-based browser on your machine (such as Google Chrome).



## Run the first test

```
k6 run browser-test/simple-test.js
```

After running the test, the following browser metrics will be reported:

![browser simple test result](/assets/browser-simple-test-result.png)

The browser test was successful. All checks passed, web vitals are good, and page load times are acceptable.

## Run headful browser

```
K6_BROWSER_HEADLESS=false k6 run browser-test/simple-test.js
```