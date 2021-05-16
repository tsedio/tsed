import {Benchmarks} from "./getBenchmarks";
import {BenchmarksDiff} from "../interfaces/Benchmarks";
import {getAverageDiff} from "./getAverageDiff";

export function getAnalysisDescription(type1: string, type2: string, baseline: Benchmarks | undefined, diff: BenchmarksDiff): string {
  if (!baseline) {
    return "New benchmarks generated";
  }

  const avgDiff = getAverageDiff(type1, type2, diff);

  if (avgDiff > 0) {
    return `Performance improved by ${avgDiff.toFixed(2)}% on average, good job!`;
  }

  if (avgDiff === 0) {
    return `No changes in performance detected`;
  }

  if (avgDiff < 0) {
    return `Performance decreased by ${avgDiff.toFixed(2)}% on average, be careful!`;
  }

  return "";
}
