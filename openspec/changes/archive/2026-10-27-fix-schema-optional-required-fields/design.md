## Context

`requiredMapper` builds the `required` list from three sources: `obj.required` (which may already hold the parent's list, merged by `inheritedClassMapper`), the schema's own required set (`getRequiredFields()`), and each property's `$selfRequired` flag. Only the functional API set that flag (`JsonSchema.required(boolean)`). `@Optional()` on a class property only removed the key from the declaring class's own required set.

## Decisions

- **Invert the filter** (`k !== key`): an optional property is removed from the list. The old `k === key` was a typo-level bug that kept only the optional key.
- **`@Optional()` sets `$selfRequired = false` on the property schema.** This reuses the existing per-property flag rather than adding a new "explicitly optional" set. Each class property has its own `JsonSchema`, so the flag does not leak to other classes. Redeclaring a property without `@Optional()` leaves the flag undefined, so the inherited required entry is kept.
- **Delete `obj.required` when the computed list is empty**, so an inherited list whose only entry became optional is not left behind.

## Risks / Trade-offs

- A schema that relied on the buggy output changes shape. This only fixes incorrect schemas, so no migration is needed.
