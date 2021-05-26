import {codechecks, CodeChecksReport} from "@codechecks/client";
import {BENCHMARK_OPTIONS} from "./constants";
import {BenchmarkOptions} from "./interfaces/Benchmarks";
import {Benchmarks, getBenchmarks} from "./utils/getBenchmarks";
import {getReport} from "./utils/getReport";
const markdownTable = require("markdown-table");

const benchmarksKey = "tsed/performance-benchmark";

function getCodechecksReport(current: Benchmarks, baseline: Benchmarks | undefined, options: BenchmarkOptions): CodeChecksReport {
  const {description, statistics} = getReport(current, baseline, options);

  return {
    name: "Benchmarks",
    status: "success",
    shortDescription: description,
    longDescription: markdownTable(statistics)
  };
}

export default async function codeChecksBenchmarks() {
  const options: BenchmarkOptions = BENCHMARK_OPTIONS;
  const currentBenchmarks = await getBenchmarks(options);
  await codechecks.saveValue(benchmarksKey, currentBenchmarks);

  if (!codechecks.isPr()) {
    return;
  }
  const baselineBenchmarks = await codechecks.getValue<Benchmarks>(benchmarksKey);
  const report = getCodechecksReport(currentBenchmarks, baselineBenchmarks, options);
  await codechecks.report(report);
}
