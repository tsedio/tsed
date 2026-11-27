## Why

Marking a property optional could corrupt the `required` list of the generated JSON Schema in `@tsed/schema`:

- With the functional API, `s.string().optional()` (or `.required(false)`) kept only that property in `required` and dropped every other required field.
- With classes, `@Optional()` on a child could not remove a property that its parent marked `@Required()`, because the parent's `required` list is merged into the child and never filtered.

Fixed in tsedio/tsed#3501.

## What Changes

- `requiredMapper` removes an optional property (`$selfRequired === false`) from the required list instead of keeping only that property.
- `@Optional()` on a class property also marks the property schema `$selfRequired = false`, so an inherited required entry is removed.
- `requiredMapper` deletes `required` when the computed list is empty, instead of leaving an inherited list in place.

## Capabilities

### New Capabilities

- `schema-required-fields`: how `@tsed/schema` computes the `required` list for optional properties, including properties inherited from a parent class.

### Modified Capabilities

None.

## Impact

- `packages/specs/schema/src/components/mappers/default/requiredMapper.ts`
- `packages/specs/schema/src/decorators/common/optional.ts`
- No public API change. Schemas that were wrongly missing required fields, or that wrongly kept an inherited one, are now correct.
