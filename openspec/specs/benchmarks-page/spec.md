# benchmarks-page Specification

## Purpose

Show the performance of Ts.ED on tsed.dev: after each stable release, compare it with the reference version 8.44.1 and with the plain frameworks, through a read-only CMS endpoint and the /benchmarks page.

## Requirements

### Requirement: A benchmark runs after each stable release

The **Benchmark** workflow SHALL run when a GitHub release is published, except prereleases, with the targets `<reference>,<released version>` where the reference is `8.44.1`, on every platform, with the default rounds and duration, and publish the run with the trigger `release`. It MUST wait until the released version is available on npm before installing it.

#### Scenario: Stable release

- **WHEN** the release `v8.45.0` is published
- **THEN** the workflow MUST benchmark `8.44.1,8.45.0` on Express, Koa and Fastify
- **AND** the published run MUST have the trigger `release`, the ref `v8.45.0` and the title `Release v8.45.0`

#### Scenario: Prerelease

- **WHEN** the prerelease `v8.46.0-beta.1` is published
- **THEN** the workflow MUST NOT run the benchmark

### Requirement: Read-only benchmark endpoint

The CMS SHALL expose `GET /rest/benchmarks` without authentication, read-only, answering the latest successful run whose baseline is the reference and whose other target is a published version (trigger `release` first, then `workflow_dispatch`), as: `date`, `reference`, `latest`, `config` (rounds, duration, connections), `environment` (node, cpu, cores, pinned), `runUrl`, and per platform: the `hello` req/s of `raw`, `reference` and `latest`, and per route the req/s, p99 and CPU per request of both targets with the gap of `latest` (value, low, high, significant). It MUST send `Cache-Control: public, max-age=3600`.

#### Scenario: Latest release run

- **WHEN** two release runs exist, `8.44.1,8.45.0` and `8.44.1,8.46.0`
- **THEN** the endpoint MUST answer the `8.46.0` run, with `latest: "8.46.0"` and `reference: "8.44.1"`

#### Scenario: No run yet

- **WHEN** no matching run exists
- **THEN** the endpoint MUST answer `404` with a message

#### Scenario: Pull request runs are ignored

- **WHEN** the newest run is a pull request run (`local-base`, `local-head`)
- **THEN** the endpoint MUST still answer the latest release run

### Requirement: Benchmarks page on tsed.dev

The website SHALL have a `/benchmarks` page that fetches `GET /rest/benchmarks` from the browser and shows: a bar chart per platform of `GET /hello` req/s for the raw framework, the reference and the latest release, with the share of the raw framework; a table per platform of the gap of the latest release against the reference per route (req/s and CPU per request) with the interval, marking non significant gaps as such; the date, versions, machine and a link to the CI run; and a note that numbers come from one CI machine and only compare within the run. Wherever the page names the reference and the latest release together, it MUST name the reference first.

#### Scenario: Data loaded

- **WHEN** the endpoint answers a run
- **THEN** the page MUST render the three bars per platform and the gap tables, and title them with the reference and latest versions

#### Scenario: Reference first

- **WHEN** the endpoint answers the reference `8.44.1` and the latest `8.45.1`
- **THEN** the header card MUST read "v8.44.1 vs v8.45.1"
- **AND** the per-route section MUST be titled "From v8.44.1 to v8.45.1"
- **AND** the bars and their legend MUST list the plain framework, then v8.44.1, then v8.45.1

#### Scenario: Endpoint unavailable

- **WHEN** the endpoint fails or answers 404
- **THEN** the page MUST show a message instead of the header card, the bars and the gap table, without a client error

#### Scenario: Dark mode and mobile

- **WHEN** the page is shown in dark mode or at phone width
- **THEN** the charts MUST use the theme colors and fit the width without horizontal scrolling

### Requirement: Read-only benchmark history endpoint

