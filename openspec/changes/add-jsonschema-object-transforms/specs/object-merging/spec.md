## ADDED Requirements

### Requirement: JsonSchema exposes `.merge()` to combine property definitions

#### Scenario: Merging with another JsonSchema instance

- Given two object schemas `UserBase` and `AuditFields`
- When `UserBase.merge(AuditFields)` is called
- Then the returned schema contains the union of both property maps, later definitions override earlier ones on key conflicts, and the required set becomes the union of both schemas' required keys
- And `s.infer<typeof UserBase.merge(AuditFields)>` equals `Infer<typeof UserBase> & Infer<typeof AuditFields>`

#### Scenario: Merging with a plain property bag

- Given a schema and a literal object `{createdAt: s.date(), flags: s.object({...})}`
- When `.merge({createdAt: ..., flags: ...})` is invoked
- Then incoming values are converted via `mapToJsonSchema`, added to the properties map, and inference matches `T & PropsToShape<typeof bag>`

### Requirement: Documentation covers the new composition helpers

#### Scenario: Functional API guide mentions pick/omit/merge

- Given the `docs/docs/model.md` Functional API section
- When the documentation is updated
- Then it includes examples for `.pick()`, `.omit()`, and `.merge()` that describe runtime behavior and the inference guarantee so users can rely on them

### Requirement: Unit tests guard `.merge()` behavior

#### Scenario: Runtime tests

- Given the domain-level spec suite
- When new tests are added for `.merge()`
- Then they verify cloning semantics, property overrides, and required-set merging for both schema-schema and schema-object cases
