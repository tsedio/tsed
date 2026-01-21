# di-jsdoc-tracker Specification

## Purpose

Define the Ts.ED DI JSDoc tracker requirements so contributors understand scope, coverage snapshots, priorities, and validation workflow for `packages/di/src`.

## Requirements

### Requirement: Define the DI documentation scope and rules

The tracker SHALL spell out what is in scope, what is excluded, and any special linting guidance.

#### Scenario: Tracker reiterates symbol-only guidance and linting caveats

- **GIVEN** the tracker for `packages/di/src`
- **WHEN** contributors read the introduction
- **THEN** it explains that the goal is to document exported symbols only, that browser/node/common segments each have their own folders, explicitly forbids the `@example` tag (recommending Markdown headings instead), repeats the English/French reminders about symbol-only docs, and calls out that index files, tests, and `__mock__` directories are excluded

### Requirement: Surface coverage status across every DI folder

Maintainers SHALL rely on per-folder coverage snapshots to understand where documentation work remains.

#### Scenario: Browser, common, and node sections list file-by-file progress

- **GIVEN** the summary tables inside the tracker
- **WHEN** maintainers review them
- **THEN** they see grouped sections such as `browser/decorators`, `browser/fn`, `browser/utils`, `common/decorators`, `common/domain`, `common/interfaces`, `common/utils`, `common/registries`, `node/services`, etc., and each listed file includes a `[x]/[~]/[ ]` status so outstanding work is obvious

### Requirement: Prioritized backlog focuses contributors on the highest impact areas

The tracker SHALL keep a ranked backlog so new contributors know which DI categories to attack first.

#### Scenario: Tracker orders work by category

- **GIVEN** the "High-priority symbols" section
- **WHEN** contributors read it
- **THEN** it ranks the workstream (core interfaces ➜ domain models ➜ key services ➜ decorators ➜ helper functions ➜ platform-specific code) and explains why each tier matters (e.g., interfaces define contracts, InjectorService/DILogger are user-facing APIs)

### Requirement: Execution plan and next actions stay actionable

Step-by-step execution guidance SHALL remain documented so the workflow stays consistent.

#### Scenario: Tracker lists sequential steps and validation guidance

- **GIVEN** the execution plan portion of the tracker
- **WHEN** someone needs to continue the sweep
- **THEN** it outlines the step-by-step approach (start with interfaces, move through domain, services, decorators, utilities, platform code) and reminds contributors to run `yarn api:build` regularly, while the "Next actions" checklist highlights the immediate TODOs

### Requirement: Statistics communicate overall progress

Aggregated counts and percentages SHALL ensure stakeholders can gauge DI documentation momentum at a glance.

#### Scenario: Tracker reports counts and completion percentages

- **GIVEN** the statistics section
- **WHEN** maintainers consult it
- **THEN** it includes totals (e.g., number of files tracked, complete, pending, percentage) plus per-category breakdowns, distinguishing between fully complete categories (decorators, domain, services, fn) and those still in progress
