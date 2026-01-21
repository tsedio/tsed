# Design: JSON Mapper JSDoc tracker

## Overview

We are extending the existing JSDoc tracking system (formerly `.plan/*`, now `reports/jsdoc/`) to cover `@tsed/json-mapper`. The design copies the proven structure from the Core/DI/Schema trackers:

| Tracker section             | Purpose for JSON Mapper                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Purpose + rules             | State that only exported symbols are documented and `@example` is disallowed (use Markdown headings instead).                                                      |
| Status legend               | Keep the `[x]` / `[~]` / `[ ]` notation consistent across all packages.                                                                                            |
| Folder summaries            | Group files under `domain`, `components`, `decorators`, `hooks`, `interfaces`, and `utils` to mirror the package layout.                                           |
| Per-symbol checklist        | Highlight key exports (`JsonSerializer`, `JsonDeserializer`, `JsonMapperSettings`, mapper components, serialize/deserialize helpers) so partial work is trackable. |
| Execution plan + priorities | Phase the effort (domain + utils first, then decorators/hooks/components) and point to required validation (`yarn api:build --filter @tsed/json-mapper`).          |
| Statistics                  | Count files per folder and overall completion percentage to show momentum.                                                                                         |

## Tracker placement

- The new tracker lives at `reports/jsdoc/json-mapper.md`, alongside `core.md`, `di.md`, `hooks.md`, and `schema.md`.
- `reports/jsdoc/README.md` and the root `AGENTS.md` will mention the JSON Mapper tracker so contributors know it exists.

## Validation expectations

- After any documentation batch within `@tsed/json-mapper`, contributors will run `yarn api:build --filter @tsed/json-mapper` (or `yarn api:build` if running globally) to catch TSDoc errors.
- Tracker updates are purely informational; no automated tooling is introduced in this change.
