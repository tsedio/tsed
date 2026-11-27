import {readFileSync} from "node:fs";

import {describe, expect, it, vi} from "vitest";

import {publish, readGithubContext, toResultRows, toRun} from "../src/publish.mjs";

// Trimmed from a CI run: 8.44.1 (baseline) vs 8.44.12, express and fastify, 5 rounds, raw apps
const fixture = () => JSON.parse(readFileSync(new URL("./fixtures/results.json", import.meta.url), "utf8"));

const okResponse = () => ({ok: true, status: 204, text: async () => ""});

describe("publish", () => {
  describe("toResultRows()", () => {
    it("should create one row per target, platform and route, one startup row per Ts.ED target, and the raw hello rows", () => {
      const rows = toResultRows(fixture(), {run: "run-id"});

      // per platform: 2 targets × (4 routes + startup) + raw hello
      expect(rows).toHaveLength(22);
      expect(rows.filter((row) => row.route === "startup")).toHaveLength(4);
      expect(rows.filter((row) => row.target === "raw").map((row) => `${row.platform}/${row.route}`)).toEqual([
        "express/hello",
        "fastify/hello"
      ]);
      expect(rows.every((row) => row.run === "run-id" && row.date === fixture().date)).toBe(true);
    });

    it("should store the medians of the rounds and the target fields", () => {
      const results = fixture();
      const rows = toResultRows(results, {run: "run-id"});
      const row = rows.find((item) => item.target === "8.44.1" && item.platform === "express" && item.route === "hello");
      const rounds = results.measurements.find((m) => m.target === "8.44.1" && m.platform === "express").routes.hello;
      const rps = rounds.map((round) => round.rps).sort((a, b) => a - b);

      expect(row).toMatchObject({target_kind: "version", target_version: "8.44.1", is_baseline: true, rps: rps[2], errors: 0});
      expect(row.gap_rps).toBeNull();
      expect(row.gap_rps_significant).toBe(false);
    });

    it("should store the gaps of a compared target in percent", () => {
      const results = fixture();
      const rows = toResultRows(results, {run: "run-id"});
      const row = rows.find((item) => item.target === "8.44.12" && item.platform === "express" && item.route === "hello");
      const {rps} = results.comparisons.find((c) => c.target === "8.44.12" && c.platform === "express" && c.route === "hello").metrics;

      expect(row.is_baseline).toBe(false);
      expect(row.gap_rps).toBeCloseTo((rps.ratio - 1) * 100, 1);
      expect(row.gap_rps_low).toBeCloseTo((rps.low - 1) * 100, 1);
      expect(row.gap_rps_high).toBeCloseTo((rps.high - 1) * 100, 1);
      expect(row.gap_rps_significant).toBe(rps.significant);
      expect(row.gap_cpu).not.toBeNull();
      expect(row.gap_startup).toBeNull();
    });

    it("should convert a significant regression", () => {
      const results = fixture();
      const comparison = results.comparisons.find((c) => c.target === "8.44.12" && c.platform === "express" && c.route === "orders-list");
      comparison.metrics.rps = {n: 5, ratio: 0.9, low: 0.88, high: 0.92, significant: true};

      const row = toResultRows(results).find(
        (item) => item.target === "8.44.12" && item.platform === "express" && item.route === "orders-list"
      );

      expect(row).toMatchObject({gap_rps: -10, gap_rps_low: -12, gap_rps_high: -8, gap_rps_significant: true});
    });

    it("should leave the bounds empty for a single round", () => {
      const results = fixture();
      const comparison = results.comparisons.find((c) => c.target === "8.44.12" && c.platform === "fastify" && c.route === "users");
      comparison.metrics.rps = {n: 1, ratio: 1.1, low: NaN, high: NaN, significant: false};

      const row = toResultRows(results).find((item) => item.target === "8.44.12" && item.platform === "fastify" && item.route === "users");

      expect(row).toMatchObject({gap_rps: 10, gap_rps_low: null, gap_rps_high: null, gap_rps_significant: false});
    });

    it("should give the share of the raw ceiling on hello only", () => {
      const rows = toResultRows(fixture());
      const hello = rows.find((item) => item.target === "8.44.12" && item.platform === "fastify" && item.route === "hello");
      const raw = rows.find((item) => item.target === "raw" && item.platform === "fastify");

      expect(hello.share_of_raw).toBeCloseTo((hello.rps / raw.rps) * 100, 0);
      expect(raw.share_of_raw).toBeNull();
      expect(rows.filter((row) => row.route !== "hello").every((row) => row.share_of_raw === null)).toBe(true);
    });

    it("should store the cold start and its gap on the startup rows", () => {
      const results = fixture();
      const row = toResultRows(results).find(
        (item) => item.target === "8.44.12" && item.platform === "express" && item.route === "startup"
      );
      const {startupMs} = results.comparisons.find(
        (c) => c.target === "8.44.12" && c.platform === "express" && c.route === "startup"
      ).metrics;

      expect(row.startup_ms).toBeGreaterThan(0);
      expect(row.rps).toBeNull();
      expect(row.gap_startup).toBeCloseTo((startupMs.ratio - 1) * 100, 1);
    });
  });

  describe("toRun()", () => {
    it("should describe the run without the paths of the machine", () => {
      const run = toRun(fixture(), {trigger: "workflow_dispatch", sha: "abc", ref: "production"}, "run-id");

      expect(run).toMatchObject({
        id: "run-id",
        title: "8.44.1 vs 8.44.12",
        status: "success",
        trigger: "workflow_dispatch",
        git_sha: "abc",
        git_ref: "production",
        pr_number: null,
        baseline: "8.44.1",
        targets: "8.44.1,8.44.12",
        platforms: "express,fastify",
        rounds: 5,
        pinned: true,
        cores: 4
      });
      expect(run.report).toMatch(/^## Ts.ED HTTP benchmark/);
      expect(run.raw_results.config.localDirs).toBeUndefined();
      expect(run.raw_results.config.out).toBeUndefined();
      expect(run.raw_results.measurements).toHaveLength(6);
    });

    it("should keep the missing intervals of a one-round run read from results.json", () => {
      const results = fixture();
      // a single round has no interval: NaN in memory, null once written to results.json
      for (const comparison of results.comparisons) {
        for (const summary of Object.values(comparison.metrics)) {
          Object.assign(summary, {n: 1, low: NaN, high: NaN, significant: false});
        }
      }

      const {report} = toRun(JSON.parse(JSON.stringify(results)));

      expect(report).toContain("(1 round)");
      expect(report).not.toContain("-100.0");
    });

    it("should mark a run with a failed response check as failed", () => {
      const results = fixture();
      results.failures = [{target: "8.44.12", platform: "koa", errors: ["GET /hello: 500"]}];

      expect(toRun(results).status).toBe("failed");
      expect(toRun(results).trigger).toBe("local");
    });
  });

  describe("readGithubContext()", () => {
    const env = {
      GITHUB_ACTIONS: "true",
      GITHUB_SERVER_URL: "https://github.com",
      GITHUB_REPOSITORY: "tsedio/tsed",
      GITHUB_RUN_ID: "42",
      GITHUB_SHA: "merge-sha",
      GITHUB_REF_NAME: "1234/merge"
    };

    it("should take the head of a pull request, not the merge commit", () => {
      const event = {pull_request: {number: 1234, title: "perf: faster", head: {sha: "head-sha", ref: "perf/faster"}}};

      expect(readGithubContext({...env, GITHUB_EVENT_NAME: "pull_request"}, event)).toEqual({
        trigger: "pull_request",
        ref: "perf/faster",
        sha: "head-sha",
        prNumber: 1234,
        title: "#1234 perf: faster",
        runUrl: "https://github.com/tsedio/tsed/actions/runs/42"
      });
    });

    it("should take the dispatched commit of a manual run", () => {
      expect(readGithubContext({...env, GITHUB_EVENT_NAME: "workflow_dispatch", GITHUB_SHA: "sha", GITHUB_REF_NAME: "production"})).toEqual(
        {
          trigger: "workflow_dispatch",
          ref: "production",
          sha: "sha",
          runUrl: "https://github.com/tsedio/tsed/actions/runs/42"
        }
      );
    });

    it("should describe a release run with its tag", () => {
      const event = {release: {tag_name: "v8.45.0", prerelease: false}};

      expect(readGithubContext({...env, GITHUB_EVENT_NAME: "release", GITHUB_SHA: "tag-sha", GITHUB_REF_NAME: "v8.45.0"}, event)).toEqual({
        trigger: "release",
        ref: "v8.45.0",
        sha: "tag-sha",
        title: "Release v8.45.0",
        runUrl: "https://github.com/tsedio/tsed/actions/runs/42"
      });
    });

    it("should be a local run outside GitHub Actions", () => {
      expect(readGithubContext({}, {})).toEqual({trigger: "local"});
    });
  });

  describe("publish()", () => {
    it("should skip without a token and send no request", async () => {
      const fetch = vi.fn();
      const log = vi.fn();

      expect(await publish(fixture(), {token: "", fetch, log})).toEqual({skipped: true});
      expect(fetch).not.toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith(expect.stringContaining("not published"));
    });

    it("should create the run, then its rows linked to the run", async () => {
      const fetch = vi.fn(async () => okResponse());

      const result = await publish(fixture(), {url: "https://cms.test/", token: "token", fetch, log: vi.fn()});

      expect(fetch).toHaveBeenCalledTimes(2);

      const [[runUrl, runInit], [rowsUrl, rowsInit]] = fetch.mock.calls;
      const run = JSON.parse(runInit.body);
      const rows = JSON.parse(rowsInit.body);

      expect(runUrl).toBe("https://cms.test/items/benchmark_runs");
      expect(rowsUrl).toBe("https://cms.test/items/benchmark_results");
      expect(runInit.headers.authorization).toBe("Bearer token");
      expect(run.id).toBe(result.id);
      expect(rows).toHaveLength(22);
      expect(rows.every((row) => row.run === run.id)).toBe(true);
    });

    it("should fail with the status and the message of Directus", async () => {
      const fetch = vi.fn(async () => ({
        ok: false,
        status: 403,
        text: async () => JSON.stringify({errors: [{message: "You don't have permission to access this."}]})
      }));

      await expect(publish(fixture(), {token: "token", fetch, log: vi.fn()})).rejects.toThrow(
        "Directus answered 403 on POST /items/benchmark_runs: You don't have permission to access this."
      );
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});
