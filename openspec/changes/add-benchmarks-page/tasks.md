## 1. Release runs (Ts.ED repo, on top of feat/benchmark-cms)

- [x] 1.1 Add the `release: published` trigger to `benchmark.yml` (skip prereleases, `REFERENCE_VERSION`, wait for npm, check out the tag)
- [x] 1.2 Map the `release` event in `readGithubContext` and test it

## 2. Endpoint (tsed-api-directus, on top of feat/benchmarks)

- [x] 2.1 Add `release` to the `trigger` choices (local schema, snapshot, types)
- [x] 2.2 Add `BenchmarksService.getLatestComparison()` with unit tests (latest release run first, manual fallback, PR runs ignored, 404 when none)
- [x] 2.3 Add `GET /rest/benchmarks` to `tsed-rest` with the cache header; check it on the local Directus with the published 8.44.1 vs 8.44.12 run

## 3. Page (Ts.ED repo, docs)

- [x] 3.1 Add the `Benchmarks` component and register it in the theme; add `benchmarksUrl` to the theme config
- [x] 3.2 Add `docs/benchmarks/index.md`
- [x] 3.3 Check the page against the local endpoint: light, dark, phone width, endpoint down

## 4. Verify

- [x] 4.1 `cd tools/benchmarks && yarn test`, `yarn test:lint`, docs build; CMS `yarn test:lint`, `yarn typecheck`, `yarn test`
- [x] 4.2 `openspec validate add-benchmarks-page`
