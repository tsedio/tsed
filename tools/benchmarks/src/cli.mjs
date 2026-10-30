#!/usr/bin/env node
// Usage:
//   yarn bench:compare 8.44.1 8.44.12            compare two published versions
//   yarn bench:compare 8.44.12 local             compare the last release with this checkout (after `yarn build`)
//   yarn bench --targets 8.40.0,8.44.1,local --platforms express,fastify --rounds 10
// The first target is the baseline. Every target of a comparison is measured in the same run.
import {spawnSync} from "node:child_process";
import {mkdirSync, writeFileSync} from "node:fs";
import {createRequire} from "node:module";
import {join, resolve} from "node:path";
import {parseArgs} from "node:util";

import {renderReport} from "./report.mjs";
import {DEFAULTS, detectPinning, run} from "./run.mjs";
import {BENCH_DIR} from "./targets.mjs";

const list = (value) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : undefined;

function parseOptions(argv) {
  const {values, positionals} = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      targets: {type: "string"},
      platforms: {type: "string"},
      routes: {type: "string"},
      rounds: {type: "string"},
      duration: {type: "string"},
      warmup: {type: "string"},
      connections: {type: "string"},
      startups: {type: "string"},
      seed: {type: "string"},
      out: {type: "string"},
      "local-dir": {type: "string", multiple: true},
      "no-raw": {type: "boolean"},
      help: {type: "boolean", short: "h"}
    }
  });

  if (values.help) {
    return {help: true};
  }

  const targets = list(values.targets) || positionals.filter((arg) => arg !== "compare");
  const localDirs = Object.fromEntries((values["local-dir"] || []).map((entry) => entry.split("=")));
  const int = (value, fallback) => (value === undefined ? fallback : Number.parseInt(value, 10));

  return {
    targets,
    localDirs,
    platforms: list(values.platforms) || DEFAULTS.platforms,
    routes: list(values.routes) || DEFAULTS.routes,
    rounds: int(values.rounds, DEFAULTS.rounds),
    duration: int(values.duration, DEFAULTS.duration),
    warmup: int(values.warmup, DEFAULTS.warmup),
    connections: int(values.connections, DEFAULTS.connections),
    startups: int(values.startups, DEFAULTS.startups),
    seed: int(values.seed, undefined),
    raw: !values["no-raw"],
    out: resolve(values.out || join(BENCH_DIR, "results", new Date().toISOString().replace(/[:.]/g, "-")))
  };
}

const HELP = `Usage: yarn bench:compare <baseline> <target...> [options]
       yarn bench --targets <baseline>,<target...> [options]

Targets: a published version (8.44.1), "local" (packages built in this checkout, run "yarn build" first)
         or "local-<name>" with --local-dir local-<name>=<path to another built checkout>.

Options:
  --platforms express,koa,fastify   platforms to measure (default: all)
  --routes hello,users,orders-create,orders-list
  --rounds ${DEFAULTS.rounds}  --duration ${DEFAULTS.duration}  --warmup ${DEFAULTS.warmup}  --connections ${DEFAULTS.connections}  --startups ${DEFAULTS.startups}
  --seed <n>      order of the measurements (random by default, written in the results)
  --no-raw        do not measure the raw Express / Koa / Fastify apps
  --out <dir>     where results.json and report.md are written (default: tools/benchmarks/results/<date>)`;

// Runs the runner itself on the cores the server does not use, so that autocannon and the server never share a core.
function pinRunner() {
  const pinning = detectPinning();

  if (!pinning || process.env.BENCH_PINNED) {
    return false;
  }

  const {status} = spawnSync("taskset", ["-c", pinning.runner, process.execPath, ...process.argv.slice(1)], {
    stdio: "inherit",
    env: {...process.env, BENCH_PINNED: "1"}
  });

  process.exit(status ?? 1);
}

function compileApp() {
  const tsc = createRequire(import.meta.url).resolve("typescript/bin/tsc");
  const {status} = spawnSync(process.execPath, [tsc, "-p", join(BENCH_DIR, "tsconfig.json")], {stdio: "inherit"});

  if (status !== 0) {
    throw new Error("The bench app does not compile");
  }
}

async function main() {
  const options = parseOptions(process.argv.slice(2));

  if (options.help || !options.targets.length) {
    console.log(HELP);
    process.exit(options.help ? 0 : 1);
  }

  pinRunner();

  if (!detectPinning()) {
    console.warn("⚠️  CPU pinning is not available (taskset on Linux only): gaps under ~3% are not reliable.");
  }

  compileApp();

  const results = await run(options, (message) => console.log(`[bench] ${message}`));
  const report = renderReport(results);

  mkdirSync(options.out, {recursive: true});
  writeFileSync(join(options.out, "results.json"), JSON.stringify(results, null, 2));
  writeFileSync(join(options.out, "report.md"), report);

  console.log(`\n${report}`);
  console.log(`[bench] results written to ${options.out}`);

  if (results.failures.length) {
    process.exitCode = 1;
  }
}

main().catch((er) => {
  console.error(er);
  process.exit(1);
});
