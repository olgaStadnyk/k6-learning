import { sleep } from 'k6';

export function generateTimer(min, max) {
  if (arguments.length === 1) {
    max = min;
    min = 0;
  }
  sleep(Math.floor(Math.random() * (max - min)) + min);
}