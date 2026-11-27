## Decisions

- **Filter on read, keep storing.** The Directus dashboard (`benchmark-tracking`) relies on pull request and branch runs. Only the two public endpoints used by tsed.dev are restricted.
- **`git_ref`, not the run URL or the sha.** The publish command already stores `GITHUB_REF_NAME` as `git_ref` for manual runs (the branch) and the tag for release runs, so the filter is one Directus condition: `trigger = release` OR (`trigger = workflow_dispatch` AND `git_ref = production`).
- **Default branch as a constant** (`DEFAULT_BRANCH = "production"`) next to `REFERENCE_VERSION` in `BenchmarksService`.
- **Re-measure instead of patching data.** The existing 8.44.x run is kept untouched (create-only token, auditable); a new manual run from `production` replaces its points.

## Risks

- Until the new manual run lands, the history only shows `8.44.1`, `8.45.1` and `8.45.2`.
