# Agent lessons

Rules learned from user corrections. Review them at the start of each session (see `AGENTS.md` > Agent workflow).

Format: one entry per pattern, with the rule, why it matters and how to apply it.

<!-- Add new lessons below. -->

## Keep small but measurable gains in shared utilities and startup code

- **Rule**: when optimizing, keep a ~5% gain on a utility used across many packages, and keep startup-only gains (decorator composition, metadata registration). Do not discard them as noise just because the per-request path is not affected.
- **Why**: Ts.ED runs in serverless functions (AWS Lambda) where cold start time matters, and `@tsed/core` utilities such as `cleanObject` are called from dozens of packages, so small gains add up.
- **How to apply**: discard only changes whose gain is inside the run-to-run variance of the A/B loop. For startup code, say in the commit that the gain targets cold starts.

## Build a nested worktree with `NX_WORKSPACE_ROOT_PATH`

- **Rule**: in a worktree under `.claude/worktrees/`, run `yarn install` then `NX_WORKSPACE_ROOT_PATH=$PWD yarn build`. Do not fall back to building packages one by one with `tsc`.
- **Why**: the repository has no `nx.json`, so Nx (behind Lerna) climbs up to the highest directory that holds `node_modules/nx`: the main checkout. `yarn build` then reports success but builds the packages of the main checkout, and the worktree keeps no `lib/`.
- **How to apply**: after the build, check that `packages/<path>/lib/esm` exists in the worktree for the packages you need.

## Keep local benchmarks light on memory

- **Rule**: run the HTTP benchmark on one platform at a time, with few rounds (`--rounds 3 --startups 1`), one profiled server at a time, and check the free memory (`memory_pressure`) before and during the run.
- **Why**: a full run (several targets × platforms × routes) on a machine already loaded by other sessions saturated the user's RAM and the run failed anyway.
- **How to apply**: watch the run with a guard that stops it below ~25% of free memory, and leave the full matrix to the CI workflow.
