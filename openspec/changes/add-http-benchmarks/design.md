## Context

- The perf commits of October 2026 landed between the releases **v8.44.1** (before) and **v8.44.11** (all core perf commits included). They were measured with micro-benchmarks only.
- A micro-benchmark can mislead: `getValue` looked ~25% slower with a literal expression (V8 caches `split()` results for literal strings), while it is ~29% faster on the real path, where `ParseExpressionPipe` builds the key with `join()`.
- The repo has no HTTP load tooling. `@tsed/perf` only logs method durations, and `.github/workflows/install-wrk.sh` (build of wrk) is not used by any workflow.
- CI is GitHub Actions (`build.yml`, `ubuntu-latest`, Node 24.18.0, Yarn workspaces). `tools/*` are workspaces.
- `@tsed/platform-fastify` exists since 8.8.0; Express and Koa since 8.0.0.

## Goals / Non-Goals

**Goals:**

- A stable before/after gap for Express, Koa and Fastify, between any two published versions, or between a version and the current checkout.
- The same tool locally and in CI, with a report a reviewer can read (job summary) and raw data a script can read (JSON).
- Separate the gains visible per request (requests/s, latency, CPU per request) from the startup gains (cold start).

**Non-Goals:**

- Absolute numbers comparable across machines or across CI runs.
- A required CI check or an automatic regression gate (the noise of shared runners does not allow it yet).
- Benchmarks of non-HTTP packages (ORM, GraphQL, MCP) and of Ts.ED v7.
- Persisting a history of results (see Open Questions).

## Decisions

### D1. Targets are installed like a user installs Ts.ED

Each target gets its own directory `tools/benchmarks/.targets/<target>/` with a generated `package.json` and `npm install`:

- a version (`8.44.1`): `@tsed/*` at that exact version from the registry;
- `local`: tarballs packed from the built workspaces (`yarn pack` after `yarn build`), wired with npm `overrides` so that every `@tsed/*` dependency, including the transitive ones, resolves to a local tarball and never to the registry (the workspace versions are placeholders such as `8.17.0`, which also exist on npm).

Third-party dependencies (`express`, `koa`, `fastify`, `body-parser`, `koa-bodyparser`, `@fastify/*`, `ajv`) are pinned in one shared list and written into every target, so only Ts.ED differs.

_Alternatives_: running the sources of two git worktrees (needs a full install and build per version, and is not what users run); comparing `lib/` folders directly (no transitive version control). Installing from npm makes the "per version" comparison free: no build for published versions.

The list of `@tsed/*` packages to pack for `local` is the dependency closure of the three platform packages plus `@tsed/ajv`, computed from the workspace graph.

### D2. One bench app, compiled once, copied into each target

`tools/benchmarks/app/` holds the Ts.ED app (`Server`, controllers, models) written against the v8 public API, and one entry per platform (`express.ts`, `koa.ts`, `fastify.ts`). It is compiled once with `tsc` (`experimentalDecorators`, `emitDecoratorMetadata`), and the JS output is copied into each target directory so that `@tsed/*` resolves from that target's `node_modules`.

Routes (see spec): `GET /hello`, `GET /users/:id?page=`, `POST /orders` (20 items), `GET /orders?size=500`. Payloads are fixed fixtures. Before measuring, the runner checks each route's status and body against an expected snapshot.

Raw apps (`tools/benchmarks/raw/`) implement `GET /hello` without Ts.ED. They are measured as an extra target `raw` in each round.

### D3. Measurement protocol

- The server is started with `child_process.spawn` and an `ipc` stdio channel (so that it can run under `taskset`), logger disabled, `NODE_ENV=production`. The runner asks the server for `process.cpuUsage()` over IPC before and after each measurement, so no extra route is involved.
- autocannon runs in the runner process, through its API: connections 50, pipelining 1, a warmup (default 2 s) then the measured window (default 5 s) per route.
- On Linux, the server runs under `taskset -c 0` and the runner under `taskset -c 1-<n>` (the runner is started under `taskset` by the CLI wrapper). Without `taskset` (macOS), the runner warns that gaps under ~3% are not reliable.
- Rounds (default 5): in each round, the order of the targets is shuffled (seeded, the seed is in the JSON); for each target and platform, one server process is started, all routes are measured, then it is stopped.
- Startup: per target and platform, 10 cold starts, interleaved, from `fork()` to the first `200` on `/hello`, median.

