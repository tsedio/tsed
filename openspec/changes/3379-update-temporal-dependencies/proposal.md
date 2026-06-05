# Proposal: Update `@tsed/temporal` to Temporal SDK 1.13.0

## Discovery Notes

- `openspec/project.md` is not present in the workspace, so no project-level charter was available to review.
- `@tsed/temporal` currently pins `@temporalio/client`, `@temporalio/testing`, and `@temporalio/worker` to `1.11.6`.
- Temporal 1.12.0 tightened access to `@temporalio/core-bridge` internals, and this package still imports `getEphemeralServerTarget` from that internal package in an integration test.

## Problem Statement

The Ts.ED Temporal integration is behind the currently published Temporal TypeScript SDK. Keeping it on `1.11.6` increases dependency drift and leaves the package exposed to a known test harness break introduced by newer Temporal releases.

## Goals

- Upgrade `@tsed/temporal` to Temporal SDK `1.13.0` across dev and peer dependencies.
- Remove direct test-time reliance on `@temporalio/core-bridge`.
- Revalidate the package integration tests against the upgraded SDK.

## Non-Goals

- Expanding the public Ts.ED Temporal API beyond compatibility fixes required for this upgrade.
- Introducing broader Temporal feature support that is unrelated to the dependency bump.

## Proposed Approach (High Level)

- Update `packages/third-parties/temporal/package.json` to use `1.13.0` for Temporal SDK packages and align peer ranges.
- Refactor the client integration test to obtain the ephemeral server target through supported public APIs instead of `@temporalio/core-bridge`.
- Run the package-scoped Temporal tests and adjust any package docs or code paths only if the upgraded SDK requires it.

## Risks & Unknowns

- Temporal changed parts of its testing/runtime surface between `1.11.6` and `1.13.0`; some test helpers may need small API adjustments.
- The exact public replacement for `getEphemeralServerTarget` depends on what the installed SDK exposes in `@temporalio/worker` and `@temporalio/testing`.

## Success Measures

- `@tsed/temporal` depends on Temporal SDK `1.13.0` consistently.
- No source or test file in `packages/third-parties/temporal` imports `@temporalio/core-bridge`.
- The package test suite passes after the migration.
