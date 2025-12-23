## ADDED Requirements

### Requirement: JsonSchema exposes `.merge()` to combine schema definitions

#### Scenario: Merging two JsonSchema instances

- Given two object schemas `UserBase` and `AuditFields`
- When `UserBase.merge(AuditFields)` is called
- Then the returned schema contains the union of both property maps, later definitions override earlier ones on key conflicts, and the required set becomes the union of both schemas' required keys
- And `s.infer<typeof UserBase.merge(AuditFields)>` equals `Infer<typeof UserBase> & Infer<typeof AuditFields>`

### Requirement: Documentation covers the new composition helpers

#### Scenario: Functional API guide mentions pick/omit/merge

- Given the `docs/docs/model.md` Functional API section
- When the documentation is updated
- Then it includes examples for `.pick()`, `.omit()`, and `.merge()` that describe runtime behavior and the inference guarantee so users can rely on them

### Requirement: Unit tests guard `.merge()` behavior

#### Scenario: Runtime tests

- Given the domain-level spec suite
- When new tests are added for `.merge()`
- Then they verify cloning semantics, property overrides, and required-set merging when combining two JsonSchema instances
