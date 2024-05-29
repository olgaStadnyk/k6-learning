# k6-learning

Grafana k6 is an open-source load testing tool that makes performance testing easy and productive for engineering teams. k6 is free, developer-centric, and extensible.

Using k6, you can test the reliability and performance of your systems and catch performance regressions and problems earlier. k6 will help you to build resilient and performant applications that scale.

- Load testing

k6 is optimized for minimal resource consumption and designed for running high load tests (spike, stress, soak tests) .

- Browser testing

Through k6 browser, you can run browser-based performance testing and catch issues related to browsers only which can be skipped entirely from the protocol level.

- Performance and synthetic monitoring

With k6, you can automate and schedule to trigger tests very frequently with a small load to continuously validate the performance and availability of your production environment.

## Installation

### MacOS:
```
brew install k6
```

### Windows:

If you use the Chocolatey package manager you can install the unofficial k6 package with:
```
choco install k6
```

If you use the Windows Package Manager, install the official packages from the k6 manifests (created by the community):
```
winget install k6 --source winget
```

### Linux:
https://grafana.com/docs/k6/latest/set-up/install-k6/#linux 

## Configure k6 IntelliSense

IntelliSense refers to code editing features like intelligent code completion and quick access to documentation. These features can significantly improve the developer experience and productivity when working on k6 scripts in your editor of choice. Notable features are:

- Auto-completion of k6 functions, methods, and classes.
- Auto imports of k6 modules.
- Access to k6 documentation when writing and hovering code.

![IntelliSense example](/assets/IntelliSense.png)

```
npm i
```

## Generate the first test with explanation comments

To run a simple local script:

1. Create and initialize a new script by running the following command:
```
k6 new
```
This command creates a new script file named *script.js* in the current directory. You can also specify a different file name as an argument to the k6 new command, for example `k6 new my-test.js`.

2. Run k6 with the following command:
```
k6 run script.js
```

## Run the first simple test

Navigate to Readme file: first-test/README.md

## The structure of the folders

- `.github/workflows` - YAML files that define automated workflows for your project.
- `AI` - an example of how AI can help to generate tests
- `api-tests` - contains documentation and a lot of tests examples.
- `assets` - screenshots used in documentations
- `browser-test` - contains documentation and tests examples for Browser testing
- `cicd` - test example used in GH actions and docs
...


## Useful links

- [Udemy course: "Performance Testing: Introduction to k6 for Beginners"](https://levi9.udemy.com/course/k6-load-testing-performance-testing/)
- [Grafana k6 doc](https://grafana.com/docs/k6/latest/)

