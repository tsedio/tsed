## Context

- Runs are in `benchmark_runs` / `benchmark_results` (see `publish-benchmarks-to-directus`, tsedio/tsed#3515, tsedio/tsed-cms#6). Today they come from pull requests and manual runs only; the one real comparison is `8.44.1 vs 8.44.12`.
- The website (VitePress, `@tsed/vitepress-theme`) already reads the CMS from the browser: `/rest/warehouse` for the plugins page, `/rest/github/...` through `githubProxyUrl`. These routes live in the `tsed-rest` endpoint extension, read with an `ItemsService` built from the extension context (no accountability, so no public permission on the collections).
- `semantic-release` creates the GitHub release with `GH_TOKEN` (a PAT), so `release: published` triggers other workflows.

## Goals / Non-Goals

**Goals:** a public, cached, minimal payload; a page that reads well without explanation; data refreshed by every release without manual steps.

**Non-Goals:** a history chart on the website (the CMS dashboard has it); linking the page from the nav (later); public access to the collections.

## Decisions

### Release-triggered run with a fixed reference

`on: release: types: [published]` in `benchmark.yml`, skipped when `github.event.release.prerelease`. Targets `8.44.1,${tag#v}`, from a `REFERENCE_VERSION` env at the top of the workflow. A step polls `npm view @tsed/core@<version> version` (up to ~10 min) before measuring, since the release event can arrive before npm propagation. The job checks out the release tag (trusted: created by the release job), and the publish job of `publish-benchmarks-to-directus` publishes it unchanged.

Alternative: dispatch from `build.yml` after `yarn release`, like the website workflow. Rejected: the release event carries the tag and needs no extra token call.

`readGithubContext` maps a `release` event to `{trigger: "release", ref: tag, sha, title: "Release <tag>", runUrl}` (the workflow run, like other runs); `release` is added to the `trigger` choices of `benchmark_runs`.

### Endpoint shape: computed in the CMS, small and cached

`GET /rest/benchmarks` → `BenchmarksService.getLatestComparison()`: reads the latest `benchmark_runs` with `status = success`, `trigger in (release, workflow_dispatch)`, `baseline = 8.44.1`, ordered by `trigger = release` first then `date desc` (two queries: release, then fallback), and its `benchmark_results` (no `raw_results`, no report). It returns the payload of the spec (≈ 3 KB) so the page does no statistics. The reference is a constant of the service shared with the workflow value by convention (documented in both places). `Cache-Control: public, max-age=3600`.

Alternative: expose the collections to the Public policy and query `/items` from the page. Rejected: leaks the raw results and the reports, couples the page to the schema.

### Page: plain HTML/CSS bars in a theme component

`docs/benchmarks/index.md` (`layout: page`) renders `<Benchmarks/>`, registered in `docs/.vitepress/theme/index.ts`, reading `themeConfig.benchmarksUrl` (`https://api.tsed.dev/rest/benchmarks`). Charts are horizontal bars in plain HTML/CSS (a width in %), colors from the VitePress CSS variables (`--vp-c-brand-1`, `--vp-c-text-2`, `--vp-c-default-3`), so dark mode and mobile work without a chart library. A gap is shown as `+12.3% [+9.8; +14.9]`, greyed with "within noise" when not significant, the same wording as the CI report.

## Risks / Trade-offs

- [No release run yet] → the endpoint falls back to a manual `workflow_dispatch` run of `8.44.1,<latest>`; run one by hand after the merge.
- [npm propagation slower than the poll] → the job fails and can be re-run; no partial publish.
- [Absolute req/s on a shared CI runner look low or vary] → the page states they come from one CI machine and only compare within the run, and puts the relative numbers (gap, share of raw) first.
- [The reference value lives in two places] → both are commented; changing it is rare.

## Open Questions

- Should the page be linked from the nav or the home page once a release run exists?
