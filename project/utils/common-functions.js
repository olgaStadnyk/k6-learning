import { sleep } from 'k6';

/**
 * Generates a random sleep time between min and max (inclusive) and pauses the execution.
 * 
 * @param {number} min - Minimum sleep time in seconds.
 * @param {number} max - Maximum sleep time in seconds.
 */
export function waitTime(min, max) {
  if (typeof min !== 'number' || ((typeof max !== 'number') && (typeof max !== 'undefined'))) {
      throw new Error('Both min and max parameters should be numbers');
  }

  // If only one argument is provided, treat it as the max, with min defaulting to 0
  if (arguments.length === 1) {
      max = min;
      min = 0;
  }

  // Ensure min is not greater than max
  if (min > max) {
      throw new Error('Min parameter should not be greater than max parameter');
  }

  // Calculate a random sleep time between min and max (inclusive)
  const sleepTime = Math.random() * (max - min) + min;
  
  // Pause execution for the calculated sleep time
  sleep(sleepTime);
}

export function executeStep(stepFunction, waitTimeDuration = 1) {
    const response = stepFunction();
    waitTime(waitTimeDuration);
    return response;
}

export function generateGUID() {
    let a = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return a;
}