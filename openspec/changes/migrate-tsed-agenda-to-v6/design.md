## Context

The existing `@tsed/agenda` package mirrors Agenda v5 constructor semantics by forwarding Ts.ED config directly into `new Agenda(opts)`. Agenda v6 requires an explicit backend instance and changes several APIs that are exercised by Ts.ED tests and docs. At the same time, `agendash` now exposes named middleware helpers and `@tsed/pulse` should stop being promoted as an active alternative.

## Goals / Non-Goals

**Goals:**

- Make `@tsed/agenda` compile and run against Agenda v6.
- Expose a v6-only Ts.ED config shape based on `backend`.
- Preserve existing Ts.ED lifecycle hooks and scheduling behavior.
- Align package/tutorial docs with Agenda v6 and the current `agendash` API.
- Convert Pulse docs into deprecation + migration guidance.

**Non-Goals:**

- Keeping v5/v6 dual runtime compatibility in `@tsed/agenda`.
- Refactoring unrelated third-party integrations.
- Removing `@tsed/pulse` package code in this change.

## Decisions

1. **Use a hard cut to Agenda v6 config**

   - Rationale: Ts.ED cannot cleanly infer or support both legacy v5 top-level config and v6 backend config.
   - Approach: require `agenda.backend` when Agenda is enabled and remove top-level Mongo config from typings/docs.

2. **Keep Ts.ED lifecycle flags outside Agenda backend config**

   - Rationale: `enabled`, `disableJobProcessing`, and `drainJobsBeforeClose` are Ts.ED integration concerns, not upstream Agenda backend options.
   - Approach: split Ts.ED-only flags from upstream `AgendaConfig`.

3. **Adopt upstream `agendash` middleware API verbatim**

   - Rationale: upstream now documents `expressMiddleware(agenda)` and an ESM-only package; mirroring it avoids stale docs.
   - Approach: update package/tutorial docs to use named middleware exports and current install commands.

4. **Deprecate Pulse through docs first**

   - Rationale: user guidance is the immediate need; runtime/package removal can be considered separately later.
   - Approach: add deprecation banners plus deterministic migration notes in both Pulse docs entry points.

## Risks / Trade-offs

- **[Risk] Agenda v6 types differ from v5 assumptions** → Mitigation: validate with package-scoped tests and type-check/build.
- **[Risk] Consumers rely on old `agenda` config examples** → Mitigation: add explicit migration diffs in README/tutorial docs.
- **[Risk] Agendash examples drift from upstream again** → Mitigation: copy upstream middleware API shape directly.

## Migration Plan

1. Update `@tsed/agenda` package metadata and config typings for Agenda v6.
2. Refactor `AgendaService` to construct/use Agenda v6 APIs.
3. Update unit and integration tests to v6 query/config APIs.
4. Rewrite Agenda docs with migration notes and current `agendash` snippets.
5. Rewrite Pulse docs as deprecation + migration guides.

Rollback strategy:

- Revert the feature branch or restore the previous `agenda` dependency set if an unrecoverable Agenda v6 runtime/type issue appears during validation.
