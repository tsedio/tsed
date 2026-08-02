## ADDED Requirements

### Requirement: Opt-in lazy synchronous provider bootstrap

The DI configuration SHALL expose a `lazyProviders` boolean option whose default value is `false`. When it is `true`, the injector SHALL defer construction of uncached synchronous singleton providers during bootstrap unless the provider has registered lifecycle hooks.

#### Scenario: Default configuration preserves eager bootstrap

- **WHEN** an application loads the injector without enabling `lazyProviders`
- **THEN** every uncached synchronous singleton provider is constructed during `loadSync()`.

#### Scenario: Lazy configuration defers ordinary singleton construction

- **WHEN** an application loads the injector with `lazyProviders` enabled and an uncached synchronous singleton has no registered hooks
- **THEN** the injector does not construct that provider during `loadSync()` and constructs it when the provider is first resolved.

#### Scenario: Lazy configuration initializes hook-bearing singletons

- **WHEN** an application loads the injector with `lazyProviders` enabled and an uncached synchronous singleton has registered lifecycle hooks
- **THEN** the injector constructs the provider during `loadSync()` so its hooks are registered before subsequent lifecycle events.

### Requirement: Async bootstrap behavior remains eager

The lazy-provider setting SHALL NOT change initialization of asynchronous providers during `loadAsync()`.

#### Scenario: Async provider with lazy configuration

- **WHEN** an application loads the injector with `lazyProviders` enabled and an async provider is registered
- **THEN** the injector resolves the async provider during the asynchronous bootstrap stage.
