#!/usr/bin/env node
// Usage: yarn bench:publish <results.json> (the path is relative to the directory yarn was run from)
// Pushes a benchmark run to the Ts.ED CMS (Directus): one `benchmark_runs` item and its `benchmark_results` rows.
// Env: DIRECTUS_TOKEN (skipped when empty), DIRECTUS_URL (default https://api.tsed.dev), and the GitHub Actions variables.
import {randomUUID} from "node:crypto";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";

import {renderReport} from "./report.mjs";
import {median, medianOf} from "./stats.mjs";

export const DEFAULT_DIRECTUS_URL = "https://api.tsed.dev";

const finite = (value) => (Number.isFinite(value) ? Math.round(value * 100) / 100 : null);
const percent = (ratio) => (Number.isFinite(ratio) ? finite((ratio - 1) * 100) : null);

/**
 * Gap fields of one metric (`gap_rps`, `gap_rps_low`, ...) from a `{ratio, low, high, significant}` summary.
 * Gaps are in percent, positive means better. Empty when there is no comparison (baseline, raw).
 */
function gapFields(id, summary) {
  return {
    [`gap_${id}`]: summary ? percent(summary.ratio) : null,
    [`gap_${id}_low`]: summary ? percent(summary.low) : null,
    [`gap_${id}_high`]: summary ? percent(summary.high) : null,
    [`gap_${id}_significant`]: summary ? Boolean(summary.significant) : false
  };
}

function targetFields(results, name) {
  if (name === "raw") {
    return {target: name, target_kind: "raw", target_version: null, is_baseline: false};
  }

  const target = results.targets.find((item) => item.name === name);

  return {
    target: name,
    target_kind: target?.kind === "version" ? "version" : "local",
    target_version: target?.kind === "version" ? target.version : null,
    is_baseline: name === results.baseline
  };
}

/**
 * Flat rows of a run: one per target, platform and route, plus one `startup` row per Ts.ED target and platform.
 * Values are the medians over the rounds, the same as the report.
 */
export function toResultRows(results, {run, date = results.date} = {}) {
  const rows = [];
  const comparison = (target, platform, route) =>
    results.comparisons?.find((item) => item.target === target && item.platform === platform && item.route === route)?.metrics;
  const raw = (platform) => results.measurements.find((m) => m.target === "raw" && m.platform === platform);

  for (const measurement of results.measurements) {
    const {target, platform} = measurement;
    const base = {run, date, ...targetFields(results, target), platform};

    for (const [route, rounds] of Object.entries(measurement.routes)) {
      const metrics = comparison(target, platform, route);
      const rps = medianOf(rounds, "rps");
      const rawRps = target !== "raw" && route === "hello" && raw(platform) ? medianOf(raw(platform).routes.hello || [], "rps") : NaN;

      rows.push({
        ...base,
        route,
        rps: finite(rps),
        p50: finite(medianOf(rounds, "p50")),
        p99: finite(medianOf(rounds, "p99")),
        cpu_per_request: finite(medianOf(rounds, "cpuPerRequest")),
        errors: rounds.reduce((sum, round) => sum + (round?.errors || 0), 0),
        startup_ms: null,
        share_of_raw: finite((rps / rawRps) * 100),
        ...gapFields("rps", metrics?.rps),
        ...gapFields("p99", metrics?.p99),
        ...gapFields("cpu", metrics?.cpuPerRequest),
        ...gapFields("startup", null)
      });
    }

    if (target !== "raw" && measurement.startups?.length) {
      rows.push({
        ...base,
        route: "startup",
        rps: null,
        p50: null,
        p99: null,
        cpu_per_request: null,
        errors: 0,
        startup_ms: finite(median(measurement.startups.filter(Number.isFinite))),
        share_of_raw: null,
        ...gapFields("rps", null),
        ...gapFields("p99", null),
        ...gapFields("cpu", null),
        ...gapFields("startup", comparison(target, platform, "startup")?.startupMs)
      });
    }
  }

  return rows;
}

/**
 * `results.json` without the paths of the machine that ran it.
 */
