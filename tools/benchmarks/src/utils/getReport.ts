import {BenchmarkOptions} from "../interfaces/Benchmarks";
import {Benchmarks} from "./getBenchmarks";
import {getDiff} from "./getDiff";
import {getAnalysisDescription} from "./getAnalysisDescription";
import {getStatistics} from "./getStatistics";

export function getReport(current: Benchmarks, baseline: Benchmarks | undefined, options: BenchmarkOptions) {
  const diff = getDiff(current, baseline, options);

  const description = options.compares
    .map(([type1, type2]) => {
      return `${type1} vs ${type2}: ${getAnalysisDescription(type1, type2, baseline, diff)}`;
    })
    .join("\n");

  return {
    diff,
    description,
    statistics: getStatistics(current, baseline, diff, options)
  };
}
