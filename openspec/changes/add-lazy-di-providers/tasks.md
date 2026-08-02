## 1. Configuration and provider metadata

- [x] 1.1 Add the false-by-default `lazyProviders` setting to `DIConfiguration` and the public configuration type.
- [x] 1.2 Add a provider-level predicate that reports whether lifecycle hooks are registered.

## 2. Lazy bootstrap behavior

- [x] 2.1 Gate synchronous singleton bootstrap in `InjectorService.loadSync()` with the new setting and hook predicate.
- [x] 2.2 Retain the existing asynchronous provider bootstrap behavior.

## 3. Regression coverage

- [x] 3.1 Add configuration coverage for the default and enabled setting.
- [x] 3.2 Add injector coverage for eager default behavior, lazy ordinary providers, hook-bearing providers, and async providers.
- [x] 3.3 Run the package DI test suite and OpenSpec validation.
