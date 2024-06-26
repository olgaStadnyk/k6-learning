# Welcome to k6 Learning Project

This project serves as a k6 learning resource and a starting point for your own k6 load testing projects. It demonstrates various testing scenarios using the [demoblaze.com](https://www.demoblaze.com/index.html) e-commerce website. It's a simulated e-commerce website perfect for practicing k6 features.

Before starting to deep dive into this project, it would be better to go through `first-test`, `api-tests`, `browser-test`, etc.. folders. There are a lot of useful information that give you the basis of k6 knowledge. 

Also, all pre requirements and installations are in the main `Readme.md` file.

## Key Functionalities Covered:

- **API Testing**: Learn how to interact with APIs using k6 for performance testing.
- **Browser Testing**: Explore simulating user interactions on web pages with a virtual browser.
- **Configuration Management**: Understand how to configure load test settings like virtual users and test duration.
- **Data-Driven Testing**: See examples of using data files (CSV, JSON) for test cases.
- **Reusable Code**: Discover page object models for organizing interactions with web pages and APIs.
- **Metrics & Reporting**: Explore basic metrics collection and potential reporting approaches.

## Learning by Example:

By exploring the different test examples included in this project, you can gain practical experience with these k6 functionalities.

## Project Structure:

- **config**: This folder contains configuration files for the load tests. 

  It includes files:
  - constants.js - constants used in the project.
  - load-options.js - defines settings for the load test, like the number of virtual users and the duration of the test.
  - metrics.js - counter metric to calculate the amount of the errors during the test.

- **data** : This folder contain data files used by the tests, such as CSV files with credentials `credentials.csv` or product information `products.json`.

- **docs**: Markdown files that shortly describe specific tests types and how to run the tests.

- **pages**: This folder contains page object files that represent the web pages (`browser` folder) and APIs under test (`api` folder). These files contain reusable code for interacting with the web pages or APIs. 

- **results**: This folder stores some results of the load tests.

- **tests**: This folder contains the k6 test scripts themselves. The subfolders here (api, browser, and hybrid) - separate test scripts for API testing, browser testing, and  hybrid tests that involve both API and browser interactions.

- **utils**: This folder might contain utility functions and helper code used by the test scripts. There are two files presented: `check-response.js` contains functions to check the response of API requests, and `common-functions.js` contains general-purpose functions used throughout the tests.

## Running the test

```bash
k6 run <script-to-run>
```
more ways to run tests are here: `docs/02.smoke.md`.


## Learning with k6:

This project can be a valuable tool for learning k6. By exploring the different test examples, you can gain practical experience with k6 functionalities.

- Modify the existing tests locally to explore variations and edge cases.
- Add new tests for functionalities not already covered.

This project is intended to be a springboard for your k6 learning journey! 🥳