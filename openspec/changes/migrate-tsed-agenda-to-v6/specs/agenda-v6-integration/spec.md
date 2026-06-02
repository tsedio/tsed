## ADDED Requirements

### Requirement: Agenda v6 backend configuration

`@tsed/agenda` MUST configure Agenda through an explicit Agenda v6 backend.

#### Scenario: Enabled Agenda uses backend config

- **WHEN** a Ts.ED application enables `@tsed/agenda`
- **THEN** the `agenda` configuration uses a `backend` instance compatible with Agenda v6
- **AND** legacy top-level Mongo config is not documented as supported

### Requirement: Agenda v6 API usage

`@tsed/agenda` MUST use Agenda v6 runtime APIs in its implementation and tests.

#### Scenario: Job definitions register with v6 signature

- **WHEN** Ts.ED registers decorated job handlers
- **THEN** it calls `define(name, processor, options)` semantics compatible with Agenda v6

#### Scenario: Job queries use v6 query API

- **WHEN** tests or examples need to query persisted jobs
- **THEN** they use `queryJobs()` semantics compatible with Agenda v6
