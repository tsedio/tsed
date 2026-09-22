## MODIFIED Requirements

### Requirement: Pulse docs deprecation guidance

Ts.ED Pulse docs MUST direct users toward `@tsed/agenda` + Agenda v6, MUST NOT present `@tsed/pulse` as the primary installation target, and the `@tsed/pulse` package MUST carry a deprecation signal at the package level.

#### Scenario: Reader opens Pulse package or tutorial docs

- **WHEN** a consumer reads Pulse documentation
- **THEN** the docs clearly state that `@tsed/pulse` is deprecated and that new projects must not start on it
- **AND** the primary install commands (npm, yarn, pnpm, bun in the tutorial) install `@tsed/agenda`, `agenda` and `@agendajs/mongo-backend`
- **AND** the docs provide migration notes covering dependencies, configuration, decorators, injection and lifecycle hooks with before/after diffs
- **AND** the docs include explicit deterministic rewrites useful for AI-assisted migrations
- **AND** legacy Pulse usage is presented only in a section explicitly marked as legacy

#### Scenario: Developer imports `@tsed/pulse` in an IDE

- **WHEN** a developer uses an exported symbol of `@tsed/pulse` or the `pulse` configuration key
- **THEN** the symbol is flagged as deprecated through TSDoc with a pointer to `@tsed/agenda`

#### Scenario: Reader browses the documentation site

- **WHEN** a reader opens the docs home page
- **THEN** Pulse is not listed among the promoted integrations
- **AND** the sidebar entry for the Pulse tutorial is labelled as deprecated
