import chalk from "chalk";
import {spawn} from "child_process";
import logger from "fancy-log";
import {join} from "path";
import {BenchmarkOptions} from "../interfaces/Benchmarks";

const wrkPkg = require("wrk");

interface WrkMemoryUsage {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
}

interface WrkResults {
  transferPerSec: string;
  requestsPerSec: number;
  connectErrors: string;
  readErrors: string;
  writeErrors: string;
  timeoutErrors: string;
  requestsTotal: number;
  durationActual: string;
  transferTotal: string;
  latencyAvg: string;
  latencyStdev: string;
  latencyMax: string;
  latencyStdevPerc: number;
  rpsAvg: string;
  rpsStdev: string;
  rpsMax: string;
  rpsStdevPerc: number;
  memories: {
    min: WrkMemoryUsage;
    max: WrkMemoryUsage;
    details: WrkMemoryUsage[];
  };
}

export interface Benchmarks {
  [lib: string]: WrkResults;
}

const wrk = (options: any) =>
  new Promise<WrkResults>((resolve, reject) => wrkPkg(options, (err: any, result: any) => (err ? reject(err) : resolve(result))));

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

async function runBenchmarkOfLib(lib: string, options: BenchmarkOptions): Promise<WrkResults> {
  const libPath = join(options.baseDir, `${lib}/index.js`);

  const child = spawn("node", [libPath], {
    detached: true,
    stdio: ["ignore", "pipe", process.stderr],
    env: {
      ...process.env,
      PORT: options.port as any
    }
  });

  child.unref();

  let chunk = "";

  child.stdout.on("data", (message) => {
    chunk += message.toString();
  });

  await sleep(2000);

  const result = await wrk({
    url: `http://localhost:${options.port}`,
    threads: options.threads,
    duration: options.duration,
    connections: options.connections
  });

  await sleep(1000);

  child.kill();

  const memories = chunk.split("\n").reduce((acc, line) => {
    try {
      acc.push(JSON.parse(line.trim()));
    } catch (er) {}

    return acc;
  }, [] as WrkMemoryUsage[]);

  (result as any).memories = buildMemoryUsage(memories);

  return result;
}

export async function getBenchmarks(options: BenchmarkOptions) {
  const results: Benchmarks = {};
  for await (const lib of options.libs) {
    logger.info(chalk.cyan("Start benchmark for"), "'" + chalk.green(lib.value) + "'...");
    results[lib.value] = await runBenchmarkOfLib(lib.value, options);
    console.log("");
    logger.info(chalk.cyan("Start benchmark for"), "'" + chalk.green(lib.value) + "'... done");
  }
  return results;
}

function buildMemoryUsage(memories: WrkMemoryUsage[]) {
  return memories.reduce(
    (report, memory) => {
      if (memory.heapUsed < report.min.heapUsed) {
        report.min = memory;
      }

      if (report.max.heapUsed < memory.heapUsed) {
        report.max = memory;
      }
      const previous = report.details[report.details.length - 1];

      if (memory.heapUsed < previous.heapUsed) {
        report.details.push(memory);
        report.garbage += 1;
      } else {
        report.details[report.details.length - 1] = memory;
      }

      return report;
    },
    {
      min: memories[0],
      max: memories[0],
      details: [memories[0]],
      garbage: 0
    }
  );
}
