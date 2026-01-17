## ADDED Requirements

### Requirement: Hooks tracker documents scope and symbol-only rules

Even though Hooks is complete, the tracker SHALL capture its scope and rule set for future contributors.

#### Scenario: Purpose statement mirrors the `.plan` guidance

- Given the Hooks tracker covering `packages/hooks/src`
- When contributors open it
- Then it states that the package exposes a lightweight event hooks system, only the exported symbols (`HookRef`, `HookListener`, `Hooks`, and helper constants) need documentation, and index/tests are excluded
- And it repeats the symbol-only rule set plus the prohibition on `@example` tags, pointing people to Markdown headings instead

### Requirement: Tracker enumerates every exported Hook symbol

Listing all exports SHALL keep the single-file package transparent and easy to audit.

#### Scenario: Per-symbol checklist shows 11/11 items documented

- Given the per-file view for `packages/hooks/src/Hooks.ts`
- When the tracker renders it
- Then it lists the two type aliases, the `Hooks` class, the singleton `hooks`, and the seven helper exports (`$on`, `$once`, `$off`, `$emit`, `$asyncEmit`, `$alter`, `$asyncAlter`)
- And each entry is marked `[x]` to reflect the completed documentation pass

### Requirement: Execution plan captures the validation step

The tracker SHALL remind maintainers to finish the outstanding `yarn api:build` validation.

#### Scenario: Tracker shows that only the `yarn api:build` run remains

- Given the "Next actions" section
- When maintainers review it
- Then it records that the documentation is complete and the outstanding task is to run `yarn api:build` once for the Hooks package to confirm no TSDoc regressions

### Requirement: Statistics summarize completion

Completion stats SHALL confirm the Hooks documentation sweep is truly done.

#### Scenario: Tracker highlights that Hooks is 100% done

- Given the statistics block
- When someone inspects it
- Then it states that the package has 1 tracked file, 11 exported symbols, and a 100% completion rate with no partial items
