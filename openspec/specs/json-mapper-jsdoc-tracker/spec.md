# json-mapper-jsdoc-tracker Specification

## Purpose

Track JSON Mapper JSDoc coverage rules, priorities, and validation workflow so contributors have a single reference for the package located at `packages/specs/json-mapper/src`.

## Requirements

### Requirement: JSON Mapper tracker defines scope and guardrails

The tracker SHALL establish the package scope and the documentation rules contributors must follow.

#### Scenario: `reports/jsdoc/json-mapper.md` states the symbol-only charter

- **GIVEN** the tracker file
- **WHEN** a contributor reads the Purpose section
- **THEN** it specifies that the tracker covers `packages/specs/json-mapper/src`, reiterates that only exported symbols (not members) receive JSDoc, and forbids the `@example` tag in favor of Markdown headings (e.g., “### Usage”) inside descriptions

### Requirement: Folder-level summaries enumerate every JSON Mapper file

The tracker SHALL list each relevant file grouped by its top-level folder so contributors can see coverage gaps.

#### Scenario: Summaries cover components, domain, decorators, hooks, interfaces, utils

- **GIVEN** the summary table section
- **WHEN** it renders the folder groups
- **THEN** it contains subsections for `components`, `domain`, `decorators`, `hooks`, `interfaces`, and `utils`, and each subsection lists every non-test source file (e.g., `JsonSerializer.ts`, `DateMapper.ts`, `jsonMapper.ts`, `alterAfterDeserialize.ts`, `serialize.ts`, `JsonMapperMethods.ts`) with `[x]/[~]/[ ]` statuses, while spec/test files are called out as excluded so requirements stay unambiguous

### Requirement: High-impact exports have per-symbol checklists

The tracker SHALL include detailed checklists for the most important exports to ensure partial work stays visible.

#### Scenario: Checklist highlights domain models and mapper helpers

- **GIVEN** the “Per-symbol checklist” section
- **WHEN** it enumerates key exports
- **THEN** it includes at least `JsonSerializer`, `JsonDeserializer`, `JsonMapperSettings`, `JsonMapperGlobalOptions`, `JsonMapperTypesContainer`, `JsonMapperCompiler`, `serialize()`, `deserialize()`, and the mapper components (`DateMapper`, `PrimitiveMapper`, `SymbolMapper`), with each entry using `[x]/[~]/[ ]` plus a short note describing outstanding work

### Requirement: Execution plan, priorities, and validation workflow stay documented

The tracker SHALL outline how to tackle the work and how to validate it.

#### Scenario: Plan includes phases, backlog, and validation command

- **GIVEN** the execution plan section
- **WHEN** contributors review it
- **THEN** it describes phased work (e.g., Phase 1: domain + utils, Phase 2: components + decorators/hooks, Phase 3: interfaces + advanced hooks), lists next actions or priority files, and states that each batch SHALL run `yarn api:build --filter @tsed/json-mapper` (or equivalent) to ensure TSDoc stays valid

### Requirement: Tracker statistics quantify progress

The tracker SHALL provide measurable stats so maintainers can report progress.

#### Scenario: Stats block shows totals and percentages

- **GIVEN** the statistics section
- **WHEN** it is rendered
- **THEN** it reports the total number of JSON Mapper source files being tracked, counts per folder, completion percentages for `[x]`, `[~]`, `[ ]`, and calls out special cases (e.g., “spec files excluded”) so the numbers remain unambiguous

### Requirement: Tracker index references JSON Mapper

Documentation SHALL mention the new tracker so contributors can discover it.

#### Scenario: README + AGENTS list `json-mapper.md`

- **GIVEN** `reports/jsdoc/README.md` and the “JSDoc coverage trackers” guidance in `AGENTS.md`
- **WHEN** those documents are updated
- **THEN** they mention `json-mapper.md` alongside the existing trackers (Core, DI, Hooks, Schema) and direct contributors to follow the same symbol-only rules and validation expectations for JSON Mapper
