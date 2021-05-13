import chalk from "chalk";
import {spawn} from "child_process";
import logger from "fancy-log";
import {join} from "path";
import {BenchmarkOptions} from "../interfaces/Benchmarks";

const wrkPkg = require("wrk");

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
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: options.port as any
    }
  });

  child.unref();

  await sleep(2000);

  const result = await wrk({
    url: `http://localhost:${options.port}`,
    threads: options.threads,
    duration: options.duration,
    connections: options.connections
  });

  child.kill();

  return result;
}

export async function getBenchmarks(options: BenchmarkOptions) {
  const results: Benchmarks = {};
  for await (const lib of options.libs) {
    logger.info(chalk.cyan("Start benchmark for"), "'" + chalk.green(lib.value) + "'...");
    results[lib.value] = await runBenchmarkOfLib(lib.value, options);
    logger.info(chalk.cyan("Start benchmark for"), "'" + chalk.green(lib.value) + "'... done");
  }
  return results;
}
