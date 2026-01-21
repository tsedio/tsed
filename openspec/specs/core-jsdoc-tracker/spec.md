# core-jsdoc-tracker Specification

## Purpose

Provide the canonical charter for the Ts.ED Core JSDoc tracker covering `packages/core/src`, including guardrails, summaries, checklists, and execution guidance.

## Requirements

### Requirement: Capture the Ts.ED Core JSDoc charter and guardrails

The tracker SHALL restate why the Core sweep exists and the symbol-only guardrails authors must follow.

#### Scenario: Purpose statement and symbol-only rules are visible

- **GIVEN** the tracker for `packages/core/src`
- **WHEN** contributors open the document
- **THEN** it states the intent to cover exported symbols only (type aliases, interfaces, enums, classes, functions, exported constants), lists the `[x]/[~]/[ ]` legend, repeats the English/French reminders about symbol-only documentation, and instructs authors to validate updates with `yarn api:build`

### Requirement: Summaries show folder-level coverage across Core

Folder-level summaries SHALL keep progress visible across the decorators, errors, types, and utils trees.

#### Scenario: Decorators, errors, types, and utils are grouped

- **GIVEN** the tracker
- **WHEN** it renders the summary table
- **THEN** it groups files under `decorators`, `errors`, `types`, and `utils` (including nested folders such as `utils/http`), and every file under those folders is listed with its current `[x]/[~]/[ ]` status so maintainers can see surface-area progress at a glance

### Requirement: Per-symbol checklists highlight outstanding work

Granular symbol checklists SHALL ensure partially completed files have actionable follow-ups.

#### Scenario: DecoratorParameters and similar files expose symbol tasks

- **GIVEN** files that still have open work (e.g., `packages/core/src/types/DecoratorParameters.ts`)
- **WHEN** the tracker drills into their exported symbols
- **THEN** it lists each symbol with a checkbox, including partially-complete ones such as `StaticMethodDecorator`, while keeping completed items checked so momentum stays visible

### Requirement: Execution plan and priorities guide the next batch

The tracker SHALL include a standing backlog so contributors know the next Core files to document.

#### Scenario: Prioritized backlog stays attached to the tracker

- **GIVEN** the execution plan portion of the tracker
- **WHEN** maintainers consult it
- **THEN** it reiterates the work cycle (review completed files, continue documentation, update tracker, run `yarn api:build`) and lists the priority backlog (e.g., `createInstance.ts`, `getConstructorArgNames.ts`, `isClass.ts`, `isCollection.ts`, `types/Store.ts`, `types/Metadata.ts`) so the next contributors know exactly where to focus
