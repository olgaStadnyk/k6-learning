# Types of load testing

A good load-testing strategy goes beyond just executing a single script. 
Different patterns of traffic create different risk profiles for a given application. For comprehensive preparation, teams must test the system against different types of load testing.

![checks](/assets/chart-load-test-types-overview.png)

Load testing is a subset of performance testing that generally looks for how a system responds to normal and peak usage.
You’re looking for slow response times, errors, crashes, and other issues to determine how many users and transactions the system can accommodate before performance suffers.

## Load testing vs. performance testing  
While load testing and performance testing are related, they are distinct types of testing.

As we’ve discussed, **load** testing simulates user activity to determine how well a system can handle increased traffic or load.

**Performance** testing is an umbrella term for measuring how well a system or application performs overall. This could include testing for speed, scalability, reliability, and resource utilization in order to identify areas of improvements. Performance testing includes load testing but also encompasses other types of testing, such as browser performance testing and synthetic monitoring.

# 1. Smoke test
Smoke tests verify the system functions with *minimal load*, and they are used to gather baseline performance values. Smoke tests are also called shakeout tests.

This test type consists of running tests with a few VUs. For example, more than 5 virtual users (VUs) could be considered a mini-load test. Similarly, the test should be executed for a short period, either a low number of iterations or a duration from seconds to a few minutes maximum.

<details>
  <summary>details</summary>

  ![checks](/assets/chart-smoke-test-overview.png)

  ### When to run a Smoke test
  Teams should run smoke tests **whenever a test script is created or updated**. Smoke testing should also be done whenever the relevant application code is updated.

  It’s a good practice to run a smoke test as a first step, with the following goals:

  - Verify that your test script doesn’t have errors.
  - Verify that your system doesn’t throw any errors (performance or system related) when under minimal load.
  - Gather baseline performance metrics of your system’s response under minimal load.
  - With simple logic, to serve as a synthetic test to monitor the performance and availability of production environments.

</details>

_____________

# 2. Average-load test
Average-load tests assess how the system performs under a *typical load* for your system or application. Typical load might be *a regular day in production* or an average timeframe in your daily traffic. This test also might be called **a day-in-life test** or volume test.

Average-load tests simulate the number of concurrent users and requests per second that reflect average behaviors in the production environment. This type of test typically *increases the throughput or VUs gradually and maintains that average load for some time*. Depending on the system’s characteristics, the test may stop suddenly or have a short ramp-down period.

<details>
  <summary>details</summary>

  ![checks](/assets/chart-average-load-test-overview.png)

  ### You should run an average-load test to:

  - Assess the performance of your system under a typical load.
  - Identify early degradation signs during the ramp-up or full load periods.
  - Assure that the system still meets the performance standards after system changes (code and infrastructure).

### Considerations
  When you prepare an average-load test, consider the following:

  - #### Know the specific number of users and the typical throughput per process in the system.

  To find this, look through APMs or analytic tools that provide information from the production environment. If you can’t access such tools, the business must provide these estimations.

  - #### Gradually increase load to the target average.

  That is, use a ramp-up period. This period usually lasts between 5% and 15% of the total test duration. A ramp-up period has many essential uses:

  It gives your system time to warm up or auto-scale to handle the traffic.
  It lets you compare response times between the low-load and average-load stages.
  If you run tests using our cloud service, a ramp up lets the automated performance alerts understand the expected behavior of your system.

  - #### Maintain average for a period longer than the ramp up.

  Aim for an average duration at least five times longer than the ramp-up to assess the performance trend over a significant period of time.

  - #### Consider a ramp-down period.

  The ramp down is when virtual user activity gradually decreases. The ramp down usually lasts as long as the ramp up or a bit less.

</details> 

_______

# 3. Stress test
Stress tests help you discover how the system functions with the load at peak traffic. Stress testing might also be called rush-hour testing, surge testing, or scale testing. 

Stress testing assesses how the system performs when loads are heavier than usual.

