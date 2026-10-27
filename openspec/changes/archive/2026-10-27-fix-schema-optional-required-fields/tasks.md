## 1. Implementation

- [x] 1.1 Invert the `$selfRequired === false` filter in `requiredMapper`.
- [x] 1.2 Set `$selfRequired = false` on the property schema in `@Optional()`.
- [x] 1.3 Delete `required` in `requiredMapper` when the computed list is empty.

## 2. Validation

- [x] 2.1 Add `requiredMapper.spec.ts` covering optional properties with the functional API.
- [x] 2.2 Add `optional.spec.ts` cases for inherited required properties made optional, kept required, and the only inherited one made optional.
- [x] 2.3 Run the `@tsed/schema`, `json-mapper`, `ajv`, `swagger` and `platform-params` suites, `yarn test:lint` and `yarn tsc --build`.
