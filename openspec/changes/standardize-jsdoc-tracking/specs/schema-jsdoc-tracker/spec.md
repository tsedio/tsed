## ADDED Requirements

### Requirement: Schema tracker defines scope, exclusions, and rules

The Schema tracker SHALL reiterate which files are in play, what decorators/rules apply, and how authors validate changes.

#### Scenario: Purpose section mirrors the `.plan` guidance

- Given the tracker for `packages/specs/schema/src`
- When contributors read the introduction
- Then it states that the goal is to document exported symbols only, that `@example` tags are disallowed (use Markdown headings instead), and that tests plus `__mock__`/`__fixtures__` folders are excluded
- And it reiterates the English/French reminders about symbol-only documentation, the need to run `yarn api:build`, and the focus on high-impact decorators plus domain models

### Requirement: Category summaries enumerate coverage status

Given the package size, the tracker SHALL include category-by-category summaries so work can be distributed intelligently.

#### Scenario: Tracker lists every category with completion highlights

- Given the summary tables
- When maintainers inspect them
- Then they see categories such as `constants`, `domain`, `interfaces`, `decorators/class`, `decorators/collections`, `decorators/common`, `decorators/config`, `decorators/generics`, `decorators/operations`, `fn`, `hooks`, `registries`, `components/default`, `components/open-spec`, and `utils`
- And each category records which files are `[x]`, `[~]`, or `[ ]`, e.g., constants/interfaces/domain are 100% complete, 30+ common decorators already documented or partially documented, but config/generics/operations/hooks/registries/components/utils remain pending
- And the tracker highlights notable details such as `JsonSchema` having 30+ methods documented or `@CollectionOf/@UniqueItems` already well-covered

### Requirement: Phase plan guides sequencing for the 194 files

The four-phase roadmap SHALL stay embedded in the tracker to coordinate long-running work.

#### Scenario: Tracker keeps the four-phase roadmap current

- Given the execution plan section
- When someone references it
- Then it outlines Phase 1 (core foundation: interfaces, domain, constants) as complete, Phase 2 (user-facing API: decorators, operations, functional helpers) as in progress, Phase 3 (supporting components: class/generics/hook/registry work) as pending, and Phase 4 (implementation details: components + utils) as pending
- And it lists the specific categories included in each phase so contributors know what belongs where

### Requirement: Priorities call out the immediate backlog

Highlighting the next decorator/function targets SHALL keep the focus on the highest-impact remaining files.

#### Scenario: Tracker singles out the next decorator/function targets

- Given the "Next actions" list
- When maintainers consult it
- Then it highlights that common decorators still missing coverage (`forwardGroups`, `groups`, `hidden`, `ignore`, `integer`, `jsonEntityFn`, `labelledAs`, `maximum`, `minimum`, `multipleOf`, `name`, `recordOf`, `requiredGroups`, `schema`, `title`, `typeError`, etc.), operation decorators, and functional helpers (`allOf`, `any`, `anyOf`, `enums`, `from`, `integer`, `lazyRef`, `oneOf`, `uri`, `url`) should be addressed next
- And it reiterates that hooks, registries, components, and utils have zero coverage so far, keeping them visible in the backlog

### Requirement: Statistics quantify progress

Detailed counts and percentages SHALL let stakeholders measure the state of the 194-file effort.

#### Scenario: Tracker reports totals and completion ratios

- Given the statistics block
- When someone reviews it
- Then it states that 194 files are in scope, 60 are fully complete (31%), 18 have improved docs (9%), and 116 remain pending (40% overall coverage)
- And it provides per-category completion rates (e.g., constants/domain/interfaces/class/collection decorators at 100%, common decorators at ~65%, functions at 47%, all other categories at 0%) so stakeholders can measure momentum
