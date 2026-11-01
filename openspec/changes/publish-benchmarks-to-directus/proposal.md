## Why

The HTTP benchmark (`tools/benchmarks`, **Benchmark** workflow) writes its results to a job summary and a 90-day artifact. Nothing keeps them: there is no history of the gaps measured on pull requests and releases, and no way to see a regression trend. The Ts.ED CMS (Directus, `tsedio/tsed-cms`, served at `https://api.tsed.dev`) already stores project telemetry (`cli_install_stats`) with Insights dashboards, so it is the natural place to keep the benchmark history.

## What Changes

- **Ts.ED repo** (`tools/benchmarks`):
  - a `publish` command (`yarn bench:publish <results.json>`) that turns `results.json` into one run and its flat result rows, and creates them in Directus with create-only requests;
  - a `publish` job in the **Benchmark** workflow, after the measuring job, that downloads the `benchmark-results` artifact and pushes it with the `DIRECTUS_TOKEN` organization secret (already used to publish the API docs). It runs trusted code only (no code of the pull request) and is skipped when the token is not available (fork pull requests).
- **CMS repo** (`tsed-api-directus`):
  - two collections: `benchmark_runs` (one per run: trigger, commit, pull request, config, machine, report, raw results) and `benchmark_results` (one row per run, target, platform and route: medians, gaps against the baseline with their 95% interval, share of the raw framework ceiling);
  - a `Benchmark publisher` access policy that may only create items in these two collections, attached to the user of the `DIRECTUS_TOKEN` secret;
  - a **Benchmarks** Insights dashboard: latest runs, a run selector with that run's results and gaps, trends of the gap and of the share of the raw ceiling per platform, and the latest significant regressions.

## Capabilities

### New Capabilities

- `benchmark-tracking`: publication of the HTTP benchmark results to the Ts.ED CMS, their data model, and the tracking dashboard.

### Modified Capabilities

<!-- none: the runner and its report do not change. `http-benchmarks` is still an open change (add-http-benchmarks). -->

## Impact

- `tools/benchmarks/src/publish.mjs` (new), `tools/benchmarks/package.json` (script), tests, `tools/benchmarks/readme.md`, `.github/workflows/benchmark.yml`.
- Repository settings: the existing `DIRECTUS_TOKEN` organization secret; optional variable `DIRECTUS_URL` (default `https://api.tsed.dev`).
- CMS: schema snapshot, `migrations/data` (policy and permissions), a migration, a dashboard export under `imports/data/directus-dashboards/`, generated `DirectusSchema.d.ts`.
- Manual step on the production CMS: attach the `Benchmark publisher` policy to the user of the `DIRECTUS_TOKEN` token.
- No dependency added: the publish command uses Node's `fetch`.
