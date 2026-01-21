# Proposal: Add JsonSchema object transform helpers

## Discovery Notes

- `openspec/project.md` is not present in the workspace, so no project-level guidance was available to review.
- `openspec list` and `openspec list --specs` commands are unavailable in this environment (`openspec` binary not found), so no existing specs could be enumerated before drafting this proposal.
- Relevant source references: `packages/specs/schema/src/domain/JsonSchema.ts`, `packages/specs/schema/src/domain/types.ts`, `packages/specs/schema/src/fn/index.ts`, and `docs/docs/model.md`.

## Problem Statement

The functional JsonSchema API lacks ergonomic helpers for composing or re-shaping object schemas. Users need to clone schemas manually to pick/omit properties, mark everything optional, or to merge multiple schema fragments, which is error-prone and leaves TypeScript inference (`s.infer()`) unaware of the resulting shapes. This gap also means there is no documentation or tests describing these workflows.

## Goals

1. Provide fluent `.pick<K>()` and `.omit<K>()` helpers on `JsonSchema` that create new schemas scoped to selected keys.
2. Provide a `.partial()` helper that returns a cloned schema with every property marked optional (and inference reflecting the partial shape).
3. Provide a `.merge()` helper that combines multiple schema fragments, including other `JsonSchema` instances, while retaining metadata such as required fields.
4. Ensure TypeScript inference through `s.infer()` reflects the transformed shapes for all four helpers.
5. Cover the new behavior with unit tests (runtime & typing) and update the Functional API documentation in `docs/docs/model.md`.

## Non-Goals

- Rewriting the existing schema mapping or serialization layers.
- Adding pick/omit/merge helpers to non-object schema types such as arrays or primitives.
- Touching higher-level decorators or OpenAPI generation beyond what the new helpers require.

## Proposed Approach (High Level)

- Extend `JsonSchema<T>` with `pick`, `omit`, `partial`, and `merge` methods that operate on the internal `properties` map and `#required` set, returning cloned schemas to keep immutability expectations.
- Introduce shared utility typing (e.g., `SchemaPick<T, K>`, `SchemaOmit<T, K>`, `SchemaPartial<T>`, `SchemaMerge<T, U>`) in `domain/types.ts` so TypeScript consumers benefit automatically via `s.infer()`.
- Update functional typing tests (`packages/specs/schema/src/fn/typing.spec.ts`) plus targeted runtime specs (`packages/specs/schema/src/domain/JsonSchema.spec.ts`) to demonstrate the new helpers.
- Document the new helpers with examples under the Functional API section of `docs/docs/model.md`.

## Risks & Unknowns

- Existing schemas may store property names as regex strings via `toJsonRegex`; helpers must respect those normalized keys.
- Required-field bookkeeping relies on the internal `#required` set; we must ensure cloning/merging manipulates it without corrupting state.
- Need to confirm whether `.merge()` should combine non-property keywords (e.g., `additionalProperties`) or remain limited to object properties for now.

## Success Measures

- Functional API users can compose schemas through `pick`, `omit`, `partial`, and `merge` without manually cloning maps.
- `s.infer()` yields the expected `Pick`, `Omit`, `Partial`, or intersection types when the helpers are used.
- Tests capture both runtime shape filtering/merging/partialization and compile-time inference.
- The Functional API documentation advertises the new helpers with accurate examples.
