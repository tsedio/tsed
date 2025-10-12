# Ts.ED Schema Functional API — Typed Inference Plan (Zod-like)

Status: Proposal/Plan
Owner: @tsed/schema
Last updated: 2025-10-11

## Goals

- Provide strong TypeScript inference for the Functional API under `@tsed/schema/src/fn`, similar to Zod.
- Preserve current runtime behavior and JSON Schema generation.
- Keep backward compatibility for existing call sites (decorators and functional builders).
- Offer a simple type-level utility to derive a TypeScript type from a schema (like `z.infer`).

## Non-Goals

- No changes to runtime logic of `JsonSchema` and mappers unless strictly needed for typing.
- No breaking changes to decorator-based API.

---

## High-level Design

Leverage the new generic `JsonSchema<T>` as the single source of truth for type inference. We no longer need a separate phantom wrapper type. All functional builders will return `JsonSchema<T>` directly and chaining methods will transform `T` via their generic signatures.

### 1) JsonSchema<T> as carrier of the inferred type

- `JsonSchema` is now generic: `class JsonSchema<T = any> { ... }`. The generic `T` carries the inferred TypeScript type across builder chains.
- No runtime changes are necessary; the generic only exists at compile time.

Rationale: By placing the generic on `JsonSchema` itself, we simplify the type surface, avoid wrapper aliases, and reduce conflicts with existing decorators like `@Schema()`.

### 2) Infer Utility (s.infer)

- Provide an `infer<S>` helper that extracts the `T` from `JsonSchema<T>`.
- Expose it under the `s` namespace as `s.infer<...>` using declaration merging. Also export from the package root for convenience.

```ts
// Helper to extract the generic parameter
export type Infer<S> = S extends JsonSchema<infer T> ? T : never;

// Re-export as s.infer via namespace merging
export namespace s {
  export type infer<S> = Infer<S>;
}
```

Usage:

```ts
const user = s.object({name: s.string(), age: s.number().minimum(0)});
type User = s.infer<typeof user>; // { name: string; age: number }
```

### 3) Typed Builder Signatures

Note on time(): time-of-day values are mapped to Date by default (not string) to align with @tsed/json-mapper’s default behavior. This can be made configurable in a future phase.

Update the type signatures of the functional builders to return `JsonSchema<T>` directly. Key builders:

- Primitives: `string() -> JsonSchema<string>`, `number() -> JsonSchema<number>`, `integer() -> JsonSchema<number>`, `boolean() -> JsonSchema<boolean>`
- Dates: `date() -> JsonSchema<Date>`, `datetime() -> JsonSchema<Date>`, `time() -> JsonSchema<Date>` (inferred as Date by default to align with @tsed/json-mapper)
- Collections: `array(item: JsonSchema<I>) -> JsonSchema<I[]>`, `set(item: JsonSchema<I>) -> JsonSchema<Set<I>>`, `map(value: JsonSchema<V>) -> JsonSchema<Record<string, V>>`
- Object: `object(props: { [K in string]: JsonSchema<any> }) -> JsonSchema<{ [K in keyof props]: Infer<props[K]> }>`
- Enums: `enums(["A","B"]) -> JsonSchema<"A" | "B">` and `enums(enumObj) -> JsonSchema<EnumType>`
- Unions: `oneOf([S1, S2]) -> JsonSchema<Infer<S1> | Infer<S2>>`, `anyOf` similarly
- Intersections: `allOf([S1, S2]) -> JsonSchema<Infer<S1> & Infer<S2>>`
- Lazy refs: `lazyRef(() => Class) -> JsonSchema<InstanceType<typeof Class>>`

Notes:

- All definitions remain runtime-compatible and internally still build `JsonSchema`.
- Overloads may be necessary to support both array-of-schemas and variadic signatures.

### 4) Typed Method Chaining on JsonSchema

Many instance methods exist on `JsonSchema<T>` (e.g., `optional`, `nullable`, `default`, `minLength`, etc.). We will type the subset that affects the resulting inferred type via generic method signatures on `JsonSchema<T>` itself:

- `optional(): JsonSchema<T | undefined>` — marks property as optional (required=false) and adds `undefined` to `T`.
- `nullable(value?: boolean): JsonSchema<T | null>` — sets `nullable=true` and adds `null` to `T`.
- `default(value: T | (() => T)): JsonSchema<T>` — documentation-only; DOES NOT change the type `T`.
- `required(): JsonSchema<Exclude<T, undefined>>` and `required(false): JsonSchema<T | undefined>` — toggles required at type level accordingly.

Implementation approach:

- Since `JsonSchema` is generic, its instance methods can be declared with generic-aware return types. No wrapper interface is needed.
- Non-type-affecting methods (format, minLength, etc.) keep returning `JsonSchema<T>`.

### 5) Object Properties Typing

- `object({...})` should accept `JsonSchema` values and infer the resulting TypeScript type.
- Add a helper `PropsToShape<P>` mapping from builder map to a TS type:

