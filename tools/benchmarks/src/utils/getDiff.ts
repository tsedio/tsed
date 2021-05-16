import * as bytes from "bytes";
import {Benchmarks} from "./getBenchmarks";
import {BenchmarkOptions, BenchmarksDiff} from "../interfaces/Benchmarks";

export function getRequestDiff(currentRequest: number, baselineRequest: number) {
  return 1 - currentRequest / baselineRequest;
}

export function formatPerc(n: number) {
  return (n > 0 ? "+" : "") + (n * 100).toFixed(2) + "%";
}

export function getTransferDiff(currentTransfer: string, baselineTransfer: string): number {
  return 1 - bytes.parse(currentTransfer) / bytes.parse(baselineTransfer);
}

export function getDiff(current: Benchmarks, baseline: Benchmarks | undefined, options: BenchmarkOptions): BenchmarksDiff {
  const diff: BenchmarksDiff = {};

  for (const l of options.libs) {
    if (!baseline) {
      // @ts-ignore
      diff[l.value] = undefined;
      continue;
    }

    const currentValue = current[l.value];
    const baselineValue = baseline[l.value];

    if (baselineValue) {
      diff[l.value] = {
        requestsPerSecDiff: getRequestDiff(currentValue.requestsPerSec, baselineValue.requestsPerSec),
        transferPerSecDiff: getTransferDiff(currentValue.transferPerSec, baselineValue.transferPerSec)
      };
    }
  }

  return diff;
}
