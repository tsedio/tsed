# Agent lessons

Rules learned from user corrections. Review them at the start of each session (see `AGENTS.md` > Agent workflow).

Format: one entry per pattern, with the rule, why it matters and how to apply it.

<!-- Add new lessons below. -->

## Keep small but measurable gains in shared utilities and startup code

- **Rule**: when optimizing, keep a ~5% gain on a utility used across many packages, and keep startup-only gains (decorator composition, metadata registration). Do not discard them as noise just because the per-request path is not affected.
- **Why**: Ts.ED runs in serverless functions (AWS Lambda) where cold start time matters, and `@tsed/core` utilities such as `cleanObject` are called from dozens of packages, so small gains add up.
- **How to apply**: discard only changes whose gain is inside the run-to-run variance of the A/B loop. For startup code, say in the commit that the gain targets cold starts.

## Keep the microtasks of an async API when optimizing it

- **Rule**: an optimization of an async function must not remove `await`s or the `Promise.all()` / `Promise.resolve()` steps its callers can observe, even when the value they wait for is not a promise.
- **Why**: `asyncEmit()` once skipped `Promise.all()` when no listener returned a thenable. `@tsed/config` logs a refresh error from a listener that does not return its promise, and its test only passed thanks to those ticks: CI failed on tsedio/tsed#3526. Probing `then` before `Promise.all()` also read the accessor twice.
- **How to apply**: keep the promise chain as is and remove work around it (allocations, loops). List the tick count as a behaviour to preserve, and run the suites of the callers that do fire-and-forget work in a listener.

## Run dependent suites against the worktree sources

- **Rule**: in a worktree without its own `yarn install`, `@tsed/*` imports resolve through the main checkout's `node_modules` symlinks to the main checkout's packages, whatever branch it is on. Alias every `@tsed/*` package to the worktree `src/index.ts` in a temporary Vitest config before trusting a dependent suite.
- **Why**: the dependent suites of tsedio/tsed#3526 passed locally without testing the change, and showed failures (`@tsed/schema`, `groups.spec.ts`) that came from another branch.
- **How to apply**: check where an import resolves (`ls -la node_modules/@tsed/<pkg>`) and compare a failing suite with the base code under the same setup before reporting it.

## Build a nested worktree with `NX_WORKSPACE_ROOT_PATH`

- **Rule**: in a worktree under `.claude/worktrees/`, run `yarn install` then `NX_WORKSPACE_ROOT_PATH=$PWD yarn build`. Do not fall back to building packages one by one with `tsc`.
- **Why**: the repository has no `nx.json`, so Nx (behind Lerna) climbs up to the highest directory that holds `node_modules/nx`: the main checkout. `yarn build` then reports success but builds the packages of the main checkout, and the worktree keeps no `lib/`.
- **How to apply**: after the build, check that `packages/<path>/lib/esm` exists in the worktree for the packages you need.

## Name a fix branch after its issue

- **Rule**: a branch that fixes a GitHub issue is named `fix-{issue}-{short-kebab-description}`, e.g. `fix-3540-deep-merge-null-primitive-date`.
- **Why**: the user asked to rename the branch prepared for tsedio/tsed#3540, which had been pushed under the session's generated name.
- **How to apply**: when asked to prepare a branch for an issue, create it with this pattern from the start, even if the session suggests another branch name.

## Keep local benchmarks light on memory

- **Rule**: run the HTTP benchmark on one platform at a time, with few rounds (`--rounds 3 --startups 1`), one profiled server at a time, and check the free memory (`memory_pressure`) before and during the run.
- **Why**: a full run (several targets × platforms × routes) on a machine already loaded by other sessions saturated the user's RAM and the run failed anyway.
- **How to apply**: watch the run with a guard that stops it below ~25% of free memory, and leave the full matrix to the CI workflow.
