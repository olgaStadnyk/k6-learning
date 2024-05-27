# Results output

A k6 test can generate a lot of metrics. More metrics means more data to analyze, and more chances to find and correlate performance degradations.

## Guidelines to visualize performance test results

### Key metrics to visualize

Before reading more, ask yourself what the goal of your test is. Each metric provides a different perspective on the performance of the test. So the best metric for your analysis depends on your goals.

However, if you’re not sure what metrics to focus on, a good place to start is with the metrics that measure the requests, errors, and duration (the criteria of the RED method).

- `http_reqs`, to measure requests
- `http_req_failed`, to measure error rate
- `req_duration`, to measure duration

Besides these built-in metrics, you probably also want to visualize your checks and custom metrics. If these aren’t in your test results, consider whether they’re necessary for your script.

## Healthy performance often looks flat

Healthy performance is generally stable. In visualizations, stable behavior manifests in flat, horizontal lines.

One common visual comparison is between throughput and request duration or error rate. For example, if the system remains available under increasing load, the error rate should follow a horizontal trend even as the number of requests per second (RPS) increases. If the system loses availability under load, the error rate should increase with RPS.

Often, the availability and latency of a system remain stable up to a certain load, then degrade sharply. This degradation would manifest as a sharp upward trend in the graph. In some performance-test literature, this pattern is called the knee.

![results](/assets/screenshot-annotated-k6-results-analysis.webp)

## Visualize end-of-test summaries

1. k6 outputs metrics in some format and sends the metrics to an agent that can receive that format.
2. The agent forwards the metrics to be stored in a database.
3. The frontend queries the database and visualizes the output.

![results](/assets/diagram-k6-agent-visualization.webp)

## Syntax

Set k6 outputs and destinations as arguments to the --out flag of the k6 run command. The argument takes the form of `<key>=<value>`, where the key is one of the output types, and the value is the file path or remote destination. You can pass multiple outputs in one script.

For example, the following command outputs results as both JSON, which it writes to a file called test.json, and in the format of InfluxDB, which it sends to a port on localhost.

```
k6 run script.js 
--out json=test.json 
--out influxdb=http://localhost:8086/k6
```

## Local files

CSV and JSON are the outputs that work with the widest range of tooling. Many libraries and tools can plot values from JSON and CSV, so you have much freedom and flexibility to turn these outputs into the visualization you want.

## CSV

To output k6 results as CSV, use CSV as the argument key and the file path as the argument value:

`k6 run --out CSV=file.csv script.js`

The options to visualize results from a CSV file are vast: you could use a spreadsheet, Tableau, or any number of open-source visualization tools. GNUplot is one example of many.

For the structure of CSV output, refer to CSV output in the documentation.

## JSON

To output k6 results as JSON, use JSON as the argument key and the file path as the argument value:

`k6 run --out json=file.json script.js`

As with CSV, you have many options to visualize results from a JSON file. For example, [ChartJS](https://www.chartjs.org/) is a popular JavaScript library for visualizations. Or, if Python is your language of choice, [pandas](https://pandas.pydata.org/) is another popular option.

For the structure of [JSON output](https://grafana.com/docs/k6/latest/results-output/real-time/json/), refer to JSON output in the documentation.

https://k6.io/docs/results-output/real-time/json/ 

## Server-sent events with xk6-dashboard.

For the first visualization, we want to highlight a great community project, xk6-dashboard. The dashboard runs a local web server that visualizes metrics as the test runs.

You can use it as you would use any extension:

1. Download xk6:
`go install go.k6.io/xk6/cmd/xk6@latest`

2. Build the binary:
`xk6 build --with github.com/szkiba/xk6-dashboard@latest`

3. Run the test with the custom binary, using dashboard as the argument for --out.
`./k6 run --out dashboard script.js`

4. Visit the dashboard on your localhost and view results as they appear. The default is http://127.0.0.1:5665/

For the latest instructions, visit the [xk6-dashboard repository](https://github.com/szkiba/xk6-dashboard). If you want to make your own visualization tool, the source code for the xk6-dashboard may serve as inspiration.

## Grafana dashboards

With Grafana, you can build dashboards to visualize results how you want, then query the data from any backend you choose.

There are a host of load testing tools and other offerings you can use to track performance. With the Grafana Cloud k6 app, you can run k6 scripts from your own computer, then visualize results alongside everything in your Grafana Cloud instance.
