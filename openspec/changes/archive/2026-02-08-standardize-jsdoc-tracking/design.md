# Design: Mapping legacy JSDoc trackers to OpenSpec

## Overview

The existing `.plan/<package>-jsdoc-status/plan.md` files already encode the scope, rules, progress breakdowns, and execution plans for their respective packages. The goal is to express those expectations as OpenSpec capabilities so future work can reference them formally. Rather than inventing new processes, we translate each section of the markdown trackers into requirements:

| Legacy section                                      | OpenSpec representation                                                 | Notes                                                                                                                                           |
| --------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose + rules (symbol-only, language preferences) | Requirement describing scope and guardrails                             | The DI/Hooks/Schema trackers include French reminders and special casing for `@example`; those nuances are preserved verbatim where applicable. |
| Summary tables per folder                           | Requirement that mandates grouped reporting with the same folder names  | These tables capture coverage surface area and will stay synchronized with the associated package paths.                                        |
| Per-symbol checklist / priority list                | Requirement for granular tracking and backlog ordering                  | Core uses a symbol checklist (e.g., `StaticMethodDecorator`) while Schema uses phase-based backlogs; both become explicit scenarios.            |
| Execution plan + validation                         | Requirement for workflow, including `yarn api:build` validation         | Hooks explicitly calls out the pending `yarn api:build` run, so the spec ensures future apply work covers it.                                   |
| Statistics                                          | Requirement to publish counts so maintainers see completion percentages | Needed primarily for the large DI/Schema trackers.                                                                                              |

## Directory Layout

- `openspec/changes/standardize-jsdoc-tracking/specs/core-jsdoc-tracker`: Requirements for `packages/core`.
- `.../di-jsdoc-tracker`: Requirements for `packages/di`.
- `.../hooks-jsdoc-tracker`: Requirements for `packages/hooks`.
- `.../schema-jsdoc-tracker`: Requirements for `packages/specs/schema`.

Each spec references the relevant source files (e.g., `packages/core/src/types/DecoratorParameters.ts`) so implementation tasks know where to act.

## Future Evolution

After the specs are approved, the apply stage can:

1. Port the tracker content from `.plan` into a permanent repository location (e.g., `reports/jsdoc/<package>.md`) that maps 1:1 with the requirements.
2. Update contributor guides to point at the OpenSpec-backed trackers.
3. Remove the stale `.plan` directory once teams rely on the new docs.

## Validation Strategy

- Continue running `yarn api:build` whenever documentation batches land, as already stated inside the trackers.
- Use OpenSpec change reviews in place of manual `.plan` diffs to keep upcoming documentation work visible.
- Because the `openspec` CLI is unavailable locally, reviewers will need to run `openspec validate standardize-jsdoc-tracking --strict` in an environment where the binary exists.
