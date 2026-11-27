## Why

The Benchmark workflow publishes every run to the CMS, including manual runs dispatched from any branch. The measured versions come from npm, but the benchmark apps and harness (`tools/benchmarks`) come from the dispatched branch, so a branch that changes them can feed `GET /rest/benchmarks` and `GET /rest/benchmarks/history`, and therefore tsed.dev/benchmarks, with numbers the default branch would not produce.

## What Changes

- `GET /rest/benchmarks` and `GET /rest/benchmarks/history` only read release runs and manual runs dispatched from the default branch `production` (`git_ref = production`).
- Every run is still stored in the CMS: pull request and branch runs stay available in the Directus dashboard (`benchmark-tracking` is unchanged).
- The 8.44.x points, measured on 2026-11-03 by a manual run dispatched from `feat/benchmark-cms`, are measured again by a manual run dispatched from `production`.

## Capabilities

### New Capabilities

### Modified Capabilities

- `benchmarks-page`: both read-only endpoints ignore manual runs dispatched from another branch than `production`.

## Impact

- `tsedio/tsed-cms`: `BenchmarksService` run filters and unit tests.
- No change in the Ts.ED repo besides this spec; the workflow already stores the branch as `git_ref`.
