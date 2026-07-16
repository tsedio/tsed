## 1. Toolchain Upgrade & Baseline

- [x] 1.1 Upgrade TypeScript to v6 in workspace dependencies and align directly coupled tooling/configuration.
- [x] 1.2 Update root TypeScript config/project references to reflect TypeScript 6 strict compilation behavior.
- [x] 1.3 Run workspace type-check/build to capture the initial TS6 diagnostic baseline.
- [x] 1.4 Publish a temporary migration dashboard with diagnostic counts by package/category and owner.

## 2. Core and Shared Package Remediation

- [x] 2.1 Fix TS6 strict diagnostics in foundational packages (core, di, config, hooks, engines, shared utils).
- [x] 2.2 Validate remediated foundational packages with package-scoped tests/type-check commands.
- [x] 2.3 Update the migration dashboard with remaining diagnostics after foundational fixes.

## 3. Feature Package Remediation by Batch

- [x] 3.1 Fix TS6 diagnostics in platform packages (platform-\*), then run scoped validation.
- [x] 3.2 Fix TS6 diagnostics in specs packages, then run scoped validation.
- [x] 3.3 Fix TS6 diagnostics in orm packages, then run scoped validation.
- [x] 3.4 Fix TS6 diagnostics in graphql/security packages, then run scoped validation.
- [x] 3.5 Fix TS6 diagnostics in third-parties/utils packages, then run scoped validation.
- [x] 3.6 Refresh dashboard counts and ownership after each batch.

## 4. CI Enforcement and Release Readiness

- [x] 4.1 Update CI pipelines to enforce TS6 compile checks as merge gates.
- [x] 4.2 Run full workspace validation (`build`, `test`, `lint`) on TS6 and resolve remaining issues.
- [x] 4.3 Document all public type-surface breaking changes and migration notes for release communication.
- [x] 4.4 Remove/decommission the temporary migration dashboard once TS6 diagnostics reach zero and migration work is complete.
