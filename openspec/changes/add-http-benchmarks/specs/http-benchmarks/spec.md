## ADDED Requirements

### Requirement: Benchmark targets are installed in isolation

The benchmark runner SHALL accept a list of targets. A target is either a published version of Ts.ED (for example `8.44.1`) or `local` (the packages built from the current checkout). Each target MUST be installed in its own directory, with the same versions of the third-party dependencies (`express`, `koa`, `fastify`, their middlewares) for every target, so that only the Ts.ED code differs between two targets.

#### Scenario: Compare two published versions

- **WHEN** the runner is started with the targets `8.44.1` and `8.44.12`
- **THEN** each target directory MUST contain the `@tsed/*` packages of its own version, installed from the npm registry
- **AND** both directories MUST resolve the same version of `express`, `koa` and `fastify`

#### Scenario: Compare the current checkout with a release

- **WHEN** the runner is started with the targets `8.44.12` and `local`
- **THEN** the `local` target MUST be installed from tarballs packed from the built packages of the checkout (`lib/esm`), not from the TypeScript sources

#### Scenario: Platform missing from a version

- **WHEN** a target does not publish one of the platforms (for example `@tsed/platform-fastify` before 8.8.0)
- **THEN** the runner MUST skip that platform for that target and mark it as not available in the report
- **AND** the other platforms of that target MUST still be measured

### Requirement: One bench application runs on every platform and target

The benchmark SHALL use a single Ts.ED application, compiled once, that boots on `@tsed/platform-express`, `@tsed/platform-koa` and `@tsed/platform-fastify`, and only uses APIs available in every supported target (Ts.ED v8). It MUST expose the same routes on every platform:

- `GET /hello`: returns a constant string (fixed framework cost);
- `GET /users/:id?page=`: path and query parameters with validation;
- `POST /orders`: a validated, typed body, deserialized then serialized back (20 items);
- `GET /orders?size=500`: serialization of a large typed response.

A raw application per platform (without Ts.ED) MUST expose `GET /hello` as the framework ceiling.

#### Scenario: Same responses on every platform

- **WHEN** the bench application is started on any platform and target
- **THEN** each route MUST answer with the same status code and the same JSON body, checked before the load test starts
- **AND** a route that answers with an unexpected status or body MUST fail the run instead of being measured

### Requirement: Measurement protocol limits noise

The runner SHALL measure every (target, platform, route) combination with autocannon, with the server and autocannon in separate processes. Targets MUST be measured in interleaved rounds (each round measures every target once, in a shuffled order), with a warmup before each measurement. On Linux, the server and autocannon MUST be pinned to distinct CPU cores. Duration, connections, rounds and warmup MUST be configurable, with defaults suited to CI.

#### Scenario: Interleaved rounds

- **WHEN** the runner measures the targets A and B over 5 rounds
- **THEN** each round MUST measure A and B once each, in a random order
- **AND** a target MUST never be measured in 5 consecutive measurements before the other one starts

#### Scenario: Warmup is excluded

- **WHEN** a server starts for a measurement
- **THEN** the warmup requests MUST NOT be counted in the requests/s, latency or CPU results

### Requirement: Results report each target against a baseline

For each (platform, route), the report SHALL give, per target: requests/s (median over rounds), latency p50 and p99, server CPU time per request (from `process.cpuUsage()` of the server process divided by the number of requests), and startup time (from process spawn to the first successful response, median of repeated cold starts). Each target MUST be compared with the baseline target (the first target by default) through the per-round ratios (target / baseline, measured in the same round, inverted for latency and CPU so that a ratio above 1 always means better): the report gives their geometric mean and a 95% confidence interval. A gap whose interval contains 1 MUST be reported as not significant.

#### Scenario: Significant improvement

- **WHEN** the per-round ratios of requests/s of `local` against `8.44.1` have a geometric mean of 1.05 and a 95% confidence interval of [1.04, 1.07]
- **THEN** the report MUST show `+5%` with the interval and mark the gap as significant

#### Scenario: Gap inside the noise

- **WHEN** the 95% confidence interval of the ratio is [0.98, 1.03]
- **THEN** the report MUST mark the gap as not significant instead of reporting it as a gain or a regression

#### Scenario: Machine-readable output

- **WHEN** a run ends
- **THEN** the runner MUST write a JSON file with the raw per-round results, the environment (Node.js version, OS, CPU model, core count) and the configuration
- **AND** a Markdown summary with one table per platform

### Requirement: Results are only compared within one run

A comparison SHALL only use measurements taken in the same run, on the same machine. To compare several versions, all of them MUST be passed as targets of one run; the report MUST NOT compare numbers coming from different runs or different machines.

#### Scenario: Version history

- **WHEN** a maintainer wants the evolution over the releases 8.40.0, 8.44.1 and 8.44.12
- **THEN** the three versions MUST be measured as targets of a single run, each compared with the first one

### Requirement: The benchmark runs in CI on demand

A GitHub Actions workflow SHALL run the benchmark on demand only:

- manually (`workflow_dispatch`), with the targets, rounds and duration as inputs (default targets: the latest release and `local`);
- on a pull request when the `benchmark` label is added: the base branch and the PR head, both as `local` builds.

The workflow MUST publish the Markdown summary in the job summary and upload the JSON results as an artifact. It MUST NOT run on every push or as a required check.

#### Scenario: Labelled pull request

- **WHEN** the `benchmark` label is added to a pull request
- **THEN** the workflow MUST build the base branch and the PR head, measure both in the same job, and publish the comparison in the job summary

#### Scenario: Regular push

- **WHEN** a commit is pushed to `production` or a pull request is updated without the `benchmark` label
- **THEN** the benchmark workflow MUST NOT run

### Requirement: The benchmark runs locally with the same tool

The same runner SHALL be available locally through root scripts, with the same options and the same report as in CI.

#### Scenario: Local run

- **WHEN** a contributor runs `yarn bench:compare 8.44.12 local` after `yarn build`
- **THEN** the runner MUST produce the same JSON and Markdown report as in CI
- **AND** it MUST warn when CPU pinning is not available (macOS) that gaps under ~3% are not reliable
