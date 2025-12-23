## ADDED Requirements

### Requirement: JsonSchema exposes `.pick()` to derive subset schemas

#### Scenario: Selecting a subset of object properties

- Given a `JsonSchema` built from `s.object({id: s.string().required(), email: s.string(), admin: s.boolean()})`
- When `.pick("id", "email")` is invoked
- Then a **new** `JsonSchema` instance is returned where `properties` only contains `id` and `email`, the original schema remains unchanged, and the internal required set only includes `id`
- And `s.infer<typeof subset>` resolves to `Pick<{id: string; email: string | undefined; admin: boolean | undefined}, "id" | "email">`

#### Scenario: Picking keys that are missing

- Given a `JsonSchema` with properties `id` and `email`
- When `.pick("missing")` is called
- Then it returns a schema with no properties (since nothing matched) without throwing, enabling callers to defensively chain picks

### Requirement: JsonSchema exposes `.omit()` to exclude properties

#### Scenario: Removing properties from an object schema

- Given a schema with properties `id`, `email`, and `admin`
- When `.omit("admin")` is called
- Then the returned schema excludes `admin` from its `properties`, removes it from the required set if necessary, and `s.infer<typeof schema.omit("admin")>` equals `Omit<T, "admin">`

#### Scenario: Omitting multiple keys preserves the other metadata

- Given an object schema with discriminator/vendor metadata
- When `.omit()` removes fields, non-property metadata (e.g., discriminator, additionalProperties) remains unchanged in the cloned instance

### Requirement: Type inference helpers keep `.pick()` and `.omit()` aligned with runtime behavior

#### Scenario: Functional API inference

- Given a schema built via the functional API
- When `.pick()` / `.omit()` are used before calling `s.infer()`
- Then TypeScript infers the resulting shape using the new helper types so optional/nullable unions are preserved
