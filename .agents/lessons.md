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
