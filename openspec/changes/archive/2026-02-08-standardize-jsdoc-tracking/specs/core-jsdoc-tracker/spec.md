## ADDED Requirements

### Requirement: Capture the Ts.ED Core JSDoc charter and guardrails

The tracker SHALL restate why the Core sweep exists and the symbol-only guardrails authors need to follow.

#### Scenario: Purpose statement and symbol-only rules are visible

- Given the tracker for `packages/core/src`
- When contributors open the document
- Then it states the intent to cover exported symbols only (type aliases, interfaces, enums, classes, functions, exported constants)
- And it lists the status legend (`[x] documented`, `[~] partial`, `[ ] pending`) plus the English/French reminders that only symbol-level docs are allowed
- And it reminds authors to validate updates with `yarn api:build`

### Requirement: Summaries show folder-level coverage across Core

Folder-level summaries SHALL keep progress visible across the decorators, errors, types, and utils trees.

#### Scenario: Decorators, errors, types, and utils are grouped

- Given the same tracker
- When it renders the summary table
- Then it groups files under `decorators`, `errors`, `types`, and `utils` (including nested folders such as `utils/http`)
- And every file under those folders is listed with its current `[x]/[~]/[ ]` status so maintainers can see surface-area progress at a glance

### Requirement: Per-symbol checklists highlight outstanding work

Granular symbol checklists SHALL ensure partially completed files (like `DecoratorParameters`) have actionable follow-ups.

#### Scenario: DecoratorParameters and similar files expose symbol tasks

- Given files that still have open work (e.g., `packages/core/src/types/DecoratorParameters.ts`)
- When the tracker drills into their exported symbols
- Then it lists each symbol with a checkbox, including partially-complete ones such as `StaticMethodDecorator`
- And it keeps completed items (e.g., `DecoratorParameters`, `DecoratorMethodParameters`) checked so momentum is visible

### Requirement: Execution plan and priorities guide the next batch

The tracker SHALL include a standing backlog so contributors know the next Core files to document.

#### Scenario: Prioritized backlog stays attached to the tracker

- Given the execution plan portion of the tracker
- When maintainers consult it
- Then it reiterates the work cycle (review completed files, continue documentation, update tracker, run `yarn api:build`)
- And it lists the priority backlog (e.g., `createInstance.ts`, `getConstructorArgNames.ts`, `isClass.ts`, `isCollection.ts`, `types/Store.ts`, `types/Metadata.ts`) so the next contributors know exactly where to focus
