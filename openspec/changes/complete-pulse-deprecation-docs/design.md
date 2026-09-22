## Context

`@tsed/pulse` is superseded by `@tsed/agenda` on Agenda v6. The first deprecation pass only covered part of the docs, so users still receive install commands for Pulse and coding agents lack a complete rewrite table. `AgendaModule` no longer exists in `@tsed/agenda` (consumers inject `Agenda` from `agenda`), so the migration examples suggested in the issue must be adapted to the current API.

## Goals / Non-Goals

**Goals:**

- Make both Pulse docs entry points self-sufficient deprecation + migration guides.
- Give IDEs and npm a deprecation signal without changing runtime behavior.
- Stop promoting Pulse from discovery surfaces (home page, sidebar label).

**Non-Goals:**

- Removing the `@tsed/pulse` package or its tests.
- Running `npm deprecate` (a publish-time operation handled by maintainers).
- Changing `@tsed/agenda` behavior.

## Decisions

- Keep legacy Pulse examples, but move them under a clearly labelled "Legacy usage (existing projects only)" section after the migration guide, so the reading order is deprecation → replacement → migration → legacy reference.
- Document migration targets against the actual `@tsed/agenda` API: `@JobsController`, `Agenda` from `agenda`, `$beforeAgendaStart` / `$afterAgendaStart`, `queryJobs()`. Do not mention `AgendaModule`, which was removed.
- Use `@deprecated` TSDoc on every exported symbol rather than a runtime warning, to avoid noisy logs for existing consumers.
- Keep the tutorial page reachable from the sidebar (labelled deprecated) so existing users can find the migration guide, but remove the home page card that promotes new adoption.

## Risks / Trade-offs

- [Docs drift between README and tutorial] → Both files share the same migration content, adapted only for GitHub alerts vs VitePress containers.
- [Broken anchors] → GitHub slug `#migrate-to-tsedagenda` and VitePress slug `#migrate-to-tsed-agenda` are used respectively.
