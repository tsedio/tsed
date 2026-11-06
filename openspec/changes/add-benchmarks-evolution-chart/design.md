## Context

- `GET https://api.tsed.dev/rest/benchmarks` answers the latest successful run comparing exactly `8.44.1,<release>` (release trigger first, then manual). `tsed.dev/benchmarks` renders it in `Benchmarks.vue`: header card, `GET /hello` bars, per-route gap table.
- Directus holds, with baseline `8.44.1`:
  - run `84555d65-…` (`workflow_dispatch`, November 3, 2026, 3 rounds, AMD EPYC 9V45): targets 8.44.1 → 8.44.13, all four HTTP routes and startup, on the three platforms;
  - one `release` run per stable release since 8.45.1 (5 rounds, AMD EPYC 7763), targets `8.44.1,<release>`. The 8.45.2 run is in progress.
- Each `benchmark_results` row of a target carries `gap_rps` (%, geometric mean of the per-round ratios against the baseline of the same job) with its 95% bounds and a `significant` flag.

Measured on these runs (req/s gap against 8.44.1):

| Version | Express `/hello` | Express geo. mean of 4 routes | Koa geo. mean | Fastify geo. mean |
| ------- | ---------------: | ----------------------------: | ------------: | ----------------: |
| 8.44.2  |            +3.7% |                        +20.6% |        +19.8% |            +17.5% |
| 8.44.9  |            +5.6% |                        +33.5% |        +34.2% |            +31.3% |
| 8.44.13 |            -6.7% |                        +24.2% |        +30.8% |            +32.9% |
| 8.45.1  |            +3.2% |                        +30.0% |        +27.4% |            +32.5% |

## Goals / Non-Goals

**Goals:**

- One reading order on the page: reference first, then the newer version.
- A per-version evolution chart, one line per platform, readable in light and dark mode, at phone width, and as text.
- Use the data already stored. No change to the benchmark runner, the workflow or the Directus schema.

**Non-Goals:**

- Re-measuring old versions, or a chart per route (the per-route table stays the detailed view).
- Explaining the Fastify `/hello` gap (separate investigation).
- Changing `GET /rest/benchmarks`.

## Decisions

### Global metric: geometric mean of the req/s gaps over the four HTTP routes, relative to 8.44.1

`score(version, platform) = (exp(mean(ln(1 + gap_rps / 100))) - 1) × 100` over `hello`, `users`, `orders-create`, `orders-list`. Startup is excluded (another unit, another kind of cost).

- **Relative, not absolute.** Absolute req/s come from different machines (EPYC 9V45 vs 7763) and round counts. A gap is measured against 8.44.1 in the same job, on the same machine, interleaved, so gaps from different runs can be put on one axis. 8.44.1 is the 0% point.
- **Geometric mean, not `/hello`.** With 3 to 5 rounds on a shared CI machine, `/hello` gaps sit within the noise (8.44.x Express: -6.7% to +7.5%, intervals around ±20 to ±50 points). A `/hello` line would be mostly noise. The geometric mean of the ratios is the standard way to aggregate benchmark ratios (it does not depend on which version is the reference, and a route at 1,200 req/s weighs as much as one at 30,000 req/s), and it reflects what users run: routes with validation and serialization, where the performance work landed.
- **Same route set for every point.** A version gets a score on a platform only when all four routes have a gap. Otherwise the point is left out (the line breaks) rather than averaged over a different set.
- **No interval on the aggregate.** The per-route intervals cannot be combined into an interval of the mean without the per-round data. The chart says that points are single measurements, and the per-route table still carries the intervals of the latest release.