```ts
type PropsToShape<P extends Record<string, JsonSchema<any>>> = {
  [K in keyof P]: Infer<P[K]>;
};
```

- For optional properties via `.optional()`, `Infer` already carries `| undefined` which object typing will reflect.

### 6) Narrowing via JSON Keywords (Optional Phase II)

- Certain keywords could refine types, but we will keep Phase I simple:
  - `minLength`, `maxLength`: do not narrow `string`.
  - `minimum`, `maximum`, `multipleOf`: do not narrow `number`.
- Leave a roadmap for literal/default inference improvements (e.g., `.const("x")` -> type `"x"`).

### 7) Types for `from()`

- `from(Ctor)` should produce `JsonSchema<InstanceType<Ctor>>` when `Ctor` is a class.
- For primitives passed (String, Number, Boolean), map to their primitive types.

### 8) Public Exports and `s` Namespace

- Extend `s` in `fn/index.ts` with a declaration-merged namespace to expose `type infer<S>`; also export `Infer` from the package root (`src/index.ts`). No separate `SchemaShape` export is required anymore.

### 9) Type Tests (no runtime)

Add `.dts.spec.ts` style tests using Vitest’s type tests (or `@tsd` style) to validate inference without executing code:

- `object` with required/optional/nullable/default.
- `array/map/set` element typing (ensure `set()` infers `Set<T>`).
- `oneOf/anyOf/allOf` unions and intersections.
- `enums` literal unions.
- `from(Class)` yields instance type.

Use `// @ts-expect-error` to ensure invalid compositions are caught.

### 10) Docs

- Update docs with a new page: “Functional API with Type Inference”.
- Show side-by-side examples vs Zod (`s.string().optional()` etc.).
- Document `s.infer` (lowercase) and ensure discoverability from `s` namespace.

### 11) Migration & Compatibility

- The change is additive: existing code using `JsonSchema` continues to work.
- Builders now return `JsonSchema<T>` directly; the inferred type is carried by the generic parameter.
- No change in emitted JSON Schema or OpenAPI.

### 12) Implementation Steps

Additional builder: any()

- Behavior: `any()` with no arguments => `JsonSchema<any>`; `any(S1, S2, ...)` where each Si is a `JsonSchema` => `JsonSchema<[Infer<S1>, Infer<S2>, ...]>` (tuple of provided types). It is also exposed on `s.any`.
- Rationale: matches Ts.ED’s current JSON mapper use-cases for a variadic any() that describes a fixed tuple of allowed types at the type level while preserving runtime behavior.

1. Ensure `Infer` type extracts the generic from `JsonSchema<T>` and expose it as `s.infer` via namespace merging.
2. Verify each builder’s TypeScript signature returns `JsonSchema<T>` with correct generic, leveraging the new `JsonSchema<T>`.
3. Ensure `JsonSchema` chainers (`optional`, `nullable`, `default`, `required`) have generic-aware return types that transform `T` as specified; `default()` remains doc-only.
4. Keep `object()` typings using `PropsToShape` to infer property shapes from `JsonSchema` props.
5. Confirm `from()` typings map classes and primitives to the correct `T`.
6. Public exports: expose `Infer` and `s.infer`; no separate wrapper type export needed.
7. Maintain and extend type-level tests in `packages/specs/schema/src/fn/typing.spec.ts` to cover all scenarios.
8. Update docs and examples to reflect `JsonSchema<T>` as the carrier type and `s.infer` usage.

### 13) Decisions Applied (resolving previous open questions)

- `set()` MUST infer `Set<T>`.
- `.default()` is documentation-only for Swagger/JSON Schema and DOES NOT affect runtime behavior or TypeScript types.
- `date()` and `datetime()` infer `Date` by default because `@tsed/json-mapper` performs conversion. We will document an extension point to let devs override the inferred type (e.g., Moment) in a future phase; not part of MVP.

### 14) Roadmap (Phase II/III)

- Provide a configurable/global override for the inferred date type (e.g., via module augmentation or a generic parameter on a central type like `SchemaDate<TDate = Date>`), keeping default as `Date`.
- Literal narrowing for `.const()` and `.enum()` to preserve literal types.
- Key-level transforms: `.readOnly()`/`.writeOnly()` do not affect `T` (doc-only).
- Better branded primitives (e.g., email/uri/url as branded `string & { __brand: "email" }`).
- Deep partial helpers: `s.object(props).partial()` -> recursively optional shape (new helper or use existing decorator `partial`).

---

## Example

```ts
import {s} from "@tsed/schema";

const UserSchema = s.object({
  id: s.string().uuid().required(),
  email: s.email().optional(),
  age: s.number().minimum(0).optional(),
  roles: s.array(s.string()).default([]),
  profile: s.object({
    firstName: s.string(),
    lastName: s.string().optional()
  })
});

type User = s.infer<typeof UserSchema>;
// type User = {
//   id: string;
//   email?: string | undefined;
//   age?: number | undefined;
//   roles: string[];
//   profile: { firstName: string; lastName?: string | undefined };
// }
```
