# @tsed/benchmarks

HTTP benchmark of a Ts.ED server on Express, Koa and Fastify, to measure the performance gap between two versions of Ts.ED.

## Run it

The bench app is compiled against the types of the workspace packages, so build the checkout once first, even to compare
published versions:

```bash
yarn build

# two published versions, installed from npm
yarn bench:compare 8.44.1 8.44.12

# the last release against this checkout (rebuild after each change)
yarn bench:compare 8.44.12 local

# several versions in one run, a subset of platforms and routes, more rounds
yarn bench --targets 8.40.0,8.44.1,local --platforms express,fastify --routes users,orders-list --rounds 10
```

The first target is the baseline. `yarn bench --help` lists every option. The results are written to
`tools/benchmarks/results/<date>/` (`results.json` and `report.md`).

A target is:

- a published version (`8.44.1`): the `@tsed/*` packages of that version, from the npm registry;
- `local`: the packages built in this checkout (`lib/esm`), packed with `yarn pack`;
- `local-<name>`: the packages built in another checkout, with `--local-dir local-<name>=<path>` (used by the CI to compare the
  base branch of a pull request with its head).

A platform that a version does not publish (Fastify before 8.8.0) is reported as not available.

## In CI

The **Benchmark** workflow (`.github/workflows/benchmark.yml`) only runs on demand:

- **Run workflow** in the Actions tab, with the targets (default: the latest release and `local`), the platforms, the rounds and
  the duration;
- the `benchmark` label on a pull request: the base branch and the head are built and compared (`local-base`, `local-head`).
  Remove and add the label again to run it again. A maintainer creates the label once in the repository settings.

The report is appended to the job summary, and `results.json` is uploaded as the `benchmark-results` artifact.

## What is measured

The bench app (`app/`) uses the public API of Ts.ED v8 and exposes the same routes on every platform:

| Route                  | What it costs                                                   |
| ---------------------- | --------------------------------------------------------------- |
| `GET /hello`           | the fixed cost of the framework (routing, context, response)    |
| `GET /users/:id?page=` | path and query parameters, with validation                      |
| `POST /orders`         | a validated body of 20 items, deserialized then serialized back |
| `GET /orders?size=500` | the serialization of a large typed response                     |

The raw apps (`raw/`) answer `GET /hello` without Ts.ED: they give the ceiling of each platform.

Before measuring, the runner checks the status and the body of every route on every target. A target that answers something
else is reported as failed and is not measured.

For each target, platform and route: requests per second, latency p50 and p99, server CPU time per request (from
`process.cpuUsage()` of the server process, read over IPC), and the cold start time (from the spawn of the process to the
first `200`).

## How the gap is made stable

- **Same dependencies**: every target is installed in its own directory (`.targets/<target>`), with the same versions of
  Express, Koa, Fastify and their middlewares (`src/deps.mjs`). npm overrides force every `@tsed/*` package, transitive ones
  included, to the version (or the tarball) of the target. Only the Ts.ED code differs.
- **Interleaved rounds**: each round measures every target once, in a shuffled order (seeded, the seed is in the report). A
  drift of the machine during the run (heat, a noisy neighbour) spreads over every target instead of favouring one.
- **Warmup**: each route is loaded for `--warmup` seconds before the measured window. The warmup is not counted.
- **CPU pinning** (Linux, with `taskset`): the server runs on the first CPU the process may use, autocannon on the others (a container can restrict the CPU set).
- **Paired ratios**: the gap is the geometric mean of the per-round ratios against the baseline, with a 95% confidence interval
  (Student t-interval on the log ratios). The ratio of latency, CPU and startup is inverted, so a positive gap always means better.

## Reading the report

- `**+12.3%** [+9.8; +14.9] better`: the gap is significant, its interval does not contain 0.
- `+0.8% [-1.5; +3.2] not significant`: the gap is inside the noise. Run more rounds (`--rounds 10`) to narrow the interval.
- Only compare numbers of the same report. Absolute numbers depend on the machine, and two CI runs use two different machines.
  To follow the evolution over several releases, pass all of them as targets of one run.
- On macOS (no `taskset`), gaps under ~3% are not reliable.

## Tests

```bash
cd tools/benchmarks && yarn test
```
