import {BenchmarkOptions, BenchmarksDiff} from "../interfaces/Benchmarks";
import {Benchmarks} from "./getBenchmarks";
import {formatPerc} from "./getDiff";

export function getStatistics(
  current: Benchmarks,
  baseline: Benchmarks | undefined,
  diff: BenchmarksDiff | undefined,
  options: BenchmarkOptions
) {
  function printTableRow(id: string, label: string): string[] {
    return [
      label,
      current[id].requestsPerSec.toFixed(0),
      current[id].transferPerSec,
      // @ts-ignore
      baseline && diff[id] ? formatPerc(diff[id].requestsPerSecDiff) : "-",
      // @ts-ignore
      baseline && diff[id] ? formatPerc(diff[id].transferPerSecDiff) : "-"
    ];
  }

  return [
    ["", "Req/sec", "Trans/sec", "Req/sec DIFF", "Trans/sec DIFF"],
    ...options.libs.map(({label, value}) => printTableRow(value, label))
  ];
}
