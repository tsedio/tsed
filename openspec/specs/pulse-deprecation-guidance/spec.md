## ADDED Requirements

### Requirement: Pulse docs deprecation guidance

Ts.ED Pulse docs MUST direct users toward `@tsed/agenda` + Agenda v6.

#### Scenario: Reader opens Pulse package or tutorial docs

- **WHEN** a consumer reads Pulse documentation
- **THEN** the docs clearly state that `@tsed/pulse` is deprecated
- **AND** the docs provide migration notes to `@tsed/agenda` + Agenda v6
- **AND** the docs include explicit before/after rewrites useful for AI-assisted migrations