The CMS SHALL expose `GET /rest/benchmarks/history` without authentication, read-only, answering per published Ts.ED version measured against the reference `8.44.1` the req/s gaps of the routes `hello`, `users`, `orders-create` and `orders-list` per platform, taken from the newest successful run with the baseline `8.44.1` and the trigger `release` or `workflow_dispatch` whose targets include that version, and per platform a `score`: the geometric mean of the req/s ratios of these four routes, in %. The reference MUST be the first version with a score of `0`, and the other versions MUST follow in semver order. It MUST send `Cache-Control: public, max-age=3600`.

#### Scenario: Manual run and release runs combined

- **WHEN** a manual run measured `8.44.1` to `8.44.13` and a release run measured `8.44.1,8.45.1`
- **THEN** the endpoint MUST answer the versions `8.44.1`, `8.44.2`, …, `8.44.13`, `8.45.1` in this order
- **AND** the points of `8.44.2` to `8.44.13` MUST come from the manual run and the point of `8.45.1` from the release run, each with the date and URL of its run

#### Scenario: Version measured by several runs

- **WHEN** two successful runs measured `8.45.1` against `8.44.1`
- **THEN** the endpoint MUST answer the gaps of the newest run for `8.45.1`

#### Scenario: Score is the geometric mean of the route gaps

- **WHEN** a version has on Express the req/s gaps `+3.2%`, `+16.4%`, `+27.0%` and `+87.1%` on the four routes
- **THEN** its Express score MUST be `((1.032 × 1.164 × 1.270 × 1.871)^(1/4) − 1) × 100`, about `+30.0`

#### Scenario: Missing route

- **WHEN** a version has no `orders-create` gap on Koa
- **THEN** its Koa score MUST be `null` and the gaps it has MUST still be listed

#### Scenario: Runs that are not versions are ignored

- **WHEN** runs exist with the trigger `pull_request`, a failed status, another baseline, or targets such as `local`, `local-base` or `local-head`
- **THEN** none of their targets MUST appear in the history

#### Scenario: No history yet

- **WHEN** no successful run measured a published version against `8.44.1`
- **THEN** the endpoint MUST answer `404` with a message

### Requirement: Evolution chart on the benchmarks page

The `/benchmarks` page SHALL fetch `GET /rest/benchmarks/history` and show an **Evolution** section with a line chart drawn in inline SVG without a chart library: X the versions from the reference to the latest measured one, Y the score in %, with a 0% line, one line per platform labeled "Ts.ED Express", "Ts.ED Koa" and "Ts.ED Fastify". Lines MUST be told apart by color, marker shape and a text label, and a table under the chart MUST give every score as text with the date of its run.

#### Scenario: History loaded

- **WHEN** the history endpoint answers 14 versions on three platforms
- **THEN** the page MUST draw three lines of 14 points and the table MUST list the 14 versions with the three scores, formatted as signed percentages

#### Scenario: Missing point

- **WHEN** a version has a `null` score on a platform
- **THEN** that line MUST break at this version and the table MUST show "–" for it

#### Scenario: History unavailable

- **WHEN** the history endpoint fails or answers 404 while `GET /rest/benchmarks` answers
- **THEN** the Evolution section MUST show a message, the rest of the page MUST render, and no client error MUST be thrown

#### Scenario: Latest comparison unavailable

- **WHEN** `GET /rest/benchmarks` fails or answers 404 while the history endpoint answers
- **THEN** the page MUST show the message about the latest benchmark and still render the Evolution section with the reference of the history

#### Scenario: Accessible values

- **WHEN** the chart is read with a screen reader or without color perception
- **THEN** each point MUST have a text title with platform, version and score, the SVG MUST have a text alternative, and every value MUST be in the table

#### Scenario: Dark mode and phone width

- **WHEN** the page is shown in dark mode or at a 375px wide viewport
- **THEN** the chart MUST use the theme colors, scale to the content width without horizontal scrolling, and keep its version labels from overlapping
