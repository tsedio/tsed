// Two-sided 95% quantiles of the Student t distribution, by degrees of freedom.
const T_95 = [
  12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086,
  2.08, 2.074, 2.069, 2.064, 2.06, 2.056, 2.052, 2.048, 2.045, 2.042
];

export function tQuantile95(df) {
  return T_95[df - 1] ?? 1.96;
}

export function median(values) {
  if (!values.length) {
    return NaN;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = sorted.length >> 1;

  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/**
 * Geometric mean of ratios with a 95% confidence interval (Student t-interval on the log ratios).
 * The gap is significant when the interval does not contain 1.
 */
export function summarizeRatios(ratios) {
  const logs = ratios.filter((ratio) => ratio > 0 && Number.isFinite(ratio)).map(Math.log);
  const n = logs.length;

  if (!n) {
    return null;
  }

  const mean = logs.reduce((sum, value) => sum + value, 0) / n;

  if (n === 1) {
    return {n, ratio: Math.exp(mean), low: NaN, high: NaN, significant: false};
  }

  const variance = logs.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (n - 1);
  const margin = tQuantile95(n - 1) * Math.sqrt(variance / n);
  const low = Math.exp(mean - margin);
  const high = Math.exp(mean + margin);

  return {n, ratio: Math.exp(mean), low, high, significant: low > 1 || high < 1};
}

/**
 * Per-round ratios of a target against the baseline, measured in the same round.
 * `higherIsBetter: false` (latency, CPU) inverts the ratio, so that a ratio above 1 always means better.
 */
export function pairedRatios(target, baseline, {higherIsBetter = true} = {}) {
  const ratios = [];

  for (let i = 0; i < Math.min(target.length, baseline.length); i++) {
    if (target[i] == null || baseline[i] == null) {
      continue;
    }

    ratios.push(higherIsBetter ? target[i] / baseline[i] : baseline[i] / target[i]);
  }

  return ratios;
}

export function compare(target, baseline, options) {
  return summarizeRatios(pairedRatios(target, baseline, options));
}

/**
 * Median of a metric over the rounds of a measurement.
 */
export function medianOf(rounds, metric) {
  return median(rounds.filter(Boolean).map((round) => round[metric]));
}