_Alternative_: one long measurement per target. Rejected: runner drift (thermal, noisy neighbours) then shows up as a gap between targets. Interleaved short rounds turn the drift into noise that the paired ratio cancels.

### D4. Statistics on paired per-round ratios

For each metric, round _i_ gives a ratio `r_i = target_i / baseline_i` (inverted for latency and CPU, so that > 1 always means better). The report gives the **geometric mean** of the `r_i` and a 95% confidence interval from a Student t-interval on `log(r_i)`. The gap is significant when the interval does not contain 1.

The geometric mean is used rather than the median: with 5–10 rounds a bootstrap interval of the median is too coarse, while the t-interval on log ratios is the usual method for speedups.

### D5. CI workflow `benchmark.yml`

- Triggers: `workflow_dispatch` (inputs `targets`, `rounds`, `duration`, `platforms`) and `pull_request` with `types: [labeled]` filtered on the `benchmark` label. It uses `pull_request`, not `pull_request_target`: no secret is needed and fork code never runs with write permissions.
- One job, `ubuntu-latest`, Node 24.18.0: every target of a comparison is measured in this single job (requirement "only compared within one run").
- PR mode: checks out the base branch into a second directory, builds both, packs both as `local-base` and `local-head` (`--local-dir local-<name>=<path>`).
- `workflow_dispatch` is only available once the workflow is on the default branch: the first dispatch run happens after the merge.
- Dispatch default `targets`: the latest release (`npm view @tsed/core version`) and `local`.
- Output: `report.md` appended to `$GITHUB_STEP_SUMMARY`, `results.json` uploaded as an artifact (90 days).

Duration estimate with the defaults (2 targets + raw, 3 platforms, 4 routes, 5 rounds, 2 s + 5 s): about 16 minutes of measurement, plus about 6 minutes of install and build. Acceptable for an on-demand job, not for every PR.

### D6. Location and scripts

- `tools/benchmarks` is a private workspace (`@tsed/benchmarks`), like the other `tools/*`. It is excluded from `yarn test` and `yarn build`. `.targets/` and `results/` are git-ignored.
- Root scripts: `yarn bench` (run with options) and `yarn bench:compare <target...>`.
- `install-wrk.sh` is deleted.

## Risks / Trade-offs

- [Shared CI runners are noisy, by several %] → interleaved rounds, paired ratios, CPU per request (less sensitive to load than requests/s), and an explicit "not significant" verdict; more rounds through the dispatch input when a gap is small.
- [The bench app uses an API that changed between two v8 versions] → the app only uses long-standing public API; a target that fails the response check is reported as failed, not measured.
- [`yarn pack` of `local` resolves a placeholder version from npm] → npm `overrides` for every `@tsed/*` package; the runner checks after install, in `package-lock.json`, that each `@tsed/*` package of the `local` target comes from a tarball.
- [A third-party major upgrade changes the baseline] → the shared pinned list is versioned with the tool, and its versions are printed in the report.
- [Measuring only HTTP hides gains in non-HTTP code paths] → out of scope; micro-benchmarks stay the tool for that.
- [The run takes ~20 min] → on demand only; `platforms` and `rounds` inputs to shorten it.

## Migration Plan

Additive. Nothing to migrate. Rollback: delete `tools/benchmarks` and `benchmark.yml`.

## Open Questions

- Should the labelled PR run also post the summary as a PR comment (needs `pull-requests: write`, which a `pull_request` event from a fork does not get)? Default in this change: job summary only.
- Should results be persisted per release (for example a `benchmarks` branch or a docs page with a chart)? Per the "one run" requirement, such a page would have to be regenerated by a single run over the listed versions, not appended run by run.
