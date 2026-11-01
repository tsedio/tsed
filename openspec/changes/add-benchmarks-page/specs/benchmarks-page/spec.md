## ADDED Requirements

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

The website SHALL have a `/benchmarks` page that fetches `GET /rest/benchmarks` from the browser and shows: a bar chart per platform of `GET /hello` req/s for the raw framework, the reference and the latest release, with the share of the raw framework; a table per platform of the gap of the latest release against the reference per route (req/s and CPU per request) with the interval, marking non significant gaps as such; the date, versions, machine and a link to the CI run; and a note that numbers come from one CI machine and only compare within the run.

#### Scenario: Data loaded

- **WHEN** the endpoint answers a run
- **THEN** the page MUST render the three bars per platform and the gap tables, and title them with the reference and latest versions

#### Scenario: Endpoint unavailable

- **WHEN** the endpoint fails or answers 404
- **THEN** the page MUST show a message instead of the charts, without a client error

#### Scenario: Dark mode and mobile

- **WHEN** the page is shown in dark mode or at phone width
- **THEN** the charts MUST use the theme colors and fit the width without horizontal scrolling
