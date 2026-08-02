## Why

`InjectorService.loadSync()` currently constructs every singleton provider during bootstrap. Large applications often register services that are not needed for every process, so this eager work lengthens startup unnecessarily. An opt-in mode can defer those services while preserving initialization for providers that must subscribe to lifecycle hooks.

## What Changes

- Add a `lazyProviders` configuration option to `DIConfiguration`, defaulting to `false`.
- Register singleton hooks during bootstrap without constructing their providers. When enabled, resolve a synchronous singleton only when it is first used or one of its hooks is emitted.
- Keep the existing eager bootstrap behavior when the option is absent or `false`.
- Add tests for the configuration default, lazy resolution through custom hooks, reentrant invocation hooks, destruction, and backward-compatible eager behavior.

## Capabilities

### New Capabilities

- `lazy-di-providers`: Configures opt-in deferred initialization of synchronous DI singleton providers while retaining lifecycle-hook registration.

### Modified Capabilities

- None.

## Impact

- Affected code: `packages/di/src/common/services/DIConfiguration.ts`, `packages/di/src/common/interfaces/DIConfigurationOptions.ts`, `packages/di/src/common/services/InjectorService.ts`, `packages/di/src/common/domain/Provider.ts`, and DI unit tests.
- API: adds the optional `lazyProviders` configuration field.
- Runtime: can reduce bootstrap work when explicitly enabled; async providers retain their existing bootstrap behavior.
