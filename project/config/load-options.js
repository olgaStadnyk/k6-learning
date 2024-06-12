export const AverageStages = [
  { duration: "5m", target: 15 },
  { duration: "30m", target: 15 },
  { duration: "5m", target: 0 },
];

export const StressStages = [
  { duration: "10m", target: 30 },
  { duration: "40m", target: 30 },
  { duration: "5m", target: 0 },
];

export const SpikeStages = [
  { duration: "30s", target: 1000 }, // 2000
  { duration: "10s", target: 0 },
];

export const SoakStages = [
  { duration: "5m", target: 15 },
  { duration: "50m", target: 15 }, // 2-4 h
  { duration: "5m", target: 0 },
];

export const SmokeOptions = {
  vus: 2,
  duration: "30s",
};

export const BreakpointOptions = {
  executor: 'ramping-arrival-rate', //Assure load increase if the system slows
  stages: [
    { duration: '2h', target: 20000 }, // just slowly ramp-up to a HUGE load
]};