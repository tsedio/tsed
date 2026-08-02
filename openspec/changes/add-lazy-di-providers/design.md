## Context

`InjectorService.load()` resolves asynchronous providers, then calls `loadSync()` to instantiate every remaining singleton. `Provider` already discovers lifecycle methods into its `hooks` map, and hooks are registered when the provider is resolved. The existing TODO identifies this hook metadata as the safe eager subset for a lazy bootstrap mode.

## Goals / Non-Goals

**Goals:**

- Provide an opt-in setting with a `false` default.
- Defer ordinary synchronous singleton construction until first resolution.
- Preserve eager construction for synchronous singleton providers with discovered lifecycle hooks so they can subscribe before lifecycle events are emitted.
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

3. **Use provider hook metadata as the eager criterion.**
   Add `Provider.hasRegisteredHooks()` to express whether `discoverHooks()` or explicit provider configuration has produced hook callbacks. In lazy mode `loadSync()` resolves an uncached singleton only when this method returns `true`.

4. **Preserve ordinary resolution behavior.**
   No separate lazy cache is needed: a deferred provider is built by the existing `resolve()` path when it is requested, including when it is a dependency of a hook-bearing provider.

## Risks / Trade-offs

- **[A deferred provider is first resolved after a lifecycle event]** → The option is explicitly opt-in; providers that need bootstrap lifecycle participation must declare a hook and are initialized before `$onInit`.
- **[A custom provider supplies hook metadata directly]** → `hasRegisteredHooks()` inspects the effective `hooks` map, rather than relying on class reflection alone.
- **[Default bootstrap semantics regress]** → Add an explicit default-mode test alongside lazy-mode coverage.

## Migration Plan

1. Add the optional setting with its false default and type declaration.
2. Add the provider hook predicate and gate synchronous bootstrap with it when configured.
3. Validate configuration and injector behavior with package-scoped tests.
4. Applications can adopt the setting incrementally by configuring `lazyProviders: true`; removing it or setting `false` restores eager bootstrap.
