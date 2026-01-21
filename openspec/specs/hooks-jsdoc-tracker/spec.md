# hooks-jsdoc-tracker Specification

## Purpose

Record the Hooks JSDoc tracker expectations so the completed sweep for `packages/hooks/src` stays discoverable and validated.

## Requirements

### Requirement: Hooks tracker documents scope and symbol-only rules

Even though Hooks is complete, the tracker SHALL capture its scope and rule set for future contributors.

#### Scenario: Purpose statement mirrors the `.plan` guidance

- **GIVEN** the Hooks tracker covering `packages/hooks/src`
- **WHEN** contributors open it
- **THEN** it states that the package exposes a lightweight event hooks system, only the exported symbols (`HookRef`, `HookListener`, `Hooks`, helper constants) need documentation, index/tests are excluded, and it repeats the symbol-only rule set plus the prohibition on `@example` tags (use Markdown headings instead)

### Requirement: Tracker enumerates every exported Hook symbol

Listing all exports SHALL keep the single-file package transparent and easy to audit.

#### Scenario: Per-symbol checklist shows 11/11 items documented

- **GIVEN** the per-file view for `packages/hooks/src/Hooks.ts`
- **WHEN** the tracker renders it
- **THEN** it lists the two type aliases, the `Hooks` class, the singleton `hooks`, and the seven helper exports (`$on`, `$once`, `$off`, `$emit`, `$asyncEmit`, `$alter`, `$asyncAlter`), with each entry marked `[x]` to reflect the completed documentation pass

### Requirement: Execution plan captures the validation step

The tracker SHALL remind maintainers to finish the outstanding `yarn api:build` validation.

#### Scenario: Tracker shows that only the `yarn api:build` run remains

- **GIVEN** the "Next actions" section
- **WHEN** maintainers review it
- **THEN** it records that documentation is complete and the outstanding task is to run `yarn api:build` once for the Hooks package to confirm no TSDoc regressions

### Requirement: Statistics summarize completion

Completion stats SHALL confirm the Hooks documentation sweep is done.

#### Scenario: Tracker highlights that Hooks is 100% done

- **GIVEN** the statistics block
- **WHEN** someone inspects it
- **THEN** it states that the package has 1 tracked file, 11 exported symbols, and a 100% completion rate with no partial items
