---
name: migrate-tsed-functional-api
description: Migrate Ts.ED files from decorators to functional APIs for files passed in context, then run package typechecking and associated tests.
---

# Migrate Ts.ED Functional API

Use this skill when the user asks to migrate one or more Ts.ED files from decorator APIs to functional APIs.

## Input

- Target files must be explicitly provided by the user or present in context.
- Migrate only requested files, except when a directly related test must be updated.

## Migration workflow

1. Read the target file(s) and identify current decorator usage:

- `@Module`, `@Interceptor`, `@Inject`, `@Configuration`, `@Constant` (and related imports).

2. Apply functional API replacements:

- `@Inject()` -> `inject(Token)` field initialization.
- `@Configuration()` access -> `constant("path")` for reads; use `configuration()` only when mutable APIs are needed.
- `@Constant(path, default)` -> `constant(path, default)` field initialization.
- `@Module()` -> register with `injectable(Class).type(ProviderType.MODULE).scope(ProviderScope.SINGLETON)`.
- `@Interceptor()` -> register with `interceptor(Class)`.

3. Prefer helper functions when equivalent behavior is expected:

- `injector.emit(...)` -> `$asyncEmit(event, [args...])`.
- If requested by the user/team style, replace injected `Logger` with `logger()` direct calls.

4. Keep runtime behavior unchanged:

- Preserve business logic, hook names, payload shape, and thresholds/TTL semantics.
- Only refactor style (decorator -> functional API), not behavior.

5. Clean imports:

- Remove obsolete decorator imports.
- Add minimal required functional imports from `@tsed/di` and `@tsed/hooks`.

## Required validation after each migration

Run both checks for every touched package:

1. Typecheck

- Find nearest package root (`packages/**/package.json`) for changed file(s).
- Run in package root:
  - `yarn build:ts` when available,
  - otherwise `yarn build`,
  - fallback to workspace-level build only if package scripts are missing.

2. Associated tests

- Run test files tied to migrated file(s), prioritizing targeted specs:
  - `Foo.ts` -> `Foo.spec.ts`
  - Companion behavior specs (interceptor/service pairs) when impacted.
- Preferred command form:
  - `yarn vitest <spec-file-1> <spec-file-2>`
  - fallback to package `yarn test` if targeted specs cannot be determined.

If tests fail only due to refactor side effects (for example spies on removed injected fields), update tests to assert equivalent runtime behavior and rerun.

## Output

Return a concise summary:

- Files migrated.
- Functional API transformations applied.
- Typecheck command(s) + result.
- Test command(s) + result.
- Remaining risk if any validation could not run.
