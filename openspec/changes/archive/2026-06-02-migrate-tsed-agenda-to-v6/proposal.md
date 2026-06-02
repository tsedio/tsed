## Why

`@tsed/agenda` is still built and documented around Agenda v5 concepts, while upstream Agenda v6 introduces a mandatory backend abstraction, a reordered `define()` signature, and `queryJobs()` in place of `jobs()`. Ts.ED docs also still present stale `agendash` usage and continue to promote `@tsed/pulse` without a deprecation path.

## What Changes

- Migrate `@tsed/agenda` runtime, typings, tests, and docs to Agenda v6.
- Replace legacy top-level Agenda Mongo config with explicit `backend` configuration based on `@agendajs/mongo-backend`.
- Update `agendash` examples to the current upstream middleware API.
- Deprecate `@tsed/pulse` in docs and redirect users to `@tsed/agenda` + Agenda v6 with migration notes.
- **BREAKING**: `@tsed/agenda` no longer accepts legacy top-level `db` / `mongo` / `repository` configuration.

## Capabilities

### New Capabilities

- `agenda-v6-integration`: Ensures `@tsed/agenda` uses Agenda v6 backend-based configuration and APIs.
- `pulse-deprecation-guidance`: Ensures `@tsed/pulse` documentation clearly redirects consumers to `@tsed/agenda` + Agenda v6.

### Modified Capabilities

<!-- none -->

## Impact

- Affected code: `packages/third-parties/agenda`, `docs/tutorials/agenda.md`, `packages/third-parties/pulse/readme.md`, `docs/tutorials/pulse.md`.
- APIs: package-level breaking change for `@tsed/agenda` configuration.
- Dependencies/tooling: add `@agendajs/mongo-backend`, align `agendash` examples with its ESM middleware API.
