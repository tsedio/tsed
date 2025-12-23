# Design: JsonSchema object transform helpers

## Runtime API design

### Schema immutability expectations

- Callers expect fluent helpers (e.g., `.required()`, `.nullable()`) to return new schema instances when they materially change the type parameter.
- `pick`, `omit`, and `merge` will therefore clone the current schema (`this.clone()`) before mutating property maps so existing references are not edited unexpectedly.
- Cloning preserves vendor metadata, aliases, discriminator flags, and collection state automatically because the constructor already copies these aspects.

### `pick(...keys)`

1. Normalize the requested keys (`string | string[]` or an array literal passed as the first argument) into a `Set` for lookup.
2. Read the current `properties` map (default `{}`) and filter to entries whose keys exist in the set.
3. Clone the schema, overwrite its `properties` map with the filtered object, and update its internal `#required` set to only include retained keys.
4. Leave non-property keywords untouched (patternProperties, additionalProperties, vendor keys, etc.).
5. Return the cloned schema typed as `JsonSchema<SchemaPick<T, Keys>>`.

### `omit(...keys)`

1. Normalize keys to a `Set` as above, supporting both varargs and `string[]` inputs (e.g., `schema.omit([\"a\", \"b\"])`).
2. Filter the current `properties` map by excluding the specified keys.
3. Clone, replace its `properties` map, and drop each omitted key from the `#required` set.
4. Return the clone typed as `JsonSchema<SchemaOmit<T, Keys>>`.

### `merge(source)`

- Accept either another `JsonSchema<any>` instance or a plain property bag (`Record<string, AnyJsonSchema>`). Optionally allow chaining `merge(schema, bag)` by supporting rest parameters or repeated invocation; initial design sticks to a single argument per call so consumers can chain.
- Convert the incoming payload into a normalized `Record<string, JsonSchema>` using the existing `mapToJsonSchema` helper for each property.
- When merging another `JsonSchema`, derive the property bag from `source.get('properties') ?? {}` and union the `#required` set.
- Combine property objects with later definitions overriding earlier ones when keys collide.
- For nested properties referenced across both schemas, prefer the incoming schema instance so developers can reuse previously-configured chains.
- Keep other keywords (`additionalProperties`, `patternProperties`, `vendor keys`) untouched during an object-property merge; this keeps the first iteration simple and is consistent with the guardrail to add complexity only when required.
- Return a clone typed as `JsonSchema<SchemaMerge<T, U>>` where `U` resolves to either `Infer<S>` (when merging another schema) or `PropsToShape<P>` for raw property bags.

## Type operations

To keep `s.infer()` accurate, introduce helper types inside `domain/types.ts`:

- `ObjectShape<T>` → extracts the object-like part of `T` (`Extract<T, Record<string, any>>`).
- `SchemaPick<T, K>` → if `ObjectShape<T>` is not `never`, return `Pick<ObjectShape<T>, K> & Exclude<T, ObjectShape<T>>` to preserve unions with `null`/`undefined` where relevant.
- `SchemaOmit<T, K>` → similar but using `Omit`.
- `SchemaMerge<T, U>` → merges two shapes via intersection on their object portions while preserving any non-object unions from either side.
  These helpers will back the method signatures:

```ts
pick<K extends PropertyKey[]>(...keys: K): JsonSchema<SchemaPick<T, K[number]>>;
omit<K extends PropertyKey[]>(...keys: K): JsonSchema<SchemaOmit<T, K[number]>>;
merge<S extends JsonSchema<any>>(other: S): JsonSchema<SchemaMerge<T, Infer<S>>>;
merge<P extends Record<string, JsonSchema<any>>>(properties: P): JsonSchema<SchemaMerge<T, PropsToShape<P>>>;
```

The overloads keep existing call sites type-safe while ensuring inference works for `s.object({...}).pick("id")` and for merging separate schema builders.

## Testing strategy

1. **Runtime specs (`JsonSchema.spec.ts`):**
   - Verify `.pick()` returns new schema instances, filters properties, and keeps the original untouched.
   - Verify `.omit()` removes specified keys and updates `required` metadata.
   - Verify `.merge()` can combine two plain property bags and two `JsonSchema` instances, with property overrides behaving predictably.
2. **Functional typing specs (`fn/typing.spec.ts`):**
   - Add cases that call `pick`, `omit`, and `merge` (schema-schema and schema-object) to confirm `s.infer()` resolves to the expected types via `expectTypeOf`.
3. **Coverage of edge cases:** include at least one pick/omit scenario on optional + nullable fields so we confirm the type helper preserves unions with `undefined`/`null`.

## Documentation updates

- Extend the Functional API section in `docs/docs/model.md` with a new subsection (e.g., “Composing object schemas”) describing `pick`, `omit`, and `merge`.
- Provide concise TypeScript examples demonstrating chaining and confirming `s.infer()` compatibility.
- Mention any limitations (e.g., keys must correspond to defined properties, pattern properties untouched).

## Open Questions

- Should `.merge()` also merge other JSON Schema keywords (e.g., `oneOf`, `additionalProperties`)? For this iteration we leave them unchanged; follow-up work can expand scope if needed.
- The helper accepts plain objects but not arbitrary JSON Schema fragments; if future requirements demand merging pattern properties or metadata, we may revisit.
