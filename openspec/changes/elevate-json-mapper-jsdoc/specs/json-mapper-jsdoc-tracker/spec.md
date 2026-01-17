## ADDED Requirements

### Requirement: JSON Mapper tracker defines scope and guardrails

The tracker SHALL establish the package scope and the documentation rules contributors must follow.

#### Scenario: `reports/jsdoc/json-mapper.md` states the symbol-only charter

- Given the new tracker file
- When a contributor reads the “Purpose” section
- Then it specifies that the tracker covers `packages/specs/json-mapper/src`
- And it reiterates that only exported symbols (not members) receive JSDoc
- And it explicitly forbids the `@example` tag, instructing authors to use Markdown headings (e.g., “### Usage”) inside descriptions instead

### Requirement: Folder-level summaries enumerate every JSON Mapper file

The tracker SHALL list each relevant file grouped by its top-level folder so contributors can see coverage gaps.

#### Scenario: Summaries cover components, domain, decorators, hooks, interfaces, utils

- Given the tracker’s summary table section
- When it renders the folder groups
- Then it contains subsections for `components`, `domain`, `decorators`, `hooks`, `interfaces`, and `utils`
- And each subsection lists every non-test source file (e.g., `JsonSerializer.ts`, `DateMapper.ts`, `jsonMapper.ts`, `alterAfterDeserialize.ts`, `serialize.ts`, `JsonMapperMethods.ts`) with `[x]/[~]/[ ]` statuses
- And spec/test files inside the same directories are either called out as excluded or tracked separately so readers know whether they require documentation

### Requirement: High-impact exports have per-symbol checklists

The tracker SHALL include detailed checklists for the most important exports to ensure partial work stays visible.

#### Scenario: Checklist highlights domain models and mapper helpers

- Given the “Per-symbol checklist” section
- When it enumerates key exports
- Then it includes at least `JsonSerializer`, `JsonDeserializer`, `JsonMapperSettings`, `JsonMapperGlobalOptions`, `JsonMapperTypesContainer`, `JsonMapperCompiler`, `serialize()`, `deserialize()`, and the mapper components (`DateMapper`, `PrimitiveMapper`, `SymbolMapper`)
- And each entry uses `[x]/[~]/[ ]` to indicate completion plus a short note on what remains (e.g., “needs summary + @public tag”)

### Requirement: Execution plan, priorities, and validation workflow stay documented

The tracker SHALL outline how to tackle the work and how to validate it.

#### Scenario: Plan includes phases, backlog, and validation command

- Given the execution plan section
- When contributors review it
- Then it describes phased work (e.g., Phase 1: domain + utils, Phase 2: components + decorators/hooks, Phase 3: interfaces + advanced hooks)
- And it lists concrete next actions or priority files (e.g., finish serializer/deserializer docs before decorators)
- And it states that each batch SHALL run `yarn api:build --filter @tsed/json-mapper` (or an equivalent command) to ensure TSDoc stays valid

### Requirement: Tracker statistics quantify progress

The tracker SHALL provide measurable stats so maintainers can report progress.

#### Scenario: Stats block shows totals and percentages

- Given the statistics section
- When it is rendered
- Then it reports the total number of JSON Mapper source files being tracked, counts per folder, and completion percentages for `[x]`, `[~]`, `[ ]`
- And it calls out any special cases (e.g., “spec files excluded”) so the numbers are unambiguous

### Requirement: Tracker index references JSON Mapper

Documentation SHALL mention the new tracker so contributors can discover it.

#### Scenario: README + AGENTS list `json-mapper.md`

- Given `reports/jsdoc/README.md` and the “JSDoc coverage trackers” guidance in `AGENTS.md`
- When those documents are updated
- Then they mention `json-mapper.md` alongside the existing trackers (Core, DI, Hooks, Schema)
- And they direct contributors to follow the same symbol-only rules and validation expectations for JSON Mapper
