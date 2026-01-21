## ADDED Requirements

### Requirement: Define the DI documentation scope and rules

The DI tracker SHALL spell out what is in scope, what is excluded, and any special linting guidance (like avoiding `@example`).

#### Scenario: Tracker reiterates symbol-only guidance and linting caveats

- Given the tracker for `packages/di/src`
- When contributors read the introduction
- Then it explains that the goal is to document exported symbols only and that browser/node/common segments each have their own folders
- And it explicitly forbids the `@example` tag (recommending Markdown headings instead) and repeats the English/French reminders about symbol-only docs
- And it calls out that index files, tests, and `__mock__` directories are excluded

### Requirement: Surface coverage status across every DI folder

Maintainers SHALL rely on per-folder coverage snapshots to understand where documentation work remains.

#### Scenario: Browser, common, and node sections list file-by-file progress

- Given the summary tables inside the tracker
- When maintainers review them
- Then they see grouped sections such as `browser/decorators`, `browser/fn`, `browser/utils`, `common/decorators`, `common/domain`, `common/interfaces`, `common/utils`, `common/registries`, `node/services`, etc.
- And each listed file includes a `[x]/[~]/[ ]` status so outstanding work (e.g., browser context helpers, DIConfigurationOptions, RegistrySettings, GlobalProviders, ProviderRegistry, utils/setLoggerFormat) is obvious

### Requirement: Prioritized backlog focuses contributors on the highest impact areas

The tracker SHALL keep a ranked backlog so new contributors know which DI categories to attack first.

#### Scenario: Tracker orders work by category

- Given the "High-priority symbols" section
- When contributors read it
- Then it ranks the workstream: core interfaces ➜ domain models ➜ key services ➜ decorators ➜ helper functions ➜ platform-specific code
- And it explains why each tier matters (e.g., interfaces define contracts, InjectorService/DILogger are user-facing APIs)

### Requirement: Execution plan and next actions stay actionable

Step-by-step execution guidance SHALL remain documented so the workflow (document, update tracker, run `yarn api:build`) stays consistent.

#### Scenario: Tracker lists sequential steps and validation guidance

- Given the execution plan portion of the tracker
- When someone needs to continue the sweep
- Then it outlines the step-by-step approach (start with interfaces, move through domain, services, decorators, utilities, platform code) and reminds contributors to run `yarn api:build` regularly
- And the "Next actions" checklist highlights the immediate TODOs (begin interfaces, document domain, services, decorators, utilities, validate with `yarn api:build`)

### Requirement: Statistics communicate overall progress

Aggregated counts and percentages SHALL ensure stakeholders can gauge DI documentation momentum at a glance.

#### Scenario: Tracker reports counts and completion percentages

- Given the statistics section at the end
- When maintainers consult it
- Then it includes totals (e.g., 88 files tracked, 58 complete, 30 pending, 66% completion) plus per-category breakdowns (interfaces 13/15, utils 0/10, registries 0/2, platform-specific 0/8, etc.)
- And it distinguishes between fully complete categories (decorators, domain, services, fn) and those still in progress
