import {execFileSync} from "node:child_process";
import {cpus, platform as osPlatform, release} from "node:os";

import {THIRD_PARTY} from "./deps.mjs";
import {measureRoute} from "./measure.mjs";
import {selectRoutes, verifyRoutes} from "./routes.mjs";
import {buildSchedule} from "./schedule.mjs";
import {startServer} from "./server.mjs";
import {compare} from "./stats.mjs";
import {installTarget, parseTarget} from "./targets.mjs";

export const DEFAULTS = {
  platforms: ["express", "koa", "fastify"],
  routes: [],
  rounds: 5,
  duration: 5,
  warmup: 2,
  connections: 50,
  startups: 10,
  raw: true
};

/**
 * Cores of the server and of the runner (autocannon) on Linux, when `taskset` is available.
 */
export function detectPinning() {
  const cores = cpus().length;

  if (osPlatform() !== "linux" || cores < 2) {
    return null;
  }

  try {
    execFileSync("taskset", ["-V"], {stdio: "ignore"});
  } catch {
    return null;
  }

  return {server: "0", runner: cores > 2 ? `1-${cores - 1}` : "1"};
}

const unitKey = ({target, platform}) => `${target.name}/${platform}`;

function environment(pinning) {
  return {
    node: process.version,
    os: `${osPlatform()} ${release()}`,
    cpu: cpus()[0]?.model,
    cores: cpus().length,
    pinning,
    thirdParty: THIRD_PARTY
  };
}

export async function run(options, log = console.log) {
  const config = {...DEFAULTS, ...options};
  const seed = config.seed ?? Math.floor(Math.random() * 2 ** 31);
  const pinning = detectPinning();
  const routes = selectRoutes(config.routes);
  const rawRoutes = routes.filter((route) => route.raw);

  if (config.targets.length < 1) {
    throw new Error("At least one target is required");
  }

  // 1. install the targets, one directory per target
  const targets = [];

  for (const spec of config.targets) {
    targets.push(await installTarget(parseTarget(spec, config.localDirs), log));
  }

  const raw = config.raw && rawRoutes.length ? await installTarget({name: "raw", kind: "raw"}, log) : null;

  // 2. list the (target, platform) units, and the platforms a target does not publish
  const unavailable = [];
  let units = [];

  for (const platform of config.platforms) {
    for (const target of targets) {
      if (target.platforms.includes(platform)) {
        units.push({target, platform, routes});
      } else {
        unavailable.push({target: target.name, platform});
      }
    }

    if (raw) {
      units.push({target: raw, platform, routes: rawRoutes});
    }
  }

  // 3. check the responses of every unit before measuring anything
  const failures = [];

  for (const unit of units) {
    try {
      const server = await startServer(unit.target, unit.platform, {pinning});
      const errors = await verifyRoutes(server.baseUrl, unit.routes).finally(() => server.stop());

      if (errors.length) {
        failures.push({target: unit.target.name, platform: unit.platform, errors});
      }
    } catch (er) {
      failures.push({target: unit.target.name, platform: unit.platform, errors: [er.message]});
    }
  }

  for (const failure of failures) {
    log(`✖ ${failure.target}/${failure.platform} fails the response check, it is not measured:\n  ${failure.errors.join("\n  ")}`);
  }

  units = units.filter((unit) => !failures.some((f) => f.target === unit.target.name && f.platform === unit.platform));

  // 4. interleaved rounds
  const measurements = {};

  for (const unit of units) {
    measurements[unitKey(unit)] = {
      target: unit.target.name,
      platform: unit.platform,
      routes: Object.fromEntries(unit.routes.map((route) => [route.id, []])),
      startups: []
    };
  }

  const schedule = buildSchedule(units, config.rounds, seed);

  for (const [round, order] of schedule.entries()) {
    log(`round ${round + 1}/${config.rounds}: ${order.map(unitKey).join(", ")}`);

    for (const unit of order) {
      const server = await startServer(unit.target, unit.platform, {pinning});

      try {
        for (const route of unit.routes) {
          measurements[unitKey(unit)].routes[route.id][round] = await measureRoute(server, route, config);
        }
      } finally {
        await server.stop();
      }
    }
  }

  // 5. cold starts, interleaved too
  if (config.startups > 0) {
    log(`${config.startups} cold starts per target and platform`);

    for (const [index, order] of buildSchedule(units, config.startups, seed + 1).entries()) {
      for (const unit of order) {
        const server = await startServer(unit.target, unit.platform, {pinning});
        measurements[unitKey(unit)].startups[index] = server.startupMs;
        await server.stop();
      }
    }
  }

  const results = {
    date: new Date().toISOString(),
    config: {...config, routes: routes.map((route) => route.id), seed},
    environment: environment(pinning),
    baseline: targets[0].name,
    targets: targets.map(({name, kind, version, repoDir, platforms, packages}) => ({name, kind, version, repoDir, platforms, packages})),
    unavailable,
    failures,
    measurements: Object.values(measurements)
  };

  results.comparisons = compareResults(results);

  return results;
}

const METRICS = [
  {id: "rps", higherIsBetter: true},
  {id: "p50", higherIsBetter: false},
  {id: "p99", higherIsBetter: false},
  {id: "cpuPerRequest", higherIsBetter: false}
];

/**
 * Compares every target with the baseline, per platform and route, through the per-round ratios.
 */
export function compareResults({baseline, measurements}) {
  const comparisons = [];
  const find = (target, platform) => measurements.find((m) => m.target === target && m.platform === platform);

  for (const measurement of measurements) {
    const base = find(baseline, measurement.platform);

    if (!base || measurement.target === baseline || measurement.target === "raw") {
      continue;
    }

    for (const [route, rounds] of Object.entries(measurement.routes)) {
      const baseRounds = base.routes[route];

      if (!baseRounds) {
        continue;
      }

      const metrics = Object.fromEntries(
        METRICS.map(({id, higherIsBetter}) => [
          id,
          compare(
            rounds.map((r) => r?.[id]),
            baseRounds.map((r) => r?.[id]),
            {higherIsBetter}
          )
        ])
      );

      comparisons.push({target: measurement.target, platform: measurement.platform, route, metrics});
    }

    comparisons.push({
      target: measurement.target,
      platform: measurement.platform,
      route: "startup",
      metrics: {startupMs: compare(measurement.startups, base.startups, {higherIsBetter: false})}
    });
  }

  return comparisons;
}
