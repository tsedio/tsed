# Proposal: Elevate @tsed/json-mapper JSDoc coverage

## Discovery Notes

- `openspec/project.md` emphasizes Ts.ED’s focus on documentation quality and symbol-only JSDoc rules; JSON Mapper currently lacks a tracker inside `reports/jsdoc/`.
- `openspec list` shows one active change (`standardize-jsdoc-tracking`) plus the completed `add-jsonschema-object-transforms`; telemetry flushing fails offline but does not block CLI usage.
- `openspec list --specs` reports “No specs found,” so there are no global specs restricting this package.
- The `@tsed/json-mapper` sources live under `packages/specs/json-mapper/src` with 35 TypeScript files across `domain/`, `components/`, `decorators/`, `hooks/`, `interfaces/`, and `utils/`. Several files (e.g., `JsonSerializer.ts`, `JsonDeserializer.ts`, `DateMapper.ts`, `serialize.ts`) export runtime classes or helpers but have inconsistent or missing symbol-level documentation.
- Existing trackers (Core, DI, Hooks, Schema) forbid the `@example` tag in favor of Markdown headings; JSON Mapper needs the same guardrail spelled out.

## Problem Statement

There is no authoritative plan or status tracker for improving JSDoc coverage inside `@tsed/json-mapper`, making it difficult to prioritize documentation work, enforce symbol-only rules, or coordinate validation (`yarn api:build`). Contributors must audit the package manually, and there is no shared backlog highlighting critical files such as `JsonMapperSettings`, the mapper components, or `serialize/deserialize` helpers. We need a tracker equivalent to the existing ones so progress becomes visible and enforceable through OpenSpec.

## Goals

1. Introduce a JSON Mapper JSDoc tracker under `reports/jsdoc/json-mapper.md` that mirrors the structure of the Core/DI/Schema trackers.
2. Capture scope, status legend, and symbol-only rules (explicitly disallowing `@example` tags) so contributors do not guess.
3. Provide folder-level summaries covering components, domain models, decorators, hooks, interfaces, and utils, plus detailed checklists for high-impact exports (e.g., `JsonSerializer`, `JsonDeserializer`, `DateMapper`, `serialize()` helpers).
4. Define a phased execution plan (e.g., domain + utils first, then decorators/hooks/components) and a statistics section that keeps completion percentages visible.
5. Require `yarn api:build` validation (focused on `packages/specs/json-mapper`) after documentation batches.
6. Update the tracker index (`reports/jsdoc/README.md` and references in `AGENTS.md`) so JSON Mapper appears alongside the other packages.

## Non-Goals

- Writing or editing any actual JSDoc comments (that happens during apply).
- Modifying runtime behavior of the JSON Mapper package.
- Creating automation to compute stats; manual tables/checklists are sufficient at this stage.
- Reintroducing the deprecated `.plan` directory.

## Proposed Approach (High Level)

- Author a new OpenSpec change `elevate-json-mapper-jsdoc` with a dedicated spec describing the tracker expectations.
- Populate `reports/jsdoc/json-mapper.md` with the same sections used elsewhere: purpose/rules, status legend, per-folder tables, per-symbol checklist (starting with domain models and serialize/deserialize helpers), execution plan, and statistics.
- Highlight the “no `@example` tag” rule within the tracker to match Schema/DI/Hooks.
- Update `reports/jsdoc/README.md` (and any references in `AGENTS.md`) to mention the new tracker so contributors can discover it.
- Validate the change with `openspec validate elevate-json-mapper-jsdoc --strict`.

## Risks & Unknowns

- Without an existing tracker, initial status estimates may require a quick audit to avoid inaccurate counts.
- JSON Mapper includes spec files inside `src/domain` and `src/utils`; the tracker should clarify whether those files are excluded to avoid double work.
- Future documentation guidelines might require additional metadata (e.g., translation notes); we may need to amend the tracker later.

## Success Measures

- `reports/jsdoc/json-mapper.md` exists and mirrors the structure/rigor of other trackers, including symbol-only guardrails and the “no `@example` tag” rule.
- Contributors can reference folder-level summaries and per-symbol checklists specific to JSON Mapper.
- The tracker’s execution plan and statistics make it easy to measure progress and identify next actions.
- `reports/jsdoc/README.md` (and `AGENTS.md`) mention JSON Mapper, ensuring discoverability.
- `openspec validate elevate-json-mapper-jsdoc --strict` passes, demonstrating spec completeness.
