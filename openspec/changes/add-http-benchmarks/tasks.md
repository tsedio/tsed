## 1. Workspace setup

- [x] 1.1 Create the private workspace `tools/benchmarks` (`@tsed/benchmarks`, `type: module`) with `autocannon` and the pinned third-party list (`express`, `koa`, `fastify` and their body parsers), git-ignore `.targets/` and `results/`, and keep it out of `yarn build` and `yarn test`
- [x] 1.2 Add the root scripts `yarn bench` and `yarn bench:compare <target...>`
- [x] 1.3 Delete the unused `.github/workflows/install-wrk.sh`

## 2. Bench applications

- [x] 2.1 Write the Ts.ED bench app (`Server`, controllers for `/hello`, `/users/:id`, `/orders`, models with validation) using only v8 public APIs, plus one entry per platform (Express, Koa, Fastify) that boots it with the logger disabled and answers the runner's IPC `cpu` message with `process.cpuUsage()`
- [x] 2.2 Write the fixtures (20-item `POST /orders` body, 500-item response) and the expected response snapshot of each route
- [x] 2.3 Write the raw Express, Koa and Fastify apps for `GET /hello` with the same IPC contract
- [x] 2.4 Compile the bench app once with `tsc` (decorators + metadata) into `tools/benchmarks/dist/app`

## 3. Targets

- [x] 3.1 Install a published version: generate `.targets/<version>/package.json` with the `@tsed/*` packages at that version and the pinned third-party list, run `npm install`, copy the compiled app
- [x] 3.2 Detect platforms missing from a version (`npm view`, e.g. Fastify before 8.8.0) and mark them as not available
- [x] 3.3 Install `local`: compute the dependency closure of the three platforms + `@tsed/ajv` from the workspace graph, `yarn pack` each package, write npm `overrides` so every `@tsed/*` resolves to a tarball, then check in `package-lock.json` that no `@tsed/*` comes from the registry
- [x] 3.4 Support named local targets (`local-base`, `local-head`) built from another checkout directory, for the PR mode
- [x] 3.5 Unit-test the generation of `package.json` and `overrides` for a version and for `local`

## 4. Runner

- [x] 4.1 Start a server with `fork()` (under `taskset -c 0` on Linux), wait for `/hello`, check every route against its snapshot, fail the target on a mismatch
- [x] 4.2 Measure a route with the autocannon API: warmup, then the measured window, collecting requests/s, latency p50/p99, request count, and the server CPU delta over IPC
- [x] 4.3 Run the interleaved rounds with a seeded shuffle of the targets (raw included), one server per (target, platform) per round
- [x] 4.4 Measure cold starts: 10 interleaved starts per (target, platform), fork to first `200`
- [x] 4.5 CLI options (`--targets`, `--platforms`, `--routes`, `--rounds`, `--duration`, `--warmup`, `--connections`, `--seed`, `--out`), start the runner itself under `taskset` on Linux, warn when pinning is not available
- [x] 4.6 Unit-test the round scheduling (every target once per round, shuffled, reproducible with a seed)

## 5. Statistics and report

- [x] 5.1 Compute per-round ratios against the baseline (inverted for latency and CPU), their geometric mean and the 95% t-interval on log ratios, and the significance verdict
- [x] 5.2 Write `results.json` (config, seed, environment: Node, OS, CPU model, cores, third-party versions; raw per-round results; comparisons)
- [x] 5.3 Write `report.md`: one table per platform (route × target: req/s, p50, p99, CPU µs/req, gap with interval, verdict), a startup table, the raw ceiling, and the noise warning when relevant
- [x] 5.4 Unit-test the statistics with fixed inputs (significant gain, gap inside the noise, latency inversion)

## 6. CI workflow

- [x] 6.1 Add `.github/workflows/benchmark.yml` with `workflow_dispatch` inputs (`targets` defaulting to the latest release + `local`, `platforms`, `rounds`, `duration`) and `pull_request: types: [labeled]` filtered on the `benchmark` label
- [x] 6.2 PR mode: check out the base branch into a second directory, install and build both, run with `local-base` and `local-head` in the same job
- [x] 6.3 Append `report.md` to `$GITHUB_STEP_SUMMARY` and upload `results.json` as an artifact
- [ ] 6.4 Create the `benchmark` label on the repository (manual step for a maintainer, documented)

## 7. Validation and docs

- [x] 7.1 Run locally `yarn bench:compare 8.44.1 8.44.12` and `yarn bench:compare 8.44.12 local` on the three platforms and check the report
- [ ] 7.2 Run the workflow by dispatch on the targets `8.44.1,8.44.12` and check that two consecutive runs give the same verdicts
- [x] 7.3 Document in the contributor docs how to run a benchmark locally and in CI, and how to read the report (interval, significance, why numbers from two runs are not compared)
- [x] 7.4 `yarn test:lint` and `openspec validate add-http-benchmarks`
