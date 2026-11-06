## 1. CMS history endpoint (tsed-api-directus, own worktree from `origin/main`)

- [x] 1.1 Create a worktree and branch `feat/benchmarks-history` from `origin/main`
- [x] 1.2 Add `toBenchmarkHistory(runs, rows)` to `BenchmarksService.ts`: newest run per version, semver order, reference at 0, geometric mean score, `null` when a route is missing
- [x] 1.3 Add `getHistory()`: successful runs with baseline `8.44.1` and trigger `release` or `workflow_dispatch`, read page by page, then their rows with `fields` limited to the gaps
- [x] 1.4 Add `GET /rest/benchmarks/history` in `extensions/tsed-rest/src/index.ts` (404 with a message, `Cache-Control: public, max-age=3600`)
- [x] 1.5 Unit tests: one per scenario of "Read-only benchmark history endpoint" (manual + release runs combined, newest run wins, geometric mean, missing route, ignored runs, no history), with fixtures built from the real runs
- [x] 1.6 `yarn test:lint`, `yarn typecheck`, `yarn test`

## 2. Page (Ts.ED repo)

- [x] 2.1 Version order: header card, per-route title and text reference first
- [x] 2.2 Fetch `${benchmarksUrl}/history` in parallel with the comparison, each with its own status
- [x] 2.3 `EvolutionChart.vue`: inline SVG, axes, 0% line, three lines with color, marker and a legend with the latest score, hover tooltip, point titles, `role="img"` and `aria-label`, thinned X labels below 640px
- [x] 2.4 Values table under the chart (Version, Express, Koa, Fastify, run date) and a caption on the metric and the mixed runs
- [x] 2.5 Fallback message when the history is unavailable
- [x] 2.6 Update the page description in `docs/benchmarks/index.md`

## 3. Verify

- [x] 3.1 Run the docs locally against the local CMS route (or a fixture served locally) and against production for the comparison: light, dark, 375px, history endpoint down, both endpoints down
- [x] 3.2 `yarn test:lint` and the docs build in the Ts.ED repo
- [x] 3.3 Screenshots in light and dark mode

## 4. Ship

- [x] 4.1 CMS PR (no Co-Authored-By trailer), pushed to an explicit remote and checked with `git ls-remote`
- [x] 4.2 Ts.ED PR (no scope in the commit, no Co-Authored-By trailer) with the screenshots, pushed and checked the same way
- [x] 4.3 After merge: sync the `benchmarks-page` spec and archive the change
