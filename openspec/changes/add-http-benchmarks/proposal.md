## Why

The recent performance work (v8.44.2 → v8.44.11) is only measured with micro-benchmarks of single functions. Nobody can say how much faster a Ts.ED server answers HTTP requests between two releases, and a micro-benchmark can be misleading (a `getValue` benchmark with a literal expression showed a regression that did not exist on the real request path). We need a repeatable HTTP benchmark that gives a stable before/after gap, per published version, for Express, Koa and Fastify.

## What Changes

- Add a private workspace `tools/benchmarks` with:
  - one Ts.ED bench application (a few representative routes) that boots on `@tsed/platform-express`, `@tsed/platform-koa` and `@tsed/platform-fastify`;
  - a raw Express / Koa / Fastify application per platform, used as the framework ceiling;
  - a runner that installs each **target** in its own isolated directory (a published npm version such as `8.44.1`, or `local` for the packages built from the current checkout), then load-tests every target with **autocannon** in interleaved rounds;
  - a report: requests/s, latency p50/p99, server CPU time per request and startup time, each target compared with a baseline target through paired per-round ratios with a confidence interval.
- Add a GitHub Actions workflow `benchmark.yml`:
  - `workflow_dispatch` with the list of targets (default: previous release vs `local`);
  - on a pull request labelled `benchmark`: base branch vs PR head;
  - writes the report to the job summary and uploads the raw JSON as an artifact.
- Add root scripts (`yarn bench`, `yarn bench:compare`) to run the same benchmark locally.

No change to any published package.

## Capabilities

### New Capabilities

- `http-benchmarks`: how the HTTP benchmark of a Ts.ED server is defined, run and compared across versions (targets, scenarios, measurement protocol, statistics, report, CI triggers).

### Modified Capabilities

<!-- none -->

## Impact

- New private workspace `tools/benchmarks` (not published), new devDependency `autocannon` in it, plus raw `express`, `koa` and `fastify` versions pinned for the baselines.
- New workflow `.github/workflows/benchmark.yml`. It does not run on every push, only on dispatch or on the `benchmark` label, so the existing `build.yml` jobs and their duration are unchanged.
- The unused `.github/workflows/install-wrk.sh` is removed (autocannon replaces wrk).
- Docs: a contributor section explaining how to run and read a benchmark.
