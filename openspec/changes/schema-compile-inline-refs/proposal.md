## Why

`compile()` currently does not reliably accept schemas built through the functional API, which prevents callers from compiling reusable `s.object()` and generic schemas directly. Consumers also need a self-contained JSON Schema form when downstream tools cannot resolve local references.

## What Changes

- Extend `s.compile()` to compile functional API schema instances, including object and generic schemas.
- Add an `inlineRefs` compile option that replaces local JSON Schema references with their resolved schemas in the compiled result.
- Preserve the existing compiled output when `inlineRefs` is omitted or false.

## Capabilities

### New Capabilities

- `schema-functional-compilation`: Compile functional API schemas and optionally inline their local JSON Schema references.

### Modified Capabilities

- None.

## Impact

- `packages/specs/schema/src/fn/compile.ts` and its public option types.
- Functional API and compile test coverage in `packages/specs/schema`.
