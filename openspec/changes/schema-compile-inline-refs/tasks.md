## 1. Compile input normalization

- [x] 1.1 Inspect the functional schema and existing compile paths to identify the appropriate JSON Schema normalization entry point.
- [x] 1.2 Update `compile()` and its public types to accept functional object and generic schemas while retaining class compilation behaviour.

## 2. Reference inlining

- [x] 2.1 Add the `inlineRefs` compile option and transform local references in the generated schema when enabled.
- [x] 2.2 Handle JSON Pointer escaping and circular local references without mutating default compile output.

## 3. Validation

- [x] 3.1 Add regression tests for functional object and generic schema compilation.
- [x] 3.2 Add tests for opt-in reference inlining, default output preservation, and circular-reference safety.
- [x] 3.3 Run the package test suite, lint/type checks as applicable, and `yarn api:build`.
