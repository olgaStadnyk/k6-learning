import { Counter } from 'k6/metrics';

export const allErrors = new Counter('error_counter');
