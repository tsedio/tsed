# Design: Temporal SDK 1.13.0 migration for `@tsed/temporal`

## Dependency alignment

- Keep all Temporal SDK packages on the same version, matching Temporal's published guidance.
- Update both dev dependencies and peer dependency ranges in `packages/third-parties/temporal/package.json` so consumers and local tests stay aligned.

## Test harness migration

- The existing client integration test reaches into `@temporalio/core-bridge` to call `getEphemeralServerTarget`.
- Temporal 1.12.0 marked that internal package boundary as unsupported for direct imports.
- The migration should switch to a public way to resolve the ephemeral server address, preferably from `@temporalio/worker` or from the returned ephemeral server object itself.

## Validation strategy

- Reinstall or refresh workspace dependency metadata if the lockfile changes.
- Run the `packages/third-parties/temporal` tests after the bump.
- Treat passing client and worker integration tests as the acceptance gate for the change.
