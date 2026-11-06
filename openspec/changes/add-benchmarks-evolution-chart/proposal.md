## Why

The tsed.dev `/benchmarks` page shows one comparison: the latest release against 8.44.1. Two problems after the 8.45.1 release:

- The header reads "v8.45.1 vs v8.44.1" (newest first) while the bars and the methodology read reference first. The page should read in one direction, from the reference to the newer version.
- It shows no trend. The CMS already holds 8.44.1 → 8.44.13 (one manual run measuring all 13 versions in the same job) and one release run per release since 8.45.1, but the page cannot show how each version moved compared with 8.44.1.

## What Changes

- **Ts.ED repo** (`docs/`):
  - The page reads reference → newer everywhere: header card "v8.44.1 vs v8.45.1", the per-route section titled "From v8.44.1 to v8.45.1", and its text.
  - New **Evolution** section: an inline SVG line chart, one line per platform (Ts.ED Express, Koa, Fastify), X = the measured versions from 8.44.1 to the latest release, Y = the overall req/s gap against 8.44.1 (geometric mean over the HTTP routes, in %). A table under the chart gives the same values as text, with the date of the run each version comes from.
  - No chart library: plain Vue, SVG and CSS, theme colors, distinct markers and a text legend with the latest score so the lines do not rely on color alone.
- **CMS repo** (`tsed-api-directus`):
  - `BenchmarksService.getHistory()`: per published version, the req/s gaps against 8.44.1 from the newest successful run (release or manual) that measured it, and the per-platform geometric mean.
  - New read-only route `GET /rest/benchmarks/history`, cached like `GET /rest/benchmarks`.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `benchmarks-page`: version order on the page, new history endpoint, new evolution chart.

## Impact

- Ts.ED: `docs/.vitepress/theme/benchmarks/Benchmarks.vue` (and a small `EvolutionChart.vue` next to it), `docs/benchmarks/index.md` (description), `openspec/specs/benchmarks-page`.
- CMS: `packages/usecases/benchmarks/BenchmarksService.ts` and its spec, `extensions/tsed-rest/src/index.ts`. No schema change, no migration: the history only reads `benchmark_runs` and `benchmark_results`.
- No new dependency in either repo. `GET /rest/benchmarks` keeps its payload.
