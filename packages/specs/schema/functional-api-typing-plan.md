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

Introduce a phantom-typed wrapper that overlays the existing `JsonSchema` at type level only. We avoid changing runtime classes and instead leverage declaration merging and type aliases.

### 1) Phantom Schema Type (rename to avoid @Schema decorator)

- Define a generic alias `SchemaShape<T>` representing a `JsonSchema` with a phantom generic `T`.
- Implementation: purely type-level; at runtime it’s still a `JsonSchema` instance.

```ts
// packages/specs/schema/src/fn/types.ts
export type SchemaShape<T> = JsonSchema & {readonly __tsed_infer?: T};
```

Rationale: This keeps the runtime object identical to today’s `JsonSchema`, while giving us carry-forward typing across builder chains. We avoid any naming conflict with the existing `@Schema()` decorator and `Schema` symbol by using `SchemaShape<T>`.

### 2) Infer Utility (s.infer)

- Provide an `infer<S>` type that extracts `T` from `SchemaShape<T>`.
- Expose it under the `s` namespace as `s.infer<...>` using declaration merging (`export namespace s { export type infer<...> = ... }`). Also export from package root for convenience.

```ts
export type Infer<S> = S extends {readonly __tsed_infer?: infer T} ? T : never;

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

Update the type signatures of the functional builders to return `SchemaShape<T>` rather than bare `JsonSchema`. Key builders:

- Primitives: `string() -> SchemaShape<string>`, `number() -> SchemaShape<number>`, `integer() -> SchemaShape<number>`, `boolean() -> SchemaShape<boolean>`
- Dates: `date() -> SchemaShape<Date>`, `datetime() -> SchemaShape<Date>`, `time() -> SchemaShape<Date>` (inferred as Date by default to align with @tsed/json-mapper)
- Collections: `array(item: SchemaShape<I>) -> SchemaShape<I[]>`, `set(item: SchemaShape<I>) -> SchemaShape<Set<I>>`, `map(value: SchemaShape<V>) -> SchemaShape<Record<string, V>>`
- Object: `object(props: { [K in string]: SchemaShape<any> }) -> SchemaShape<{ [K in keyof props]: Infer<props[K]> }>`
- Enums: `enums(["A","B"]) -> SchemaShape<"A" | "B">` and `enums(enumObj) -> SchemaShape<EnumType>`
- Unions: `oneOf([S1, S2]) -> SchemaShape<Infer<S1> | Infer<S2>>`, `anyOf` similarly
- Intersections: `allOf([S1, S2]) -> SchemaShape<Infer<S1> & Infer<S2>>`
- Lazy refs: `lazyRef(() => Class) -> SchemaShape<InstanceType<typeof Class>>`

Notes:

- All definitions remain runtime-compatible and internally still build `JsonSchema`.
- Overloads may be necessary to support both array-of-schemas and variadic signatures.

### 4) Typed Method Chaining on JsonSchema

Many instance methods exist on `JsonSchema` (e.g., `optional`, `nullable`, `default`, `minLength`, etc.). We should type a subset that affects the resulting inferred type:

- `optional()`: transforms `T` to `T | undefined` and toggles required=false on the property.
- `nullable()`: transforms `T` to `T | null` and sets `nullable=true`.
- `default(value: T)`: doc-only; it DOES NOT change the type `T`.
- `required()`: removes `undefined` from type on object property usage.
- `.nullish()` (optional): shorthand for `T | null | undefined`.

Implementation approach:

- We can define intersection augmentation types via declaration merging on `JsonSchema` return type, but since `JsonSchema` is a class, we will annotate the functional builder return as `SchemaShape<T> & JsonSchema` and model chainers with generics that transform `T` at type level.
- Where direct augmentation on the class is noisy, provide helper interface that the return type implements at compile time only.

Example type-level augmentation (no runtime changes):

```ts
export interface TypedChain<T> {
  optional(): SchemaShape<T | undefined>;
  nullable(): SchemaShape<T | null>;
  default(value: T): SchemaShape<T>; // doc-only, no type change
  required(): SchemaShape<NonNullable<T>>;
}
```

Return type for builders becomes `SchemaShape<T> & JsonSchema & TypedChain<T>`.

### 5) Object Properties Typing

- `object({...})` should accept `SchemaShape` values and infer the resulting TypeScript type.
- Add a helper `PropsToShape<P>` mapping from builder map to a TS type:

```ts
type PropsToShape<P extends Record<string, SchemaShape<any>>> = {
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

- `from(Ctor)` should produce `SchemaShape<InstanceType<Ctor>>` when `Ctor` is a class.
- For primitives passed (String, Number, Boolean), map to their primitive types.

### 8) Public Exports and `s` Namespace

- Extend `s` in `fn/index.ts` with a declaration-merged namespace to expose `type infer<S>`; also export `Infer` and `SchemaShape` from the package root (`src/index.ts`).

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
- Builders now return a value that is both `JsonSchema` at runtime and carries a `SchemaShape<T>` phantom type at compile time.
- No change in emitted JSON Schema or OpenAPI.

### 12) Implementation Steps

Additional builder: any()

- Behavior: `any()` with no arguments => `SchemaShape<any>`; `any(S1, S2, ...)` where each Si is a SchemaShape => `SchemaShape<[Infer<S1>, Infer<S2>, ...]>` (tuple of provided types). It is also exposed on `s.any`.
- Rationale: matches Ts.ED’s current JSON mapper use-cases for a variadic any() that describes a fixed tuple of allowed types at the type level while preserving runtime behavior.

1. Introduce `types.ts` under `fn/` exporting `SchemaShape<T>`, `Infer`, and `namespace s { type infer<...> }` via declaration merging.
2. Update each builder’s TypeScript signature to return `SchemaShape<T> & JsonSchema & TypedChain<T>`.
3. Add `TypedChain<T>` interface with method signatures that transform `T` at type level; no runtime changes needed (methods already exist on `JsonSchema`).
4. Update `object()` typings to infer property shape via `PropsToShape`.
5. Add typings to `from()` to map classes and primitives to correct `T`.
6. Extend exports in `fn/index.ts` and `src/index.ts` to re-export `SchemaShape`, `Infer`, and enable `s.infer`.
7. Add type-level tests under `packages/specs/schema/src/fn/__tests__/typing.spec.ts` (or a dedicated directory) using Vitest with `// @ts-expect-error`.
8. Update docs and examples.

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
