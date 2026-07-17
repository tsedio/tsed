## ADDED Requirements

### Requirement: Compile functional API schemas

The schema package SHALL allow `compile()` to accept schemas created by the functional API, including object schemas and generic schemas with an `of()` type, and return their generated JSON Schema.

#### Scenario: Compile an object schema

- **WHEN** a caller passes an `s.object(...)` schema to `compile()`
- **THEN** the result represents that object's declared properties and constraints without throwing

#### Scenario: Compile a generic schema

- **WHEN** a caller passes a generic functional schema such as `s.generic(ListKnowledgeSearchResult).of(ScenarioVectorMatch)` to `compile()`
- **THEN** the result includes the generic schema with the resolved item type without throwing

### Requirement: Inline local references in compile output

The schema package SHALL support an `inlineRefs` compile option that replaces resolvable local JSON Schema references in the returned schema with the schemas they reference.

#### Scenario: Inline references on request

- **WHEN** a caller invokes `compile()` with `{inlineRefs: true}` and the generated schema contains local references
- **THEN** the returned schema contains the referenced schema content at each resolvable reference site

#### Scenario: Preserve default reference output

- **WHEN** a caller invokes `compile()` without `inlineRefs`
- **THEN** the returned schema preserves the existing reference-based output

#### Scenario: Preserve circular references

- **WHEN** inlining encounters a circular local reference
- **THEN** compilation completes without unbounded recursion and retains a reference at the circular edge
