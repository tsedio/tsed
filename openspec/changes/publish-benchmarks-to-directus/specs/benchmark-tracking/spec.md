## ADDED Requirements

### Requirement: A benchmark run is stored as one run and flat result rows

The CMS SHALL store a benchmark run in `benchmark_runs` and its measurements in `benchmark_results`, one row per target, platform and route (`hello`, `users`, `orders-create`, `orders-list`, plus `startup`). A run row MUST hold its date, trigger (`pull_request`, `workflow_dispatch` or `local`), title, git ref and sha, pull request number, workflow run URL, baseline, targets, platforms, rounds, duration, warmup, connections, seed, Node version, OS, CPU, cores, whether CPU pinning was active, a status (`success` or `failed`), the Markdown report and the raw `results.json`. A result row MUST hold the run, the run date, the target with its kind and version, whether it is the baseline, the platform, the route and the medians over the rounds of req/s, p50, p99 and CPU µs per request, the total of failed requests over the rounds and, for `startup`, the cold start in ms.

#### Scenario: Run of three targets on three platforms

- **WHEN** a `results.json` with 2 targets, 3 platforms, 4 routes and the raw apps is published
- **THEN** one `benchmark_runs` item MUST be created
- **AND** `benchmark_results` MUST get one row per (target, platform, route) of Ts.ED, one `startup` row per (target, platform), and one `hello` row per raw platform

#### Scenario: Deleting a run

- **WHEN** a `benchmark_runs` item is deleted
- **THEN** its `benchmark_results` rows MUST be deleted too

### Requirement: Result rows carry the gap against the baseline

A result row of a non-baseline target SHALL hold, from the `comparisons` of `results.json`, the gap in percent (`(ratio - 1) × 100`, positive means better) of req/s, p99, CPU per request and startup, with the low and high bounds of the 95% interval and whether it is significant. Baseline and raw rows MUST leave the gaps empty. A Ts.ED `hello` row MUST hold its share of the raw ceiling of the same platform in percent when the raw app was measured.

#### Scenario: Significant regression

- **WHEN** the comparison of `local-head/express/orders-list` has `rps.ratio = 0.9`, `low = 0.88`, `high = 0.92`, `significant = true`
- **THEN** the row MUST have `gap_rps = -10`, `gap_rps_low = -12`, `gap_rps_high = -8` and `gap_rps_significant = true`

#### Scenario: Single round

- **WHEN** a comparison has one round (`low` and `high` are `NaN`)
- **THEN** the gap MUST be stored and its bounds MUST be empty, not `NaN`

### Requirement: The publish command pushes a run with create-only rights

`yarn bench:publish <results.json>` SHALL read `DIRECTUS_URL` and `DIRECTUS_TOKEN`, read the run context from the GitHub Actions environment when present, and create the run (with an id it generates) then its rows, with two create requests, so that the token only needs the `create` permission. It MUST fail with a non-zero exit code when Directus answers an error, and MUST skip publishing with a notice and a zero exit code when `DIRECTUS_TOKEN` is empty.

#### Scenario: No token

- **WHEN** the command runs without `DIRECTUS_TOKEN`
- **THEN** it MUST print that publishing is skipped and exit with code 0 without any request

#### Scenario: Directus rejects the payload

- **WHEN** Directus answers `403` or `400`
- **THEN** the command MUST print the status and the error message and exit with a non-zero code

#### Scenario: Context of a pull request run

- **WHEN** the command runs in the workflow of a pull request labeled `benchmark`
- **THEN** the run MUST have the trigger `pull_request`, the pull request number, the head sha, the head branch as ref, and the URL of the workflow run

### Requirement: CI publishes with trusted code

The **Benchmark** workflow SHALL publish in a separate job that needs the measuring job, runs even when the measuring job failed the response check (as long as `results.json` exists), checks out the base commit (pull request) or the dispatched commit, not the pull request head, and gets the token from the `DIRECTUS_TOKEN` organization secret. The `Benchmark publisher` policy, attached to the user of that token, MUST only allow creating items in `benchmark_runs` and `benchmark_results`.

#### Scenario: Fork pull request

- **WHEN** the workflow runs for a pull request from a fork (no secrets)
- **THEN** the publish job MUST skip publishing and succeed

#### Scenario: Policy scope

- **WHEN** a user that only has the `Benchmark publisher` policy reads, updates or deletes a benchmark item
- **THEN** Directus MUST answer `403`

### Requirement: Benchmarks dashboard

The CMS SHALL provide a **Benchmarks** Insights dashboard, exported under `imports/data/directus-dashboards/` and installed by the dashboards import, with: the number of runs and of significant regressions, the latest runs, a run selector that filters the results and gaps shown for that run, the trend over runs of the req/s gap and of the share of the raw ceiling grouped by platform for a selectable route, and the latest significant regressions.

#### Scenario: Pick a run

- **WHEN** a user selects a run in the run selector
- **THEN** the results and gap panels MUST only show the rows of that run

#### Scenario: Trend across machines

- **WHEN** runs come from different CI machines
- **THEN** the trend panels MUST plot relative values only (gap against the baseline, share of the raw ceiling), not absolute req/s
