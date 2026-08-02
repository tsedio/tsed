## ADDED Requirements

### Requirement: Opt-in lazy synchronous provider bootstrap

The DI configuration SHALL expose a `lazyProviders` boolean option whose default value is `false`. During bootstrap, the injector SHALL register hooks for every synchronous singleton without requiring an instance. When `lazyProviders` is `true`, the injector SHALL defer construction of every uncached synchronous singleton until it is first resolved directly or by a hook event.

#### Scenario: Default configuration preserves eager bootstrap

- **WHEN** an application loads the injector without enabling `lazyProviders`
- **THEN** every uncached synchronous singleton provider is constructed during `loadSync()`.

#### Scenario: Lazy configuration defers singleton construction

- **WHEN** an application loads the injector with `lazyProviders` enabled and a synchronous singleton is uncached
- **THEN** the injector does not construct that provider during `loadSync()` and constructs it when the provider is first resolved.

#### Scenario: Custom hook resolves a lazy singleton

- **WHEN** an application loads the injector with `lazyProviders` enabled, an uncached synchronous singleton defines a custom hook, and that hook is emitted
- **THEN** the injector resolves the provider and invokes the custom hook with the resolved instance.

#### Scenario: Provider hook emitted during its own construction

- **WHEN** a hook is emitted while its lazy provider is being constructed
- **THEN** the injector does not recursively resolve that provider.

#### Scenario: Destroying an unused lazy singleton

- **WHEN** `$onDestroy` is emitted for a lazy singleton that has not been resolved
- **THEN** the injector does not construct the singleton or invoke its destroy hook.

### Requirement: Async bootstrap behavior remains eager

The lazy-provider setting SHALL NOT change initialization of asynchronous providers during `loadAsync()`.

#### Scenario: Async provider with lazy configuration

- **WHEN** an application loads the injector with `lazyProviders` enabled and an async provider is registered
- **THEN** the injector resolves the async provider during the asynchronous bootstrap stage.
