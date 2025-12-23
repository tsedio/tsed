1. Extend `JsonSchema<T>` with `pick`, `omit`, and `merge` runtime helpers (including shared utility functions for property filtering) without yet touching consumers.
2. Introduce the supporting type helpers in `domain/types.ts` and annotate the new methods so `s.infer()` understands the transformed shapes.
3. Add runtime coverage in `packages/specs/schema/src/domain/JsonSchema.spec.ts` to verify property filtering, required-field behavior, and schema immutability for the new helpers.
4. Extend `packages/specs/schema/src/fn/typing.spec.ts` with inference-focused tests covering pick/omit/merge flows (schema-schema + schema-object merge).
5. Update `docs/docs/model.md` to document the new helpers with Functional API examples and call out inference guarantees.
6. Validation: run the relevant package tests (`yarn test:specs` or targeted Vitest command) to ensure new specs pass.
