### Ts.ED JSON Mapper — JSDoc Coverage Tracker (packages/specs/json-mapper/src)

Generated: 2025-01-17

Purpose

- Track documentation coverage for exported symbols in `packages/specs/json-mapper/src`.
- Enforce the "symbols only" rule: document only exported symbols (type alias, interface, enum, class, function, exported constant), not their members.
- Status legend:
  - [x] Documented (English JSDoc present and conforms to symbols-only)
  - [~] Partial (basic JSDoc present, needs polish/validation)
  - [ ] Pending (no/insufficient JSDoc)

How to use

- Update this file as you document symbols. Keep statuses in sync.
- Prefer adding per-symbol checklists under each file when possible.
- Validate with `yarn api:build --filter @tsed/json-mapper` (or `yarn api:build`) after every documentation batch.

Rules (symbols only)

- Write JSDoc in English (TSDoc-compatible).
- Document only the exported symbol itself, not its internal members (no class methods/properties, no interface member descriptions, etc.).
- Allowed/encouraged tags: `@public`, `@since`, `@deprecated`, `@see`, `@typeParam`.
- **DO NOT use the `@example` tag** — the documentation parser does not support it. For examples, use Markdown headings inside the comment body (e.g., `### Usage`).
- Do not change runtime behavior. Minimize diffs and follow the existing code style.

- FR: Documenter uniquement les symboles exportés (classes, fonctions, alias de type, interfaces, enums, constantes exportées). Ne pas documenter leurs membres internes : propriétés/méthodes des classes, propriétés des types/interfaces, membres des enums, etc.
- FR: NE PAS utiliser le tag `@example`. Utiliser des titres markdown (### Exemple, ### Usage) dans la description JSDoc à la place.

Notes

- `*.spec.ts` files and `__snapshots__` directories are excluded.
- `src/index.ts` is excluded (barrel only).
- Initial focus: domain models (`JsonSerializer`, `JsonDeserializer`, mapper settings), serialize/deserialize helpers, and components.

---

## Summary table (per file)

Files under `packages/specs/json-mapper/src` (excluding index.ts and tests), grouped by folder:

#### components

- [x] packages/specs/json-mapper/src/components/DateMapper.ts
- [x] packages/specs/json-mapper/src/components/PrimitiveMapper.ts
- [x] packages/specs/json-mapper/src/components/SymbolMapper.ts

#### decorators

- [x] packages/specs/json-mapper/src/decorators/afterDeserialize.ts
- [x] packages/specs/json-mapper/src/decorators/beforeDeserialize.ts
- [x] packages/specs/json-mapper/src/decorators/jsonMapper.ts
- [x] packages/specs/json-mapper/src/decorators/onDeserialize.ts
- [x] packages/specs/json-mapper/src/decorators/onSerialize.ts

#### domain

- [x] packages/specs/json-mapper/src/domain/JsonDeserializer.ts
- [x] packages/specs/json-mapper/src/domain/JsonDeserializerOptions.ts
- [x] packages/specs/json-mapper/src/domain/JsonMapperCompiler.ts
- [x] packages/specs/json-mapper/src/domain/JsonMapperGlobalOptions.ts
- [x] packages/specs/json-mapper/src/domain/JsonMapperSettings.ts
- [x] packages/specs/json-mapper/src/domain/JsonMapperTypesContainer.ts
- [x] packages/specs/json-mapper/src/domain/JsonSerializer.ts
- [x] packages/specs/json-mapper/src/domain/JsonSerializerOptions.ts
- [x] packages/specs/json-mapper/src/domain/Writer.ts

#### hooks

- [x] packages/specs/json-mapper/src/hooks/alterAfterDeserialize.ts
- [x] packages/specs/json-mapper/src/hooks/alterBeforeDeserialize.ts
- [x] packages/specs/json-mapper/src/hooks/alterOnDeserialize.ts
- [x] packages/specs/json-mapper/src/hooks/alterOnSerialize.ts

#### interfaces

- [x] packages/specs/json-mapper/src/interfaces/JsonMapperMethods.ts

#### utils

- [x] packages/specs/json-mapper/src/utils/deserialize.ts
- [x] packages/specs/json-mapper/src/utils/getObjectProperties.ts
- [x] packages/specs/json-mapper/src/utils/serialize.ts

---

## Per-file symbol checklist (detailed)

### Domain models and settings

- [x] `JsonSerializer` — needs symbol-level summary, params/returns tags, and @public.
- [x] `JsonSerializerOptions` — document the exported interface (symbols only).
- [x] `Writer` — document the class describing buffered serialization output.
- [x] `JsonDeserializer` — add symbol-level description and @public.
- [x] `JsonDeserializerOptions` — describe configuration contract and mark @public.
- [x] `JsonMapperSettings` — describe factory + fluent API plus note defaults.
- [x] `JsonMapperGlobalOptions` — explain shared/global configuration usage.
- [x] `JsonMapperTypesContainer` — describe registry responsibilities.
- [x] `JsonMapperCompiler` — document purpose and describe compile options/return type.

### Mapper components

- [x] `DateMapper` — document serialize/deserialize responsibilities + @see.
- [x] `PrimitiveMapper` — explain primitive handling and fallback strategy.
- [x] `SymbolMapper` — document symbol serialization behavior.

### Decorators and hooks

- [x] `@JsonMapper` decorator — describe usage and acceptable tokens.
- [x] `@OnSerialize`, `@OnDeserialize` — describe lifecycle and hook contexts.
- [x] `@BeforeDeserialize`, `@AfterDeserialize` — describe pipeline integration.
- [x] `alterOnSerialize`, `alterOnDeserialize`, `alterBeforeDeserialize`, `alterAfterDeserialize` — document hook contexts and return contracts.

### Utilities

- [x] `serialize()` helper — document params/options/return value and async behavior.
- [x] `deserialize()` helper — document how errors bubble and how options apply.
- [x] `getObjectProperties()` — describe selection logic for mapper metadata.

---

## Execution plan

1. **Phase 1 – Domain + utilities**
   - Finish `JsonSerializer`, `JsonDeserializer`, options/settings/global options, compiler/container, and `serialize/deserialize` helpers.
   - Validation: `yarn api:build --filter @tsed/json-mapper`.
2. **Phase 2 – Components + decorators**
   - Document mapper components and decorator entry points (`@JsonMapper`, lifecycle decorators).
   - Validation: `yarn api:build --filter @tsed/json-mapper`.
3. **Phase 3 – Hooks + interfaces**
   - Cover hook helpers and `JsonMapperMethods` interface.
   - Validation: `yarn api:build --filter @tsed/json-mapper`.

### Next actions

- [x] Audit domain files for existing comments; convert them to symbol-only JSDoc.
- [x] Add baseline docs to `serialize.ts` / `deserialize.ts`.
- [x] Document mapper components.
- [x] Add hook/decorator documentation and ensure translator-friendly Markdown headings replace `@example`.
- [ ] Keep the tracker in sync as new mapper features land and continue validating with `yarn api:build --filter @tsed/json-mapper`.

---

## Statistics

- Total files tracked: **25**
  - Components: 3
  - Decorators: 5
  - Domain: 9
  - Hooks: 4
  - Interfaces: 1
  - Utils: 3
- Status counts:
  - Documented `[x]`: 25 (100%)
  - Partial `[~]`: 0 (0%)
  - Pending `[ ]`: 0 (0%)
- Spec files (`*.spec.ts`) and index barrels are excluded from these totals.
