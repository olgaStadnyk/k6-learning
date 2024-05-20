# Hybrid performance with k6 browser

An alternative approach to browser-based load testing that’s much less resource-intensive is combining a small number of virtual users for a browser test with a large number of virtual users for a protocol-level test.

You can achieve hybrid performance in multiple ways, often by using different tools. To simplify the developer experience, you can combine k6 browser with core k6 features to write hybrid tests in a single script.

## Browser and HTTP test

The code below shows an example of combining a browser and HTTP test in a single script. While the script exposes the backend to the typical load, it also checks the frontend for any unexpected issues. It also defines thresholds to check both HTTP and browser metrics against pre-defined SLOs

see: browser-test/browser_http.js

