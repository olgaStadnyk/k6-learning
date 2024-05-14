# Groups and Tags

To help you visualize, sort, and filter your test results, k6 adds the following to your results:

- Tags categorize your checks, thresholds, custom metrics, and requests for in-depth filtering.
- Groups apply tags to the script's functions.

# Tags 

Tags are a powerful way to categorize your k6 entities and filter test results.

k6 provides two types of tags:

- System tags. Tags that k6 automatically assigns.
- User-defined tags. Tags that you add when you write your script.

A tag is a way to label elements in k6, and tags can be used in conjunction with groups. Unlike groups, tags won't cause k6 to report metrics per tag.

Here's how to tag a request:
```
import { sleep, group } from 'k6'
import http from 'k6/http'

export default function () {    
  let response

  group('01_Homepage', function () {
    response = http.get('http://ecommerce.k6.io/', {
      tags: {
        page: 'Homepage',
        type: 'HTML',
      }
    })

	// ... (other requests in the group)

	// ... (other requests in the group)

  })
}

```

The tags section, added to the request, defines two different tags:

a tag named page, whose value for this request is Homepage, and
a tag named type, whose value for this request is HTML
You can change both the name and the value of the tag as you feel is appropriate, and you can use multiple tags.

By default, k6 adds a name tag to every request, with the value equal to the URL. You can override this behavior if you'd like to name the request something easier to read.

With tags, you can label:

- requests
- checks
- thresholds
- custom metrics
- all metrics within a test

For more detailed information about tags, click here.

Test-wide tags
Besides attaching tags to requests, checks, and custom metrics, you can set test-wide tags across all metrics. You can set these tags in two ways:

- In the CLI, using one or more --tag NAME=VALUE flags

- In the script itself:

```
export const options = {
  tags: {
    name: 'value',
  },
};
```

## Tagging stages
Thanks to some helper functions in the k6-jslib-utils project, if an executor supports the stages option, you can add tags with the current ongoing stage. Similar to other tags tag, the tag is added to all samples collected during the iteration.

One way to tag the executed operations is to invoke the tagWithCurrentStageIndex function for setting a stage tag for identifying the stage that has executed them:

```
import http from 'k6/http';
import exec from 'k6/execution';
import { tagWithCurrentStageIndex } from 'https://jslib.k6.io/k6-utils/1.3.0/index.js';

export const options = {
  stages: [
    { target: 5, duration: '5s' },
    { target: 10, duration: '10s' },
  ],
};

export default function () {
  tagWithCurrentStageIndex();

  // all the requests will have a `stage` tag
  // with its value equal to the index of the stage
  http.get('https://test.k6.io'); // e.g. {stage: "1"}
}

```

to see the results run:  `k6 run --out json=test_results.json api-tests/tags.js `

![checks](/assets/tags-results.png)

## URL grouping

As mentioned earlier, k6 adds a tag `name` to all requests by default and sets the value to the request URL. This is useful when each URL represents a different page. Sometimes, however, you may decide that your test scenario needs to include pages that are similar enough to be analyzed as one. For example, if you're testing an e-commerce site, it might be more useful for you to have all product pages reported as one, rather than as disparate products. 

[URL grouping](https://k6.io/docs/using-k6/http-requests/#url-grouping) is an implementation of tags that is especially useful when you are generating dynamic URLs, like this:

```js
import http from 'k6/http'

export default function () {
    let product = ['album', 'beanie', 'beanie-with-logo'];
    let rand = Math.floor(Math.random() * product.length);
    let productSelected = product[rand];
    let response = http.get('http://ecommerce.test.k6.io/product/' + productSelected, {
        tags: { name: 'ProductPage'},
    });
}
```

In the example above, the script randomly visits one of these three product pages:
- `http://ecommerce.test.k6.io/product/album`
- `http://ecommerce.test.k6.io/product/beanie`,
- `http://ecommerce.test.k6.io/product/beanie-with-logo` 

Without URL grouping, each of these would be tagged with a different name (equal to their URL). _With_ URL grouping, these pages are tagged with the same name, `ProductPage`. Here's a line from the CSV results obtained by running the script:

```plain
http_req_duration,1645010817,1203.076000,,,,true,,GET,ProductPage,HTTP/1.1,default,,301,,,http://ecommerce.test.k6.io/product/beanie,
```

# Groups

Groups in k6 are a way to organize your test script and track performance metrics for specific sets of related requests. They act like logical transactions within your test.

Here's a breakdown of what groups offer:

**Purpose:**

- Organize test logic into cohesive units representing transactions or user flows.
- Track performance metrics (durations, errors) specifically for those grouped requests.

**How to Use Groups:**

1. **Define a Group:** Use the `group(name, function)` function to create a named group. The `function` argument defines the requests or actions within that group.

2. **Nested Groups:** Groups can be nested within other groups to represent complex user journeys.

3. **Metrics:** k6 automatically reports metrics like execution duration and errors for each group, providing insights into the performance of those specific transactions.

**Benefits of Groups:**

- **Organized Script:** Groups improve code readability and maintainability by separating functionalities.
- **Targeted Performance Analysis:** You can analyze performance metrics (e.g., average response times, error rates) for specific transactions within your test.
- **Clearer Test Reporting:** Grouped metrics provide a more focused view of performance data in test reports.

**Example:**

```javascript
import http from 'k6/http';

export default function () {
  group('Login Flow', function () {
    http.post('https://test-api.k6.io/auth/token/login/', {
      username: 'test-user',
      password: 'supersecure',
    });
    http.get('https://test-api.k6.io/profile');
  });

  group('Product Page Flow', function () {
    http.get('https://test-api.k6.io/products/1');
    http.get('https://test-api.k6.io/products/1/reviews');
  });
}
```

In this example, `Login Flow` and `Product Page Flow` groups track performance metrics for their respective sets of requests, allowing you to analyze login and product browsing performance separately.

**Things to Consider:**

- Groups don't create separate VU threads. All requests within a group are executed sequentially by the same virtual user.
- Use groups strategically to break down complex user journeys into manageable units for performance analysis.

## Groups do the following tasks internally:

- For each group() function, k6 emits a group_duration metric, which contains the total time to execute the group function.

- When a taggable resource—a check, request, or custom metric—runs within a group, k6 sets the tag group with the current group name. For more info, refer to the Tags section.

Both options, the group_duration metric and group tagging, could help you analyze and visualize complex test results. Check out how they work in your k6 result output.
