## Why

The benchmark history now lives in the Ts.ED CMS (`publish-benchmarks-to-directus`), but only maintainers see it. The perf work since 8.44.1 deserves a public page on tsed.dev: how the latest release compares with 8.44.1 (before the optimisations), and how close Ts.ED gets to plain Express, Koa and Fastify.

## What Changes

- **Benchmark workflow** (Ts.ED repo): a run after each stable release (`release: published`, prereleases excluded) comparing the reference `8.44.1` with the released version, published to the CMS with the trigger `release`. The reference is a workflow constant.
- **Publish command**: reads the `release` event (tag, release URL) into the run context.
- **CMS** (`tsed-api-directus`): `release` added to the `benchmark_runs.trigger` choices, and a read-only `GET /rest/benchmarks` endpoint in the `tsed-rest` extension, like `/rest/warehouse`. It answers the latest successful `release` run, reduced to what the page shows, with a cache header.
- **Website** (`docs/`): a dedicated `/benchmarks` page with a `Benchmarks` Vue component that fetches the endpoint and draws, per platform, req/s of the raw framework, of 8.44.1 and of the latest release on `GET /hello`, the gap of the latest release against 8.44.1 per route with its 95% interval, and the run context (date, machine, rounds). Linked from the "Getting started" menu, after "Capabilities".

## Capabilities

### New Capabilities

- `benchmarks-page`: the public benchmark data (release runs, read-only endpoint) and the tsed.dev page that shows it.

### Modified Capabilities

<!-- none: `benchmark-tracking` is still an open change (publish-benchmarks-to-directus); its trigger list gains `release` here. -->

## Impact

- `.github/workflows/benchmark.yml`, `tools/benchmarks/src/publish.mjs` and its tests.
- `docs/benchmarks/index.md`, `docs/.vitepress/theme` (component, registration), `docs/.vitepress/config.mts` (endpoint URL).
- CMS: `extensions/tsed-rest` (route, response schema, spec), a use case service, the snapshot (`trigger` choices).
- The page shows nothing useful until the first release run is published; the first one can be started by hand (`workflow_dispatch` with `8.44.1,<latest>`, trigger `workflow_dispatch`), so the endpoint also accepts a manual run of the reference against the latest release.
- No new dependency: the bars are plain HTML/CSS in Vue.
