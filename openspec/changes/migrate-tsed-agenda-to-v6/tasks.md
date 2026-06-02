## 1. Agenda package runtime and typing

- [x] 1.1 Upgrade `packages/third-parties/agenda/package.json` to Agenda v6 dependencies and peer dependency expectations.
- [x] 1.2 Refactor `AgendaService` and `AgendaSettings` to require v6 `backend` configuration while preserving Ts.ED lifecycle flags.
- [x] 1.3 Update decorator-related typings/usages affected by the v6 `define()` signature.

## 2. Validation and tests

- [x] 2.1 Migrate package-scoped unit/integration tests from legacy config and `jobs()` usage to Agenda v6 APIs.
- [x] 2.2 Run focused validation for `@tsed/agenda` and fix resulting issues.

## 3. Agenda documentation

- [x] 3.1 Update `packages/third-parties/agenda/readme.md` with v6 config, migration notes, and `agendash` middleware examples.
- [x] 3.2 Update `docs/tutorials/agenda.md` with the same v6 guidance and AI-oriented migration notes.

## 4. Pulse deprecation guidance

- [x] 4.1 Add deprecation and migration guidance to `packages/third-parties/pulse/readme.md`.
- [x] 4.2 Add deprecation and migration guidance to `docs/tutorials/pulse.md`.
