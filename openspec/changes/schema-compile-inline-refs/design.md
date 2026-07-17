## Context

The schema package compiles decorated classes through the JSON Schema generation path. Functional API schemas and generic schema wrappers need to enter that same path without being treated as constructors. Generated schemas can contain local `#/definitions/...` references that are inconvenient for consumers requiring a standalone document.

## Goals / Non-Goals

**Goals:**

- Accept functional object and generic schemas as `compile()` inputs.
- Provide an opt-in, recursive transformation that resolves local JSON Schema references in compile output.
- Preserve current compile behaviour by default.

**Non-Goals:**

- Resolve external URI references.
- Change reference handling elsewhere in the schema or OpenAPI APIs.
- Preserve definitions when circular local references must remain resolvable.

## Decisions

- Normalize a functional schema into its JSON Schema representation before invoking the existing compilation pipeline. This reuses the package's established mapping and generic handling rather than duplicating it in `compile()`.
- Add `inlineRefs?: boolean` to compile options and apply reference inlining only after normal schema generation. This keeps the option orthogonal to input type and makes the default output backward compatible.
- Add a focused recursive resolver that supports JSON Pointer-encoded local paths and protects against circular references. After resolution, merge generated `allOf` object branches and omit definitions when no local references remain. External references remain unchanged.

## Risks / Trade-offs

- [Circular or shared references can cause unbounded expansion] → Track references being resolved and retain a reference when expanding it would recurse.
- [Inlining changes object identity and output size] → Make it opt-in and avoid mutating the normally compiled schema.
- [Functional APIs have multiple schema wrapper forms] → Cover both `s.object()` and `s.generic(...).of(...)` with regression tests.

## Migration Plan

No migration is required. Existing callers retain reference-based output; callers that need standalone schemas enable `inlineRefs: true`.

## Open Questions

- None.
