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

### Run on Grafana cloud

`k6 cloud browser-test/simple-test.js`

result:

![browser cloud](/assets/browser-cloud.png)

### Key Metrics:
- LCP (Largest Contentful Paint): 0.09 s (Good)
  This metric measures the time until the largest content element on the page becomes visible.
- FID (First Input Delay): 1 ms (Good)
  This metric measures the delay between the user's first interaction (e.g., click) and the moment when the browser can process that interaction.
- CLS (Cumulative Layout Shift): 0.00 (Good)
  This metric measures the sum of all layout shifts that occur during the entire lifespan of the page.
- FCP (First Contentful Paint): 0.09 s (Good)
  This metric measures the time until the first text or image is painted.
- INP (Interaction to Next Paint): 0 ms (Good)
  This metric measures the time between user interaction and the next paint.
- TTFB (Time to First Byte): 63 ms (Good)
  This metric measures the time from the request being sent to receiving the first byte of the response from the server.
  
### Graph Analysis:
The graph shows the main metrics over time:

- **LCP (Largest Contentful Paint)**: Yellow line indicating the time to display the largest content element.
- **FID (First Input Delay)**: Blue line indicating the delay between user interaction and processing.
- **CLS (Cumulative Layout Shift)**: Red line indicating layout stability.
- **FCP (First Contentful Paint)**: Cyan line indicating the time to display the first content element.
- **INP (Interaction to Next Paint)**: Green line indicating the time to the next paint after interaction.
- **TTFB (Time to First Byte)**: Purple line indicating the time to receive the first byte of the response from the server.

### Analysis and Conclusions:
- All metrics are within good ranges:
  LCP, FID, CLS, FCP, INP, and TTFB are in the green zone, indicating good performance.
- Stability during testing:
  The metrics remain stable throughout the test, indicating no significant performance issues under load.
- No errors:
  No HTTP errors were recorded, indicating stable server performance during the test.
- Low response times:
  Low values for LCP, FCP, and TTFB indicate fast page loading and content delivery.


For 10 users:

![browser cloud](/assets/browser-cloud-10.png)