Alternatives considered: `/hello` req/s (noise, see above); absolute req/s (not comparable across runs); arithmetic mean of the % gaps (dominated by `orders-list`'s +90%, and biased up compared with ratios).

### Data source: per version, the newest successful run that measured it

The history reads every successful run with `baseline = 8.44.1` and trigger `release` or `workflow_dispatch` (pull request runs never match). Each target that is a published version (`x.y.z`) other than the reference is a candidate point. When several runs measured the same version, the newest run wins. Points are sorted by semver and 8.44.1 is added as 0%.

So today: 8.44.2 → 8.44.13 come from the manual run, 8.45.1 and the next releases from their release runs. A later manual run that re-measures versions replaces those points.

Trade-off: two neighboring points may come from two runs on two machines. Both are relative to 8.44.1 in their own job, so the comparison holds, with more noise than within one run. The values table shows the run date of each version, and the chart's caption says so.

### Endpoint: sibling `GET /rest/benchmarks/history`

- A separate route keeps the `GET /rest/benchmarks` payload and contract unchanged, and lets the page fail one section without the other.
- Same rules as its sibling: no authentication, read-only, `Cache-Control: public, max-age=3600`, `404` with a message when no version was measured.
- Payload:

```ts
interface BenchmarkHistory {
  reference: string; // "8.44.1"
  routes: string[]; // routes of the score: ["hello", "users", "orders-create", "orders-list"]
  versions: {
    version: string; // "8.44.1" first (score 0), then semver order
    date: string | null; // date of the run the point comes from (null for the reference)
    trigger: string | null;
    runUrl: string | null;
    platforms: {
      platform: "express" | "koa" | "fastify";
      score: number | null; // geometric mean in %, null when a route is missing
      routes: {route: string; gap: Gap}[]; // the gaps the score is made of
    }[];
  }[];
}
```

- `BenchmarksService` gets a pure `toBenchmarkHistory(runs, rows)` (unit-tested with the real fixtures) and `getHistory()` that reads runs page by page (as `findLatestRun`) and the rows of the runs kept, with `fields` limited to `run, target, platform, route, gap_rps*`.

### Rendering: inline SVG in a small `EvolutionChart.vue`

- `viewBox`-based SVG scaled to the container width (`width: 100%`), so it fits any width without horizontal scroll. Y axis: % gap with a 0% line at 8.44.1 and 4 to 5 rounded ticks; X axis: versions, every label at desktop width, labels thinned (first, last and every n-th) below 640px.
- One line per platform with a fixed color (slots 1 to 3 of the validated categorical palette: blue, orange, aqua, with their own dark-mode steps; they pass the CVD and normal-vision checks on the VitePress surfaces in both modes), plus a distinct marker shape (circle, square, triangle) and a legend entry with a line key, the marker and the latest score as text ("Ts.ED Express +25.2%"), so the lines are told apart without color. End-of-line labels are not used: the lines end close together (e.g. Express +25.2% and Koa +26.6% at 8.45.2) and the labels would collide. A hover crosshair with a tooltip gives the three scores of a version.
- Each point has an SVG `<title>` ("Ts.ED Fastify 8.45.1: +32.5%") for hover and screen readers; the `<svg>` has `role="img"` and an `aria-label` summing up the last point per platform.
- Under the chart, a table with the same values as text: Version, Express, Koa, Fastify, run date. That is the accessible and exact view; the chart is the shape.
- The page fetches both endpoints in parallel. If the history fails or answers 404, the Evolution section shows a short message and the rest of the page still renders (and the other way around).
- The history URL is derived from `benchmarksUrl` (`${benchmarksUrl}/history`), so `BENCHMARKS_URL` keeps pointing a local docs build to a local CMS.

### Version order

Wherever two versions appear together, the reference comes first: header card "v8.44.1 vs v8.45.1" (reference in muted color, newer in brand color, as today), the per-route section "From v8.44.1 to v8.45.1" with "Gap per route from v8.44.1 to v8.45.1 …", the bars and legend (already Plain → reference → newer), and the evolution chart (X axis from 8.44.1).

## Risks / Trade-offs

- **Mixed runs and machines** → explained in the caption, run date per point in the table; a manual run measuring all versions again refreshes the whole line.
- **Noise of single points** (3 rounds for 8.44.x) → the geometric mean over four routes damps it; the chart does not claim significance per point.
- **Many versions at phone width** → thinned X labels; the table lists every version.
- **New routes added to the benchmark later** → the score keeps the fixed route set of the response (`routes`), so new routes do not shift the line. Changing that set is a deliberate change of this spec.

## Migration Plan

1. CMS PR: service, route, tests. Deploy the CMS (no migration).
2. Ts.ED PR: page changes. The Evolution section shows its fallback message until the CMS route is deployed, so the merge order does not break the page.

## Open Questions

- None blocking. If the user prefers the CPU per request gap as the metric, the same aggregation applies to `gap_cpu`.
