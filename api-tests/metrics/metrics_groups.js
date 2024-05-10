import http from "k6/http";
import { check, group, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";

const loginData = JSON.parse(open("../assets/users.json"));  // download the data file here: https://test.k6.io/static/examples/users.json

/* Options
Global options for your script
stages - Ramping pattern
thresholds - pass/fail criteria for the test
ext - Options used by Load Impact cloud service test name and distribution
*/
export let options = {
    stages: [
        { target: 200, duration: "10s" },
        { target: 200, duration: "30s" },
        { target: 0, duration: "10s" }
    ],
    thresholds: {
        "http_req_duration": ["p(95)<500"],
        /*
        {staticAsset:yes}: This part acts as a filter within the http_req_duration metric. 
            It likely identifies and separates HTTP requests for static assets (like images, CSS, or JavaScript files)
            from other types of requests. The staticAsset:yes part specifies that the threshold applies only to requests categorized as static assets.
        
        p(95)<100: This defines the actual threshold itself. Here's how to interpret it:
            p(95): This represents the 95th percentile. It means that 95% of the HTTP requests for static assets 
            should have a duration less than the specified value.

            <100: This is the target value for the 95th percentile. 
            In this case, it indicates that 95% of the static asset requests should complete in less than 100 milliseconds (ms).
        */
        "http_req_duration{staticAsset:yes}": ["p(95)<100"],
        "check_failure_rate": ["rate<0.3"]
    },
};

// Custom metrics
// We instantiate them before our main function
let successfulLogins = new Counter("successful_logins");
let checkFailureRate = new Rate("check_failure_rate");
let timeToFirstByte = new Trend("time_to_first_byte", true);


/* Main function
The main function is what the virtual users will loop over during test execution.
*/
export default function() {
    // We define our first group. Pages naturally fit a concept of a group
    // You may have other similar actions you wish to "group" together
    group("Front page", function() {
        let res = null;
        // As mentioned above, this logic just forces the performance alert for too many urls, use env URL_ALERT to force it
        // It also highlights the ability to programmatically do things right in your script
        if (__ENV.URL_ALERT) {
            res = http.get("http://test.k6.io/?ts=" + Math.round(randomIntBetween(1,2000)));
        } else {
            res = http.get("http://test.k6.io/?ts=" + Math.round(randomIntBetween(1,2000)), { tags: { name: "http://test.k6.io/ Aggregated"}});
        }
        let checkRes = check(res, {
            "Homepage body size is 11278 bytes": (r) => r.body.length === 11278,
            "Homepage welcome header present": (r) => r.body.indexOf("Welcome to the k6.io demo site!") !== -1
        });

        // Record check failures
        checkFailureRate.add(!checkRes);

        // Record time to first byte and tag it with the URL to be able to filter the results in Insights
        timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });

        // Load static assets
        group("Static assets", function() {
            let res = http.batch([
                ["GET", "http://test.k6.io/static/css/site.css", {}, { tags: { staticAsset: "yes" } }],
                ["GET", "http://test.k6.io/static/js/prisms.js", {}, { tags: { staticAsset: "yes" } }]
            ]);
            checkRes = check(res[0], {
                "Is stylesheet 4859 bytes?": (r) => r.body.length === 4859,
            });

            // Record check failures
            checkFailureRate.add(!checkRes);

            // Record time to first byte and tag it with the URL to be able to filter the results in Insights
            /*
            TTFB stands for Time To First Byte. It's a crucial metric in web performance that measures the time it takes for a browser
            to receive the first byte of data from a web server after sending an HTTP request. In simpler terms, 
            it represents the initial delay experienced by a user before any content starts loading on a web page.
            */
            timeToFirstByte.add(res[0].timings.waiting, { ttfbURL: res[0].url, staticAsset: "yes" }); // ttfbURL: This sets a property named ttfbURL with the value of res[0].url. It stores the URL of the request for which the TTFB was measured.
            timeToFirstByte.add(res[1].timings.waiting, { ttfbURL: res[1].url, staticAsset: "yes" });
        });

    });

    sleep(10);

    group("Login", function() {
        let res = http.get("http://test.k6.io/my_messages.php");
        let checkRes = check(res, {
            "Users should not be auth'd. Is unauthorized header present?": (r) => r.body.indexOf("Unauthorized") !== -1
        });
            
        //extracting the CSRF token from the response

        const vars = {};

        vars["csrftoken"] = res
            .html()
            .find("input[name=csrftoken]")
            .first()
            .attr("value");    

        // Record check failures
        checkFailureRate.add(!checkRes);

        let position = Math.floor(Math.random()*loginData.users.length);
        let credentials = loginData.users[position];

        res = http.post("http://test.k6.io/login.php", { login: credentials.username, password: credentials.password, redir: '1', csrftoken: `${vars["csrftoken"]}` });
        checkRes = check(res, {
            "is logged in welcome header present": (r) => r.body.indexOf("Welcome") !== -1
        });

        // Record successful logins
        if (checkRes) {
            successfulLogins.add(1);
        }

        // Record check failures
        checkFailureRate.add(!checkRes, { page: "login" });

        // Record time to first byte and tag it with the URL to be able to filter the results in Insights
        timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });

        sleep(10);
    });
}