### Ts.ED DI — JSDoc Coverage Tracker (packages/di/src)

Generated: 2025-11-20

Purpose

- Track documentation coverage for exported symbols in `packages/di/src`.
- Enforce the "symbols only" rule: document only exported symbols (type alias, interface, enum, class, function, exported constant), not their members.
- Status legend:
  - [x] Documented (English JSDoc present and conforms to symbols-only)
  - [~] Partial (basic JSDoc present, needs polish/validation)
  - [ ] Pending (no/insufficient JSDoc)

How to use

- Update this file as you document symbols. Keep statuses in sync.
- Prefer adding per-symbol checklists under each file when possible.
- Validate with `yarn api:build` regularly to catch TSDoc issues.

Rules (symbols only)

- Write JSDoc in English (TSDoc-compatible).
- Document only the exported symbol itself, not its internal members (no interface properties, no class props/methods, no enum members descriptions here).
- Allowed/encouraged tags: `@public`, `@since`, `@deprecated`, `@see`, `@typeParam`.
- **DO NOT use `@example` tag** - the documentation parser does not support it.
- For examples, use markdown headings (### Example, ### Usage, etc.) within the JSDoc description instead.
- Do not change runtime behavior. Minimize diffs and follow the existing code style.

- FR: Documenter uniquement les symboles exportés (classes, fonctions, alias de type, interfaces, enums, constantes exportées). Ne pas documenter leurs membres internes : propriétés/méthodes des classes, propriétés des types/interfaces, membres des enums, etc.
- FR: NE PAS utiliser le tag `@example`. Utiliser des titres markdown (### Exemple, ### Usage) dans la description JSDoc à la place.

Notes

- Index files, tests (`*.spec.ts`) and `__mock__` directories are excluded by request.
- The `@tsed/di` package is organized by platform (browser/node) and common code.
- Initial focus: `interfaces/*`, `domain/*` (core types) and high-impact `services/*`.

---

## Summary table (per file)

Files under `packages/di/src` (excluding index.ts, tests, and **mock** directories), grouped by folder:

#### browser/decorators

- [ ] packages/di/src/browser/decorators/injectContext.ts

#### browser/fn

- [ ] packages/di/src/browser/fn/context.ts
- [ ] packages/di/src/browser/fn/contextLogger.ts

#### browser/utils

- [ ] packages/di/src/browser/utils/asyncHookContext.ts

#### common/constants

- [ ] packages/di/src/common/constants/constants.ts

#### common/decorators

- [ ] packages/di/src/common/decorators/autoInjectable.ts
- [ ] packages/di/src/common/decorators/configuration.ts
- [ ] packages/di/src/common/decorators/constant.ts
- [ ] packages/di/src/common/decorators/controller.ts
- [ ] packages/di/src/common/decorators/inject.ts
- [ ] packages/di/src/common/decorators/injectable.ts
- [ ] packages/di/src/common/decorators/intercept.ts
- [ ] packages/di/src/common/decorators/interceptor.ts
- [ ] packages/di/src/common/decorators/lazyInject.ts
- [ ] packages/di/src/common/decorators/module.ts
- [ ] packages/di/src/common/decorators/opts.ts
- [ ] packages/di/src/common/decorators/overrideProvider.ts
- [ ] packages/di/src/common/decorators/scope.ts
- [ ] packages/di/src/common/decorators/service.ts
- [ ] packages/di/src/common/decorators/useOpts.ts
- [ ] packages/di/src/common/decorators/value.ts

#### common/domain

- [ ] packages/di/src/common/domain/Container.ts
- [ ] packages/di/src/common/domain/ContextLogger.ts
- [ ] packages/di/src/common/domain/ControllerProvider.ts
- [ ] packages/di/src/common/domain/DIContext.ts
- [ ] packages/di/src/common/domain/InjectablePropertyType.ts
- [ ] packages/di/src/common/domain/LocalsContainer.ts
- [ ] packages/di/src/common/domain/Provider.ts
- [ ] packages/di/src/common/domain/ProviderScope.ts
- [ ] packages/di/src/common/domain/ProviderType.ts

#### common/errors

- [ ] packages/di/src/common/errors/InjectionError.ts
- [ ] packages/di/src/common/errors/InvalidPropertyTokenError.ts

#### common/fn

- [ ] packages/di/src/common/fn/configuration.ts
- [ ] packages/di/src/common/fn/constant.ts
- [ ] packages/di/src/common/fn/inject.ts
- [ ] packages/di/src/common/fn/injectMany.ts
- [ ] packages/di/src/common/fn/injectable.ts
- [ ] packages/di/src/common/fn/injector.ts
- [ ] packages/di/src/common/fn/lazyInject.ts
- [ ] packages/di/src/common/fn/localsContainer.ts
- [ ] packages/di/src/common/fn/logger.ts
- [ ] packages/di/src/common/fn/refValue.ts

#### common/interfaces

- [ ] packages/di/src/common/interfaces/AlterRunInContext.ts
- [ ] packages/di/src/common/interfaces/DIConfigurationOptions.ts
- [ ] packages/di/src/common/interfaces/DILogger.ts
- [ ] packages/di/src/common/interfaces/DILoggerOptions.ts
- [ ] packages/di/src/common/interfaces/ImportTokenProviderOpts.ts
- [ ] packages/di/src/common/interfaces/InterceptorContext.ts
- [ ] packages/di/src/common/interfaces/InterceptorMethods.ts
- [ ] packages/di/src/common/interfaces/InvokeOptions.ts
- [ ] packages/di/src/common/interfaces/OnDestroy.ts
- [ ] packages/di/src/common/interfaces/OnInit.ts
- [ ] packages/di/src/common/interfaces/ProviderOpts.ts
- [ ] packages/di/src/common/interfaces/RegistrySettings.ts
- [ ] packages/di/src/common/interfaces/ResolvedInvokeOptions.ts
- [ ] packages/di/src/common/interfaces/TokenProvider.ts
- [ ] packages/di/src/common/interfaces/TokenRoute.ts

#### common/registries

- [ ] packages/di/src/common/registries/GlobalProviders.ts
- [ ] packages/di/src/common/registries/ProviderRegistry.ts

#### common/services

- [ ] packages/di/src/common/services/DIConfiguration.ts
- [ ] packages/di/src/common/services/DILogger.ts
- [ ] packages/di/src/common/services/InjectorService.ts

#### common/utils

- [ ] packages/di/src/common/utils/attachLogger.ts
- [ ] packages/di/src/common/utils/colors.ts
- [ ] packages/di/src/common/utils/createContainer.ts
- [ ] packages/di/src/common/utils/discoverHooks.ts
- [ ] packages/di/src/common/utils/getConfiguration.ts
- [ ] packages/di/src/common/utils/getConstructorDependencies.ts
- [ ] packages/di/src/common/utils/providerBuilder.ts
- [ ] packages/di/src/common/utils/setLoggerConfiguration.ts
- [ ] packages/di/src/common/utils/setLoggerFormat.ts
- [ ] packages/di/src/common/utils/setLoggerLevel.ts

#### node/decorators

- [ ] packages/di/src/node/decorators/injectContext.ts

#### node/fn

- [ ] packages/di/src/node/fn/context.ts
- [ ] packages/di/src/node/fn/contextLogger.ts

#### node/services

- [ ] packages/di/src/node/services/DILogger.ts
- [ ] packages/di/src/node/services/DITest.ts

#### node/utils

- [ ] packages/di/src/node/utils/asyncHookContext.ts

---

## Per-file symbol checklist (detailed)

This section will be expanded as documentation progresses. Each file will list its exported symbols with individual completion status.

### High-priority symbols to document first

Priority order for documentation:

1. **Core Interfaces** (`common/interfaces/*`)

   - Types that define contracts and public APIs
   - Most referenced by other packages

2. **Domain Models** (`common/domain/*`)

   - Core DI concepts: Provider, Container, DIContext
   - Foundation for understanding the DI system

3. **Key Services** (`common/services/*`)

   - InjectorService: main DI orchestrator
   - DIConfiguration: configuration management
   - DILogger: logging abstraction

4. **Main Decorators** (`common/decorators/*`)

   - @Injectable, @Inject, @Service, @Module
   - User-facing API decorators

5. **Utility Functions** (`common/fn/*` and `common/utils/*`)

   - Helper functions for DI operations

6. **Platform-specific** (`browser/*` and `node/*`)
   - Platform-specific implementations

---

## Execution plan

1. Start with interfaces (type definitions) to establish the documentation style
2. Document domain models (Provider, Container, etc.)
3. Document key services (InjectorService, DIConfiguration, DILogger)
4. Document main user-facing decorators
5. Document functional helpers and utilities
6. Document platform-specific implementations
7. Update this tracker after each batch of files
8. Run `yarn api:build` regularly to validate TSDoc compliance

### Next actions

- [ ] Begin with `common/interfaces/*` files
- [ ] Document `common/domain/*` classes
- [ ] Document `common/services/*` classes
- [ ] Continue with decorators and utilities
- [ ] Validate with `yarn api:build` at regular intervals

---

## Statistics

- Total files to document: 88 (excluding index.ts, tests, and **mock** directories)
- Files completed: 0
- Files in progress: 0
- Files pending: 88
- Completion: 0%

---

Last updated: 2025-11-20
