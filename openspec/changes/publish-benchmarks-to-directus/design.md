## Context

- `results.json` (≈ 46 KB for 2 targets × 3 platforms) holds `config`, `environment`, `targets`, `measurements` (per target and platform: rounds per route, cold starts) and `comparisons` (per target, platform and route: `{n, ratio, low, high, significant}` for `rps`, `p50`, `p99`, `cpuPerRequest`, or `startupMs`).
- Absolute numbers depend on the machine; two CI runs use two machines. Only the gap against the baseline of the same run and the share of the raw ceiling of the same run are comparable across runs.
- The CMS (`tsed-api-directus`, Directus 12.6) already ingests `cli_install_stats` through a public endpoint of the `tsed-rest` extension, and versions its schema in `snapshots/snapshot-latest.yaml`, its policies and permissions in `migrations/data`, and its dashboards in `imports/data/directus-dashboards/` (installed by `16-import-dashboards.ts`).
- Insights panels available: `metric`, `metric-list`, `list`, `bar-chart`, `pie-chart`, `line-chart` (with a series `grouping` field), `time-series` (one series), `variable` and `relational-variable` (dashboard variables usable as `{{name}}` in panel filters).
- The measuring job builds and runs the code of the pull request.

## Goals / Non-Goals

**Goals:**

- Keep every CI benchmark run with enough context to find it (PR, sha, workflow URL) and its report.
- Rows flat enough for Insights panels without custom extensions.
- A token never exposed to pull request code, and a policy that grants it nothing beyond adding benchmark runs.

**Non-Goals:**

- Changing what the runner measures or its report.
- Scheduling benchmark runs (for instance on every release): a follow-up, the dashboard works with any run.
- A public read API or a page on tsed.dev.

## Decisions

### Two collections, denormalized result rows

`benchmark_runs` (uuid) + `benchmark_results` (integer id, m2o `run` with `ON DELETE CASCADE`, o2m alias `results` on the run). The run date, target kind and baseline flag are copied on each result row: Insights panels filter and plot one collection and cannot follow a relation in `xAxis` or `dateField`. Medians are computed by the publish command (same `medianOf` as the report), so the CMS has no business logic. Gaps are stored in percent, the unit of the report.

Alternative: one JSON column on the run. Rejected: no Insights panel can aggregate inside JSON.

### Push with the Directus items API and a static token, not a custom endpoint

The command generates the run uuid, then sends `POST /items/benchmark_runs` and `POST /items/benchmark_results` (all rows). A nested create (`results: [...]` on the run) would be one transaction, but Directus processes an o2m payload by also reading and deleting the deselected children, which needs `read` and `delete` on `benchmark_results`. Two create-only requests keep the policy minimal; if the second one fails, the command exits non-zero and the run is left without rows (visible as such, and deletable). A `Benchmark publisher` policy (no app access) allows `create` on both collections only. It is attached to the user of the `DIRECTUS_TOKEN` organization secret, which already triggers the API docs flow from `website.yml`: Directus 11+ adds up the policies of a user, so the token gains this right without a new secret.

Alternative: a `POST /rest/benchmarks` endpoint in `tsed-rest` with a shared secret, like `/cli/stats`. Rejected: it duplicates auth and validation that Directus already gives through permissions and field types, and `/cli/stats` is public by design (anonymous CLI telemetry), which benchmark data is not.

The policy and permissions are versioned in `migrations/data` and `imports/data` and installed by the `*-update-all.ts` migration, renamed so it runs again (the repository convention after each export); `PROJECT_POLICIES` keeps the policy in future exports. Attaching it to the token's user is a manual step on each environment: users and tokens are not in the repository.

### A separate publish job running trusted code

The measuring job runs the code of the pull request, so it never gets the token. The `publish` job `needs: benchmark`, runs `if: always() && needs.benchmark.result != 'cancelled'`, downloads the artifact, sparse-checks out `tools/benchmarks` at the base sha (pull request) or `github.sha` (dispatch, which needs write access), and runs `node tools/benchmarks/src/publish.mjs` with Node built-ins only (no `yarn install`). The data itself comes from the pull request run and could be forged; a forged run can be deleted by a maintainer.

### Publish command split into a pure mapper and a thin CLI

`toDirectusRun(results, context)` maps `results.json` and a context (`trigger`, `ref`, `sha`, `prNumber`, `runUrl`, `title`) to the payload; it is unit tested on a fixture trimmed from a real CI run. `readGithubContext(env, event)` reads `GITHUB_EVENT_NAME`, `GITHUB_SHA`, `GITHUB_REF_NAME`, `GITHUB_SERVER_URL`, `GITHUB_REPOSITORY`, `GITHUB_RUN_ID` and the event payload (`GITHUB_EVENT_PATH`) for the PR number, head sha, head ref and title. `NaN` and `Infinity` become `null`. `config.localDirs` and `config.out` (runner paths) are removed from the stored raw results.

### Dashboard

- Key figures (`metric`): runs, pull request runs, significant regressions and improvements (rows with `gap_rps_significant = true` and a negative / positive `gap_rps`).
- History (`list`): latest runs; latest significant regressions.
- Selected run: `relational-variable` `selected_run` on `benchmark_runs` and `variable` `selected_route` (the routes and `startup`, default `hello`); `bar-chart` by platform of `gap_rps` and `gap_cpu` for the route and of `share_of_raw`; `list` of every row of the run.
- Trends (`line-chart`, `xAxis = date`, grouping `platform`, rows with `is_baseline = false` and `target_kind != raw`): `gap_rps` and `gap_cpu` for the selected route, `share_of_raw` on `hello`, `gap_startup`.

## Risks / Trade-offs

- [A run with several candidate targets mixes them in the trend lines] → trends average the non-baseline rows of a run; PR runs, the main use, have one candidate. The run selector shows each target.
- [Runs with different configs (rounds, routes) are plotted together] → gaps are relative to the same run, so still comparable; the config is on the run for filtering.
- [Unpinned local runs pollute trends] → `pinned` is on the run; local publishing is possible but documented as for testing.
- [The panel variable syntax and `line-chart` grouping are undocumented app internals] → the dashboard is checked in a local Directus. Two traps found there: panels query through GraphQL, so a relation is filtered as `run: {id: {_eq}}`; and a variable replaces every `{{name}}` in the panel options, display templates included, so the variables are named `selected_run` and `selected_route`.

## Migration Plan

1. CMS: merge the schema, policy, migration and dashboard; deploy (Render runs the migrations), run the dashboards import.
2. Production CMS: attach the `Benchmark publisher` policy to the user of the `DIRECTUS_TOKEN` token.
3. Ts.ED repo: merge the workflow change (optionally set the `DIRECTUS_URL` variable).
4. Rollback: remove the publish job; the collections can stay or be dropped.

## Open Questions

- Should a benchmark run on every release (previous release vs new one), so that the trend has a regular source? Proposed as a follow-up.