function storedResults(results) {
  const {localDirs, out, ...config} = results.config;

  return {...results, config, targets: results.targets.map(({repoDir, ...target}) => target)};
}

/**
 * The `benchmark_runs` item of a run, without its rows.
 */
export function toRun(results, context = {}, id = randomUUID()) {
  const {config, environment} = results;
  const targets = results.targets.map((target) => target.name);

  return {
    id,
    date: results.date,
    title: context.title || targets.join(" vs "),
    status: results.failures?.length ? "failed" : "success",
    trigger: context.trigger || "local",
    git_ref: context.ref || null,
    git_sha: context.sha || null,
    pr_number: context.prNumber || null,
    run_url: context.runUrl || null,
    baseline: results.baseline,
    targets: targets.join(","),
    platforms: config.platforms.join(","),
    routes: config.routes.join(","),
    rounds: config.rounds,
    duration: config.duration,
    warmup: config.warmup,
    connections: config.connections,
    seed: config.seed,
    node: environment.node,
    os: environment.os,
    cpu: environment.cpu,
    cores: environment.cores,
    pinned: Boolean(environment.pinning),
    report: renderReport(results),
    raw_results: storedResults(results)
  };
}

/**
 * Context of the run from the GitHub Actions environment (`env`) and the event payload (`event`).
 * On a pull request, the measured commit is the head, not the merge commit of `GITHUB_SHA`.
 */
export function readGithubContext(env = process.env, event = {}) {
  if (!env.GITHUB_ACTIONS) {
    return {trigger: "local"};
  }

  const runUrl = env.GITHUB_RUN_ID ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` : null;
  const pullRequest = event.pull_request;

  if (pullRequest) {
    return {
      trigger: env.GITHUB_EVENT_NAME,
      ref: pullRequest.head.ref,
      sha: pullRequest.head.sha,
      prNumber: pullRequest.number,
      title: `#${pullRequest.number} ${pullRequest.title}`,
      runUrl
    };
  }

  return {trigger: env.GITHUB_EVENT_NAME, ref: env.GITHUB_REF_NAME, sha: env.GITHUB_SHA, runUrl};
}

async function request(fetchFn, url, token, path, body) {
  const response = await fetchFn(`${url.replace(/\/$/, "")}${path}`, {
    method: "POST",
    headers: {authorization: `Bearer ${token}`, "content-type": "application/json"},
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let message = text;

    try {
      message =
        JSON.parse(text)
          .errors?.map((error) => error.message)
          .join(", ") || text;
    } catch {}

    throw new Error(`Directus answered ${response.status} on POST ${path}: ${message}`);
  }
}

/**
 * Creates the run, then its rows. Two create requests, so that the token only needs the `create` permission
 * (a nested o2m create also reads and deletes the children).
 */
export async function publish(results, {url = DEFAULT_DIRECTUS_URL, token, context = {}, fetch: fetchFn = fetch, log = console.log} = {}) {
  if (!token) {
    log("[bench] DIRECTUS_TOKEN is not set: the results are not published.");
    return {skipped: true};
  }

  const run = toRun(results, context);
  const rows = toResultRows(results, {run: run.id});

  await request(fetchFn, url, token, "/items/benchmark_runs", run);
  await request(fetchFn, url, token, "/items/benchmark_results", rows);

  log(`[bench] run ${run.id} published to ${url} with ${rows.length} results (${run.title})`);

  return {skipped: false, id: run.id, rows: rows.length};
}

async function main() {
  const [file] = process.argv.slice(2);

  if (!file) {
    console.log("Usage: yarn bench:publish <results.json>");
    process.exit(1);
  }

  const results = JSON.parse(readFileSync(resolve(process.env.INIT_CWD || process.cwd(), file), "utf8"));
  const event = process.env.GITHUB_EVENT_PATH ? JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")) : {};

  await publish(results, {
    url: process.env.DIRECTUS_URL || DEFAULT_DIRECTUS_URL,
    token: process.env.DIRECTUS_TOKEN,
    context: readGithubContext(process.env, event)
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((er) => {
    console.error(`[bench] ${er.message}`);
    process.exit(1);
  });
}