The load pattern of a stress test resembles that of an average-load test. The main difference is higher load. To account for higher load, the ramp-up period takes longer in proportion to the load increase. Similarly, after the test reaches the desired load, it might last for slightly longer than it would in the average-load test.

<details>
  <summary>details</summary>

![checks](/assets/chart-stress-test-overview.png)

### When to perform a Stress test
Stress tests verify the stability and reliability of the system under conditions of heavy use. Systems may receive higher than usual workloads on unusual moments such as process deadlines, paydays, rush hours, ends of the workweek, and many other behaviors that might cause frequent higher-than-average traffic.

- Load should be higher than what the system experiences on average.
- Only run stress tests after running average-load tests.
- Re-use the Average-Load test script.

  Modify the parameters to have higher load or VUs.

- Expect worse performance compared to average load.

</details>

_____

# 4. Spike test

A spike test verifies whether the system survives and performs under sudden and massive rushes of utilization.

Spike testing increases to extremely high loads in a very short or non-existent ramp-up time. In the same way, the ramp-down is very fast or non-existent, letting the process iterate only once.

<details>
  <summary>details</summary>

![checks](/assets/chart-spike-test-overview.png)

### When to perform a spike test
This test must be executed when the system expects to receive a sudden rush of activity.

When the system expects this type of behavior, the spike test helps identify how the system will behave and if it will survive the sudden rush of load. The load is considerably above the average and might focus on a different set of processes than the other test types.

### Considerations
When preparing for a spike test, consider the following:

- #### Focus on key processes in this test type.

  Assess whether the spike in traffic triggers the same or different processes from the other test types. Create test logic accordingly.

- #### The test often won’t finish.

  Errors are common under these scenarios.

- #### Run, tune, repeat.

  When your system is at risk of spike events, the team must run a spikes test and tune the system several times.

- #### Monitor.

  Backend monitoring is a must for successful outcomes of this test.

### Spike testing in k6
The key differentiators of the spike test are the simulation of sudden and very high loads. It lacks a plateau (full load) duration or is usually brief.

Sometimes, the test may require a load plateau for some time. If a plateau is needed, it’s generally short. A ramp-down can also be quick or unnecessary as the goal is to suddenly increase the system’s load.

### Results analysis
Some performance metrics to assess in spike tests include pod speeds, recovery times after the load rush, time to return to normal, or the behavior on crucial system processes during the overload.

</details>

_____

# 5. Breakpoint test
Breakpoint tests discover your system’s limits. Breakpoint testing is also known as capacity, point load, and limit testing.

**The reasons you might want to conduct a breakpoint test include:**

- To tune or care for your system’s weak spots to reallocate those higher limits at higher levels.
- To help plan remediation steps in those cases and prepare for when the system nears those limits.

It’s not only about knowing at what point your system will fail. It’s also a test to help determine where and how a system starts to fail and helps teams prepare for such limits.

A breakpoint test ramps to unrealistically high numbers. This test commonly has to be stopped manually or automatically as thresholds start to fail. When these problems appear, the system has reached its limits.

<details>
  <summary>details</summary>

![checks](/assets/chart-breakpoint-test-overview.png)

### When to run a breakpoint test
Teams execute a breakpoint test whenever they must know their system’s diverse limits. Some conditions that may warrant a breakpoint test include the following:

- The need to know if the system’s load expects to grow continuously
- If current resource consumption is considered high
- After significant changes to the code-base or infrastructure.

How often to run this test type depends on the risk of reaching the system limits and the number of changes to provision infrastructure components.

Once the breakpoint runs and the system limits have been identified, you can repeat the test after the tuning exercise to validate how it impacted limits. Repeat the test-tune cycle until the team is satisfied.

### System failure could mean different things to different teams:

- Degraded performance. The response times increased, and user experience decreased.
- Troublesome performance. The response times get to a point where the user experience severely degrades.
- Timeouts. Processes are failing due to extremely high response times.
- Errors. The system starts responding with HTTP error codes.
- System failure. The system collapsed.

