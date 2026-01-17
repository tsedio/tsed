# JSDoc Coverage Reports (reports/jsdoc)

This directory replaces the legacy `.plan/*-jsdoc-status` trackers. Each package report captures:

- Purpose and symbol-only guardrails (English + French reminders)
- Status legend plus folder-level summaries
- Per-symbol checklists or phase plans
- Execution workflow, validation steps, and statistics

## Workflow

1. Pick the package report (`core.md`, `di.md`, `hooks.md`, `json-mapper.md`, `schema.md`) from this directory.
2. Follow the rules called out in each file (e.g., no `@example` tag in DI/Hooks/Schema, document exported symbols only).
3. Update the status tables/checklists after each documentation batch.
4. Run `yarn api:build` for the package you touched to surface TSDoc issues.
5. Add any validation notes (e.g., date/time of successful `yarn api:build`).

## Validation Commands

- `yarn api:build` – regenerates TSDoc and fails on malformed comments.
- `yarn test:lint` – optional safety net for linting the workspace.
- `yarn docs:build` – ensures documentation builds still succeed after editing these reports.

Need the legacy context? See `openspec/changes/standardize-jsdoc-tracking` for the source specs and historical rationale.
