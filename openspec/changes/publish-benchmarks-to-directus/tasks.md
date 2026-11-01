## 1. CMS data model (tsed-api-directus, own worktree and branch)

- [x] 1.1 Create `benchmark_runs` and `benchmark_results` (fields, m2o `run` with cascade, o2m alias `results`) on the local Directus
- [x] 1.2 Merge only the new collections, fields and relation into `snapshots/snapshot-latest.yaml` (leave unrelated local schema changes out)
- [x] 1.3 Create the `Benchmark publisher` policy with `create` on both collections, add it to `migrations/data` and `imports/data`, rename the update-all migration so it runs again, add it to `PROJECT_POLICIES`
- [x] 1.4 Regenerate `DirectusSchema.d.ts`
- [x] 1.5 Check with a user that only has the policy: nested create works, read/update/delete answer 403

## 2. Publish command (Ts.ED repo)

- [x] 2.1 Add `tools/benchmarks/src/publish.mjs`: `toDirectusRun`, `readGithubContext`, CLI
- [x] 2.2 Add a trimmed fixture from a real CI run and `test/publish.spec.mjs` covering the spec scenarios (rows count, gaps, NaN bounds, raw share, no token, HTTP error)
- [x] 2.3 Add the `bench:publish` script (package and root), document it in `tools/benchmarks/readme.md`
- [x] 2.4 Publish the downloaded CI results to the local Directus and check the rows

## 3. Workflow

- [x] 3.1 Add the `publish` job to `.github/workflows/benchmark.yml` (needs, always, trusted sparse checkout, artifact download, secret, URL variable)
- [x] 3.2 Validate the workflow (YAML parsed; actionlint not installed)

## 4. Dashboard

- [x] 4.1 Build the **Benchmarks** dashboard on the local Directus with the published data
- [x] 4.2 Export it to `imports/data/directus-dashboards/` and check `16-import-dashboards.ts` installs it
- [x] 4.3 Document the collections, the CI user and the dashboard in the CMS README

## 5. Verify

- [x] 5.1 `cd tools/benchmarks && yarn test`, `yarn test:lint` (Ts.ED), `yarn test:lint` and `yarn typecheck` (CMS)
- [x] 5.2 `openspec validate publish-benchmarks-to-directus`