#### Run breakpoints only when the system is known to perform under all other test types.

The breakpoint test might go far if the system performs poorly with the previous testing types.

### Breakpoint testing in k6
The breakpoint test is straightforward. Load slowly ramps up to a considerably high level. It has no plateau, ramp-down, or other steps. And it generally fails before reaching the indicated point.

The test keeps increasing load or VUs until it reaches the defined breaking point or system limits, at which point the test stops or is aborted.

The test must be stopped before it completes the scheduled execution. You can stop the test manually or with a threshold:

- To stop k6 manually in the CLI, press Ctrl+C in Linux or Windows, and Command . in Mac.
- To stop the test using a threshold, you must define abortOnFail as true.


</details>

_____

# 6. Soak test
Soak tests are a variation of the average-load test. The main difference is the test duration. In a soak test, the peak load is usually an average load, but the peak load duration extends several hours or even days. Though the duration is considerably longer, the ramp-up and ramp-down periods of a soak test are the same as an average-load test.

A soak test might also be called an endurance, constant high load, or stamina test.

Soak tests focus on analyzing the following:

- The system’s degradation of performance and resource consumption over extended periods.
- The system’s availability and stability during extended periods.

<details>
  <summary>details</summary>

![checks](/assets/chart-soak-test-overview.png)

### When to perform a Soak test
Most systems must stay turned on and keep working for days, weeks, and months without intervention. This test verifies the system stability and reliability over extended periods of use.

This test type checks for common performance defects that show only after extended use. Those problems include response time degradation, memory or other resource leaks, data saturation, and storage depletion.

### Considerations
When you prepare to run a soak test, consider the following:

- #### Configure the duration to be considerably longer than any other test.

    Some typical values are 3, 4, 8, 12, 24, and 48 to 72 hours.

- #### If possible, re-use the average-load test script

    Changing only the peak durations for the aforementioned values.

- #### Don’t run soak tests before running smoke and average-load tests.

    Each test uncovers different problems. Running this first may cause confusion and resource waste.

- #### Monitor the backend resources and code efficiency. 

    Since we are checking for system degradation, monitoring the backend resources and code efficiency is highly recommended. Of all test types, backend monitoring is especially important for soak tests.

### Soak testing in k6
The soak test is almost the same as the average-load test. The only difference is the increased duration of the load plateau.

1. Increase the load until it reaches an average number of users or throughput.
2. Maintain that load for a considerably longer time.
3. Finally, depending on the test case, stop or ramp down gradually.

</details>

_________

<table border="1">
  <thead>
    <tr>
      <th>Type</th>
      <th>VUs/Throughput</th>
      <th>Duration </th>
      <th>When?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Smoke</td>
      <td>Low</td>
      <td>Short (seconds or minutes)</td>
      <td>When the relevant system or application code changes. It checks functional logic, baseline metrics, and deviations.</td>
    </tr>
    <tr>
      <td>Average Load</td>
      <td>Average production</td>
      <td>Mid (5-60 minutes)</td>
      <td>Often to check system maintains performance with average use.</td>
    </tr>
    <tr>
      <td>Stress</td>
      <td>High (above average)</td>
      <td>Mid (5-60 minutes)</td>
      <td>When system may receive above-average loads to check how it manages.</td>
    </tr>
    <tr>
      <td>Soak</td>
      <td>Average</td>
      <td>Long (hours)</td>
      <td>After changes to check system under prolonged continuous use.</td>
    </tr>
    <tr>
      <td>Spike</td>
      <td>Very high</td>
      <td>Short (a few minutes)</td>
      <td>When the system prepares for seasonal events or receives frequent traffic peaks.</td>
    </tr>
    <tr>
      <td>Breakpoint</td>
      <td>Increases until break</td>
      <td>As long as necessary</td>
      <td>A few times to find the upper limits of the system.</td>
    </tr>
  </tbody>
</table>
