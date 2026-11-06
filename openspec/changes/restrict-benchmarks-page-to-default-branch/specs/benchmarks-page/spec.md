## MODIFIED Requirements

### Requirement: Read-only benchmark endpoint

The CMS SHALL expose `GET /rest/benchmarks` without authentication, read-only, answering the latest successful run whose baseline is the reference and whose other target is a published version (trigger `release` first, then `workflow_dispatch` dispatched from the default branch `production`), as: `date`, `reference`, `latest`, `config` (rounds, duration, connections), `environment` (node, cpu, cores, pinned), `runUrl`, and per platform: the `hello` req/s of `raw`, `reference` and `latest`, and per route the req/s, p99 and CPU per request of both targets with the gap of `latest` (value, low, high, significant). It MUST send `Cache-Control: public, max-age=3600`.

#### Scenario: Latest release run

- **WHEN** two release runs exist, `8.44.1,8.45.0` and `8.44.1,8.46.0`
- **THEN** the endpoint MUST answer the `8.46.0` run, with `latest: "8.46.0"` and `reference: "8.44.1"`

#### Scenario: No run yet

- **WHEN** no matching run exists
- **THEN** the endpoint MUST answer `404` with a message

#### Scenario: Pull request runs are ignored

- **WHEN** the newest run is a pull request run (`local-base`, `local-head`)
- **THEN** the endpoint MUST still answer the latest release run

#### Scenario: Manual run from another branch is ignored

- **WHEN** no release run matches and the newest matching manual run was dispatched from `feat/x` while an older one was dispatched from `production`
- **THEN** the endpoint MUST answer the run dispatched from `production`

### Requirement: Read-only benchmark history endpoint

The CMS SHALL expose `GET /rest/benchmarks/history` without authentication, read-only, answering per published Ts.ED version measured against the reference `8.44.1` the req/s gaps of the routes `hello`, `users`, `orders-create` and `orders-list` per platform, taken from the newest successful run with the baseline `8.44.1` and either the trigger `release` or the trigger `workflow_dispatch` with the git ref `production`, whose targets include that version, and per platform a `score`: the geometric mean of the req/s ratios of these four routes, in %. The reference MUST be the first version with a score of `0`, and the other versions MUST follow in semver order. It MUST send `Cache-Control: public, max-age=3600`.

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

#### Scenario: Manual run from another branch is ignored

- **WHEN** a manual run dispatched from `feat/x` measured `8.44.1,8.44.2` and no run dispatched from `production` or release run measured `8.44.2`
- **THEN** `8.44.2` MUST NOT appear in the history

#### Scenario: Manual run from production is kept

- **WHEN** a manual run dispatched from `production` measured `8.44.1,8.44.2`
- **THEN** the history MUST answer `8.44.2` from that run
