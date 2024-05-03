# First test

## Run the first simple test

K6 will start executing the test script and display real-time statistics about the test run, including the number of virtual users, requests per second, response times, and more.

```
k6 run first-test/first-script.js
```

## Results
   
Analyzing the Test Results
Once the test run is complete, K6 generates a summary report that provides detailed information about the test results. The report includes metrics such as response time distribution, error rate, and throughput.

Additionally, K6 allows you to export the test results in various formats, such as JSON, CSV, and InfluxDB. This enables you to integrate K6 with other tools for further analysis and visualization of the test data.

**VUs** - Current number of active virtual users


**Iterations** - 	Counter - The aggregate number of times the VUs execute the JS script (the default function). 

Create json file with the results:
```
k6 run --out json=results.json first-test/first-script.js
```

![cli result](/assets/firstTestResult.png)
