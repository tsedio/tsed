## Why

`DIConfiguration` exposes its behavior through several configuration access and lifecycle methods, but most of those methods lack API-level explanations. Completing their documentation makes the service easier to use and maintain without changing its runtime behavior.

## What Changes

- Add English TSDoc documentation to every `DIConfiguration` method, including parameter and return-value semantics where relevant.
- Preserve the current public API and runtime behavior.

## Capabilities

### New Capabilities

- `di-configuration-method-documentation`: Complete method-level API documentation for the DI configuration service.

### Modified Capabilities

- None.

## Impact

- Affected code: `packages/di/src/common/services/DIConfiguration.ts`.
- Affected documentation validation: API documentation generation.
- No API, dependency, or runtime behavior changes.
