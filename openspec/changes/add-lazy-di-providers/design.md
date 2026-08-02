## Context

`InjectorService.load()` resolves asynchronous providers, then calls `loadSync()` to instantiate every remaining singleton. `Provider` already discovers lifecycle methods into its `hooks` map, but those hooks are currently registered only after resolution. Lazy bootstrap needs the hook subscriptions to exist before their provider instance does.

## Goals / Non-Goals

**Goals:**

- Provide an opt-in setting with a `false` default.
- Defer ordinary synchronous singleton construction until first resolution.
- Register hooks for all synchronous singletons before resolving eager providers.
- Resolve a hook-bearing provider only when its hook is emitted.
- Preserve the asynchronous-provider bootstrap path and default behavior.

**Non-Goals:**

- Do not change provider registration, scopes, hook events, or request/instance behavior.
- Do not defer async factories or revise the broader `lazyInject` module-loading feature.
- Do not add automatic dependency-graph analysis beyond normal resolution of an eagerly required provider.

## Decisions

1. **Expose `lazyProviders` on `DIConfiguration`.**
   It is a boolean setting, defaulting to `false`, and is included in the public `TsED.Configuration` declaration. This keeps the feature opt-in and available through the existing configuration API.

2. **Apply the option only in `loadSync()`.**
   `loadAsync()` continues to resolve async providers because the setting concerns the TODO's synchronous singleton bootstrap loop and async initialization has existing ordering semantics.

3. **Register singleton hooks independently from instance resolution.**
   `load()` registers hooks for every singleton after bootstrap has applied imports and configuration overrides, then before asynchronous or synchronous providers are resolved. A hook callback resolves its provider on demand when the instance is absent, so custom hook names receive the same behavior as built-in lifecycle hooks.

4. **Guard reentrant and destroy events.**
   The injector tracks providers currently being invoked. A hook emitted while its own provider is constructing does not trigger a second resolution, matching the prior behavior where hooks were not registered until construction completed. `$onDestroy` does not resolve an absent provider, preventing teardown from constructing unused services.

## Risks / Trade-offs

- **[A hook emitted during its provider's construction recurses]** → Track in-progress providers and skip that self-hook until a subsequent event.
- **[Destroying the injector leaves pre-registered listeners]** → Explicitly unregister all pre-registered singleton hook references during `destroy()`.
- **[A custom event is emitted after shutdown]** → Custom hook event timing remains the application developer's responsibility; `$onDestroy` is explicitly safe for unused providers.
- **[Default bootstrap semantics regress]** → Add an explicit default-mode test alongside lazy-mode coverage.

## Migration Plan

1. Add the optional setting with its false default and type declaration.
2. Pre-register singleton hooks and resolve their providers from hook callbacks only when necessary.
3. Validate configuration and injector behavior with package-scoped tests.
4. Applications can adopt the setting incrementally by configuring `lazyProviders: true`; removing it or setting `false` restores eager bootstrap.
