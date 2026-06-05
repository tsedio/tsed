## ADDED Requirements

### Requirement: `@tsed/temporal` tracks the supported Temporal SDK line

`@tsed/temporal` MUST keep its Temporal SDK dependencies aligned on a supported published release and avoid direct imports from Temporal internal packages.

#### Scenario: Package metadata aligns Temporal SDK versions

- Given `packages/third-parties/temporal/package.json`
- When the Temporal SDK version is updated
- Then `@temporalio/client`, `@temporalio/testing`, and `@temporalio/worker` use the same `1.13.0` version in local development
- And the peer dependency ranges for supported consumer installs are updated to the corresponding `^1.13.0` line

#### Scenario: Integration tests use only public Temporal APIs

- Given the `@tsed/temporal` integration tests
- When the Temporal SDK is upgraded to `1.13.0`
- Then no test under `packages/third-parties/temporal` imports `@temporalio/core-bridge`
- And the client integration test resolves its ephemeral server target through a supported public API

#### Scenario: Temporal package tests validate the upgrade

- Given the migrated `@tsed/temporal` package
- When the package-scoped test suite is executed
- Then the worker and client integration flows pass against Temporal SDK `1.13.0`
