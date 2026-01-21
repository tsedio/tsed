# schema-jsdoc-tracker Specification

## Purpose

Define the Ts.ED Schema JSDoc tracker so contributors can coordinate documentation work across `packages/specs/schema/src`, including scope, categories, phases, priorities, and metrics.

## Requirements

### Requirement: Schema tracker defines scope, exclusions, and rules

The tracker SHALL reiterate which files are in play, what decorators/rules apply, and how authors validate changes.

#### Scenario: Purpose section mirrors the `.plan` guidance

- **GIVEN** the tracker for `packages/specs/schema/src`
- **WHEN** contributors read the introduction
- **THEN** it states that the goal is to document exported symbols only, that `@example` tags are disallowed (use Markdown headings instead), and that tests plus `__mock__`/`__fixtures__` folders are excluded, while reiterating the English/French reminders about symbol-only documentation, the need to run `yarn api:build`, and the focus on high-impact decorators plus domain models

### Requirement: Category summaries enumerate coverage status

Given the package size, the tracker SHALL include category-by-category summaries so work can be distributed intelligently.

#### Scenario: Tracker lists every category with completion highlights

- **GIVEN** the summary tables
- **WHEN** maintainers inspect them
- **THEN** they see categories such as `constants`, `domain`, `interfaces`, `decorators/class`, `decorators/collections`, `decorators/common`, `decorators/config`, `decorators/generics`, `decorators/operations`, `fn`, `hooks`, `registries`, `components/default`, `components/open-spec`, and `utils`, with each category recording which files are `[x]`, `[~]`, or `[ ]` plus notable details (e.g., constants/interfaces/domain at 100%, common decorators ~65%, others pending)

### Requirement: Phase plan guides sequencing for the 194 files

The four-phase roadmap SHALL stay embedded in the tracker to coordinate long-running work.

#### Scenario: Tracker keeps the four-phase roadmap current

- **GIVEN** the execution plan section
- **WHEN** someone references it
- **THEN** it outlines Phase 1 (core foundation: interfaces, domain, constants) as complete, Phase 2 (user-facing API: decorators, operations, functional helpers) as in progress, Phase 3 (supporting components: class/generics/hook/registry work) as pending, and Phase 4 (implementation details: components + utils) as pending, listing the specific categories included in each phase

### Requirement: Priorities call out the immediate backlog

Highlighting the next decorator/function targets SHALL keep focus on the highest-impact remaining files.

#### Scenario: Tracker singles out the next decorator/function targets

- **GIVEN** the "Next actions" list
- **WHEN** maintainers consult it
- **THEN** it highlights the remaining common decorators (e.g., `forwardGroups`, `groups`, `hidden`, `ignore`, `integer`, `jsonEntityFn`, `labelledAs`, `maximum`, `minimum`, `multipleOf`, `name`, `recordOf`, `requiredGroups`, `schema`, `title`, `typeError`, etc.), operation decorators, and functional helpers (`allOf`, `any`, `anyOf`, `enums`, `from`, `integer`, `lazyRef`, `oneOf`, `uri`, `url`), and reiterates that hooks, registries, components, and utils have zero coverage

### Requirement: Statistics quantify progress

Detailed counts and percentages SHALL let stakeholders measure the state of the 194-file effort.

#### Scenario: Tracker reports totals and completion ratios

- **GIVEN** the statistics block
- **WHEN** someone reviews it
- **THEN** it states that 194 files are in scope, 60 are fully complete (31%), 18 have improved docs (9%), and 116 remain pending (40% overall coverage), plus per-category completion rates (constants/domain/interfaces/class/collection decorators at 100%, common decorators ~65%, functions 47%, others 0%)
