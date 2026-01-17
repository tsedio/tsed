### Ts.ED DI — JSDoc Coverage Tracker (packages/di/src)

Generated: 2025-11-20

Purpose

- Track documentation coverage for exported symbols in `packages/di/src`.
- Enforce the "symbols only" rule: document only exported symbols (type alias, interface, enum, class, function,
  exported constant), not their members.
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
- Document only the exported symbol itself, not its internal members (no interface properties, no class props/methods,
  no enum members descriptions here).
- Allowed/encouraged tags: `@public`, `@since`, `@deprecated`, `@see`, `@typeParam`.
- **DO NOT use `@example` tag** - the documentation parser does not support it.
- For examples, use markdown headings (### Example, ### Usage, etc.) within the JSDoc description instead.
- Do not change runtime behavior. Minimize diffs and follow the existing code style.

- FR: Documenter uniquement les symboles exportés (classes, fonctions, alias de type, interfaces, enums, constantes
  exportées). Ne pas documenter leurs membres internes : propriétés/méthodes des classes, propriétés des
  types/interfaces, membres des enums, etc.
- FR: NE PAS utiliser le tag `@example`. Utiliser des titres markdown (### Exemple, ### Usage) dans la description JSDoc
  à la place.

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

- [x] packages/di/src/common/decorators/autoInjectable.ts
- [x] packages/di/src/common/decorators/configuration.ts
- [x] packages/di/src/common/decorators/constant.ts
- [x] packages/di/src/common/decorators/controller.ts
- [x] packages/di/src/common/decorators/inject.ts
- [x] packages/di/src/common/decorators/injectable.ts
- [x] packages/di/src/common/decorators/intercept.ts
- [x] packages/di/src/common/decorators/interceptor.ts
- [x] packages/di/src/common/decorators/lazyInject.ts
- [x] packages/di/src/common/decorators/module.ts
- [x] packages/di/src/common/decorators/opts.ts
- [x] packages/di/src/common/decorators/overrideProvider.ts
- [x] packages/di/src/common/decorators/scope.ts
- [x] packages/di/src/common/decorators/service.ts
- [x] packages/di/src/common/decorators/useOpts.ts
- [x] packages/di/src/common/decorators/value.ts

#### common/domain

- [x] packages/di/src/common/domain/Container.ts
- [x] packages/di/src/common/domain/ContextLogger.ts
- [x] packages/di/src/common/domain/ControllerProvider.ts
- [x] packages/di/src/common/domain/DIContext.ts
- [x] packages/di/src/common/domain/InjectablePropertyType.ts
- [x] packages/di/src/common/domain/LocalsContainer.ts
- [x] packages/di/src/common/domain/Provider.ts
- [x] packages/di/src/common/domain/ProviderScope.ts
- [x] packages/di/src/common/domain/ProviderType.ts

#### common/errors

- [x] packages/di/src/common/errors/InjectionError.ts
- [x] packages/di/src/common/errors/InvalidPropertyTokenError.ts

#### common/fn

- [x] packages/di/src/common/fn/configuration.ts
- [x] packages/di/src/common/fn/constant.ts
- [x] packages/di/src/common/fn/inject.ts
- [x] packages/di/src/common/fn/injectMany.ts
- [x] packages/di/src/common/fn/injectable.ts
- [x] packages/di/src/common/fn/injector.ts
- [x] packages/di/src/common/fn/lazyInject.ts
- [x] packages/di/src/common/fn/localsContainer.ts
- [x] packages/di/src/common/fn/logger.ts
- [x] packages/di/src/common/fn/refValue.ts

#### common/interfaces

- [x] packages/di/src/common/interfaces/AlterRunInContext.ts
- [ ] packages/di/src/common/interfaces/DIConfigurationOptions.ts
- [x] packages/di/src/common/interfaces/DILogger.ts
- [x] packages/di/src/common/interfaces/DILoggerOptions.ts
- [x] packages/di/src/common/interfaces/ImportTokenProviderOpts.ts
- [x] packages/di/src/common/interfaces/InterceptorContext.ts
- [x] packages/di/src/common/interfaces/InterceptorMethods.ts
- [x] packages/di/src/common/interfaces/InvokeOptions.ts
- [x] packages/di/src/common/interfaces/OnDestroy.ts
- [x] packages/di/src/common/interfaces/OnInit.ts
- [x] packages/di/src/common/interfaces/ProviderOpts.ts
- [ ] packages/di/src/common/interfaces/RegistrySettings.ts
- [x] packages/di/src/common/interfaces/ResolvedInvokeOptions.ts
- [x] packages/di/src/common/interfaces/TokenProvider.ts
- [x] packages/di/src/common/interfaces/TokenRoute.ts

#### common/registries

- [ ] packages/di/src/common/registries/GlobalProviders.ts
- [ ] packages/di/src/common/registries/ProviderRegistry.ts

#### common/services

- [x] packages/di/src/common/services/DIConfiguration.ts
- [x] packages/di/src/common/services/DILogger.ts
- [x] packages/di/src/common/services/InjectorService.ts

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

This section will be expanded as documentation progresses. Each file will list its exported symbols with individual
completion status.

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
- Files completed: 58
- Files in progress: 0
- Files pending: 30
- Completion: 66%

### Progress breakdown

- ✅ Interfaces: 13/15 (87%)
- ✅ Domain models: 9/9 (100%)
- ✅ Error classes: 2/2 (100%)
- ✅ Services: 3/3 (100%) + InjectorService methods documented
- ✅ Functions (fn): 10/10 (100%)
- ✅ Decorators: 16/16 (100%)
- ⏳ Utils: 0/10 (0%)
- ⏳ Registries: 0/2 (0%)
- ⏳ Constants: 0/1 (0%)
- ⏳ Platform-specific: 0/8 (0%)

---

Last updated: 2025-11-20 23:05
