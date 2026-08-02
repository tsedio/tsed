## Context

Profiling-oriented review of `@tsed/di` highlighted repeated allocation-heavy patterns in core DI runtime methods:

- `Container.getProviders()` rebuilds arrays during reduction (`[...providers, provider]`).
- `InjectorService.get()` performs two cache lookups in common paths.
- `InjectorService.resolveImportsProviders()` chains `filter().map().filter(Boolean)` during bootstrap.
- `InjectorService.invokeToken()` and related helpers create short-lived closures/objects in frequently executed paths.

`InjectorService` behavior is validated by extensive tests (scopes, async factories, hooks, request locals). Any optimization must preserve those semantics.

## Goals / Non-Goals

**Goals:**

- Reduce allocations and CPU overhead in DI hot paths with no externally visible behavior change.
- Keep compatibility with current lifecycle and scope behavior.
- Add tests where optimization could accidentally alter behavior.

**Non-Goals:**

- No API redesign of provider registration or token resolution.
- No change to lifecycle event contracts (`$beforeInvoke`, `$afterInvoke`, `$onDestroy`, etc.).
- No aggressive lazy-loading policy changes in this change set.

## Decisions

1. **Optimize `Container.getProviders()` first**

   - Replace reduction with mutable accumulation (`push`) and avoid repeated array reconstruction.
   - Preserve filtering logic and return type.

2. **Keep `InjectorService` semantics, trim overhead**

   - Refactor cache lookup paths to avoid redundant `Map` access where safe.
   - Flatten small transform pipelines in bootstrap helpers to single-pass loops.
   - Avoid introducing shared mutable state that complicates concurrency.

3. **Do not ship lazy-singleton behavior in this change**

   - `loadSync()` eager singleton instantiation is intentionally kept for compatibility.
   - TODO-backed lazy strategy remains a follow-up change requiring explicit behavior decision.

4. **Guard with behavior-first tests**
   - Re-run and extend targeted tests around:
     - request/singleton/instance scopes,
     - async factory bootstrap semantics,
     - import override behavior through `settings.imports`,
     - lifecycle hook wiring and teardown.

## Risks / Trade-offs

- **[Risk]** Micro-optimizations reduce readability  
  **Mitigation:** keep changes small, local, and covered by tests.

- **[Risk]** Cache-path refactor subtly changes `undefined` handling  
  **Mitigation:** preserve existing checks and add explicit regression assertions.

- **[Risk]** Bootstrap transform refactor changes import override edge-cases  
  **Mitigation:** add focused tests around `resolveImportsProviders()` behavior.

## Migration Plan

1. Implement low-risk container optimization (`getMany`).
2. Implement low-risk `InjectorService` internal loop/cache-path optimizations.
3. Add/adjust tests for regression-sensitive flows.
4. Validate with `cd packages/di && yarn test`.
5. Document deferred high-risk options (lazy singleton bootstrap, invoke-plan caching) in change notes/tasks.
