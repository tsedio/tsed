## 1. CMS (tsed-api-directus, own worktree from `origin/main`)

- [x] 1.1 Branch `feat/benchmarks-default-branch` from `origin/main`
- [x] 1.2 Restrict the run filters of `getLatestComparison()` and `getHistory()` to release runs and manual runs with `git_ref = production`
- [x] 1.3 Unit tests: one per scenario below
- [x] 1.4 `yarn test:lint`, `yarn typecheck`, `yarn test`, PR

## 2. Data

- [ ] 2.1 Dispatch the Benchmark workflow on `production` with the targets `8.44.1,8.44.2,…,8.44.13`
- [ ] 2.2 Check `GET /rest/benchmarks/history` answers the 8.44.x points from the new run once the CMS is deployed

## 3. Archive

- [ ] 3.1 After merge: sync the `benchmarks-page` spec and archive the change
