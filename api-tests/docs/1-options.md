Test options are configuration values that affect how your test script is executed, such as the number of VUs or iterations, the duration of your test, and more. They are also sometimes called "test parameters".

k6 comes with some default test options, but there are four different ways to change the test parameters for a script:

- You can include command-line flags when running a k6 script (such as `k6 run --vus 10 --iterations 30`).
- You can define environment variables on the command-line that are passed to the script.
- You can define them within the test script itself.
- You can include a configuration file.

To use test options within a script, add the following lines to your script. By convention, it's best to add it after the import statements and before the default function, so that the options are easily read upon opening the script:

```
export let options = {
  vus: 10,
  iterations: 40,
};
```

If you set the number of VUs, you need to additionally specify how long those users should be executed for, using one of the following options:

- iterations
- durations
- stages

## Iterations

Control the number of times each VU repeats the actions defined within a scenario. This allows for testing specific scenarios multiple times and gathering more data.

```
  vus: 10,
  iterations: 40,
```

Setting the number of iterations in test options defines it for all users. In the example above, the test will run for a total of 40 iterations, with each of the 10 users executing the script exactly 4 times.

## Duration

Setting the duration instructs k6 to repeat (iterate) the script for each of the specified number of users until the duration is reached.

Duration can be set using h for hours, m for minutes, and s for seconds, like these examples:

- duration: '1h30m'
- duration: '30s'
- duration: '5m30s'

If you set duration but don't specify a number of VUs, k6 will use the default VU number of 1.

If you set the duration in conjunction with setting the number of iterations, the value that ends earlier is used. For example, given the following options:

```
  vus: 10,
  duration: '5m',
  iterations: 40,
```

k6 will execute the test for 40 iterations or 5 minutes, whichever ends earlier. If it takes 1 minute to finish 40 total iterations, the test will end after 1 minute. If it takes 10 minutes to finish 40 total iterations, the test will end after 5 minutes.

## Stages

Defining iterations and durations both cause k6 to execute your test script using a simple load profile: VUs are started, sustained for a certain time or number of iterations, and then ended.

What if you want to add a ramp-up or ramp-down, so that the profile looks more like this?

*Ramp-up is the amount of time it takes for a load test to go from 0 users to the desired number of users, and is found at the beginning of a test. Ramp-down is the time it takes for a load test to go from the desired number of users back down to 0, and is found at the end of a test.*

![checks](/assets/load_profile-constant.png)

In that case, you may want to use stages.

```
export let options = {
  stages: [
    { duration: '30m', target: 100 },
    { duration: '1h', target: 100 },
    { duration: '5m', target: 0 },
  ],
};
```

1. The first step is a gradual ramp-up from 0 VUs to 100 VUs.
2. he second step defines the steady state. The load is held constant at 100 VUs for 1 hour.
3. Then, the third step is a gradual ramp-down from 100 VUs back to 0, at which point the test ends.

More options:
https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/#options-reference 