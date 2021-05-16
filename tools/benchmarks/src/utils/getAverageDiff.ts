import {BenchmarksDiff} from "../interfaces/Benchmarks";

export function getAverageDiff(type1: string, type2: string, diff: BenchmarksDiff) {
  if (!(diff[type1] && diff[type2])) {
    return 0;
  }
  return (
    // @ts-ignore
    (diff[type1].transferPerSecDiff +
      // @ts-ignore
      diff[type1].requestsPerSecDiff +
      // @ts-ignore
      diff[type2].transferPerSecDiff +
      // @ts-ignore
      diff[type2].requestsPerSecDiff) /
    4
  );
}
