## 1. Configuration and provider metadata

- [x] 1.1 Add the false-by-default `lazyProviders` setting to `DIConfiguration` and the public configuration type.
- [x] 1.2 Remove the provider-level hook predicate; bootstrap hooks are registered independently of provider construction.

## 2. Lazy bootstrap behavior

- [x] 2.1 Register all singleton hooks after bootstrap and before asynchronous or synchronous construction, then gate only synchronous singleton construction with `lazyProviders`.
- [x] 2.2 Retain asynchronous provider construction during bootstrap after hook pre-registration.
- [x] 2.3 Resolve providers without registering singleton hooks outside the bootstrap phases.

## 3. Regression coverage

- [x] 3.1 Add configuration coverage for the default and enabled setting.
- [x] 3.2 Add injector coverage for eager default behavior, lazy ordinary providers, custom hook resolution, reentrant hooks, destruction, and async providers.
- [x] 3.4 Expand the lazy-hook regression matrix for discovered hooks, cached providers, multiple listeners, alter hooks, request scope, and listener cleanup.
- [x] 3.3 Run the package DI test suite and OpenSpec validation.
