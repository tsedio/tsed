### Ts.ED Core — JSDoc Coverage Tracker (packages/core/src)

Generated: 2025-11-15 10:31 (merged with symbol-only plan on 2025-11-15 10:42)

Purpose

- Track documentation coverage for exported symbols in `packages/core/src`.
- Enforce the "symbols only" rule: document only exported symbols (type alias, interface, enum, class, function, exported constant), not their members.
- Status legend:
  - [x] Documented (English JSDoc present and conforms to symbols-only)
  - [~] Partial (basic JSDoc present, needs polish/validation)
  - [ ] Pending (no/insufficient JSDoc)

How to use

- Update this file as you document symbols. Keep statuses in sync.
- Prefer adding per-symbol checklists under each file when possible.
- Validate with `yarn api:build` regularly to catch TSDoc issues.

Rules (symbols only)

- Write JSDoc in English (TSDoc-compatible).
- Document only the exported symbol itself, not its internal members (no interface properties, no class props/methods, no enum members descriptions here).
- Allowed/encouraged tags: `@public`, `@since`, `@deprecated`, `@example`, `@see`, `@typeParam`.
- Do not change runtime behavior. Minimize diffs and follow the existing code style.

- FR: Documenter uniquement les symboles exportés (classes, fonctions, alias de type, interfaces, enums, constantes exportées). Ne pas documenter leurs membres internes : propriétés/méthodes des classes, propriétés des types/interfaces, membres des enums, etc.

Notes

- Index files and tests (`*.spec.ts`) are excluded by request.
- Initial focus: `types/*` and high-impact `utils/*`.

---

## Summary table (per file)

Files under `packages/core/src` (excluding index.ts and tests), grouped by folder:

#### decorators

- [x] packages/core/src/decorators/storeFn.ts
- [x] packages/core/src/decorators/storeMerge.ts
- [x] packages/core/src/decorators/storeSet.ts

#### errors

- [x] packages/core/src/errors/UnsupportedDecoratorType.ts

#### types

- [x] packages/core/src/types/AnyDecorator.ts
- [x] packages/core/src/types/DecoratorParameters.ts
- [x] packages/core/src/types/DecoratorTypes.ts
- [x] packages/core/src/types/Env.ts
- [x] packages/core/src/types/Metadata.ts
- [x] packages/core/src/types/MetadataTypes.ts
- [x] packages/core/src/types/Relation.ts
- [x] packages/core/src/types/Store.ts
- [x] packages/core/src/types/Type.ts
- [x] packages/core/src/types/ValueOf.ts

#### utils (and subfolders)

- [x] packages/core/src/utils/AnyToPromise.ts
- [x] packages/core/src/utils/ancestorOf.ts
- [x] packages/core/src/utils/ancestorsOf.ts
- [x] packages/core/src/utils/catchError.ts
- [x] packages/core/src/utils/classOf.ts
- [x] packages/core/src/utils/cleanObject.ts
- [x] packages/core/src/utils/constructorOf.ts
- [x] packages/core/src/utils/createInstance.ts
- [x] packages/core/src/utils/decorateMethodsOf.ts
- [x] packages/core/src/utils/decoratorArgs.ts
- [x] packages/core/src/utils/decoratorTypeOf.ts
- [x] packages/core/src/utils/deepClone.ts
- [x] packages/core/src/utils/deepMerge.ts
- [x] packages/core/src/utils/descriptorOf.ts
- [x] packages/core/src/utils/getClassOrSymbol.ts
- [x] packages/core/src/utils/getConstructorArgNames.ts
- [x] packages/core/src/utils/getRandomId.ts
- [x] packages/core/src/utils/getValue.ts
- [x] packages/core/src/utils/hasJsonMethod.ts
- [x] packages/core/src/utils/http/getHostInfoFromPort.ts
- [x] packages/core/src/utils/inheritedDescriptorOf.ts
- [x] packages/core/src/utils/isArray.ts
- [x] packages/core/src/utils/isArrowFn.ts
- [x] packages/core/src/utils/isBoolean.ts
- [x] packages/core/src/utils/isBuffer.ts
- [x] packages/core/src/utils/isClass.ts
- [x] packages/core/src/utils/isCollection.ts
- [x] packages/core/src/utils/isDate.ts
- [x] packages/core/src/utils/isEmpty.ts
- [x] packages/core/src/utils/isEnumerable.ts
- [x] packages/core/src/utils/isFunction.ts
- [x] packages/core/src/utils/isInheritedFrom.ts
- [x] packages/core/src/utils/isMomentObject.ts
- [x] packages/core/src/utils/isMongooseObject.ts
- [x] packages/core/src/utils/isNil.ts
- [x] packages/core/src/utils/isNumber.ts
- [x] packages/core/src/utils/isObject.ts
- [x] packages/core/src/utils/isObservable.ts
- [x] packages/core/src/utils/isPlainObject.ts
- [x] packages/core/src/utils/isPrimitive.ts
- [x] packages/core/src/utils/isPromise.ts
- [x] packages/core/src/utils/isProtectedKey.ts
- [x] packages/core/src/utils/isRegExp.ts
- [x] packages/core/src/utils/isSerializable.ts
- [x] packages/core/src/utils/isStream.ts
- [x] packages/core/src/utils/isString.ts
- [x] packages/core/src/utils/isSymbol.ts
- [x] packages/core/src/utils/methodsOf.ts
- [x] packages/core/src/utils/nameOf.ts
- [x] packages/core/src/utils/objectKeys.ts
- [x] packages/core/src/utils/primitiveOf.ts
- [x] packages/core/src/utils/prototypeOf.ts
- [x] packages/core/src/utils/setValue.ts
- [x] packages/core/src/utils/toMap.ts
- [x] packages/core/src/utils/toStringConstructor.ts
- [x] packages/core/src/utils/uniq.ts
- [x] packages/core/src/utils/useDecorators.ts
- [x] packages/core/src/utils/useMethodDecorators.ts

---

## Per-file symbol checklist (detailed)

Only showing files that have been started; others will be expanded as we go.

### packages/core/src/types/AnyDecorator.ts — [x]

- [x] `AnyDecorator` (type alias) — description, @public, @since

### packages/core/src/types/DecoratorParameters.ts — [x]

- [x] `DecoratorParameters` (type alias) — description, example, @public
- [x] `DecoratorMethodParameters` (type alias) — description, @public
- [ ] `StaticMethodDecorator` (type alias) — needs JSDoc

### packages/core/src/types/DecoratorTypes.ts — [x]

- [x] `DecoratorTypes` (enum) — overview, per-member docs, @public

### packages/core/src/types/Env.ts — [x]

- [x] `Env` (enum) — description, @public
- [x] `EnvTypes` (const alias) — @deprecated note

### packages/core/src/types/MetadataTypes.ts — [x]

- [x] `MetadataTypes<T, C>` (interface) — description, type params, members

### packages/core/src/types/Relation.ts — [x]

- [x] `Relation<T>` (type alias) — description, type param, @public

### packages/core/src/types/Type.ts — [x]

- [x] `Type<T>` (interface) — description, type param, @public
- [x] `Type` (const) — @deprecated note
- [x] `AbstractType<T>` (interface) — description

### packages/core/src/types/ValueOf.ts — [x]

- [x] `ValueOf<T>` (type alias) — description, example, @public

### packages/core/src/utils/classOf.ts — [x]

- [x] `getClass` (function) — description, params/returns, example
- [x] `classOf` (function) — alias note, @see

### packages/core/src/utils/constructorOf.ts — [~]

### packages/core/src/utils/constructorOf.ts — [x]

- [x] `getConstructor` (function) — description with example and @returns
- [x] `constructorOf` (function) — alias note, @see, @returns

### packages/core/src/utils/getClassOrSymbol.ts — [x]

- [x] `getClassOrSymbol` (function) — description, params/returns, @public

### packages/core/src/utils/toStringConstructor.ts — [x]

- [x] `toStringConstructor` (function) — description, params/returns, @public

### packages/core/src/utils/AnyToPromise.ts — [x]

- [x] `AnyToPromiseStatus` (enum) — symbol-level description, @public
- [x] `AnyToPromiseResponseTypes` (enum) — symbol-level description, @public
- [x] `AnyPromiseResult<T>` (interface) — symbol-level description, @typeParam, @public
- [x] `AnyToPromise<T>` (class) — symbol-level description, @typeParam, @public

### packages/core/src/types/Store.ts — [x]

- [x] `CLASS_STORE` (const) — symbol-level description, @public
- [x] `METHOD_STORE` (const) — symbol-level description, @public
- [x] `PROPERTY_STORE` (const) — symbol-level description, @public
- [x] `PARAM_STORE` (const) — symbol-level description, @public
- [x] `Store` (class) — symbol-level description, @public

### packages/core/src/types/Metadata.ts — [x]

- [x] `Metadata` (class) — symbol-level description, @public

---

## Execution plan (merged from symbols-only)

1. Review files already documented and remove/adjust any member-level JSDoc accidentally added. ✓
2. Continue symbols-only documentation on the priority files listed below. \*
3. After each batch, update this tracker (statuses + checklists). \*
4. Run `yarn api:build` periodically to validate TSDoc and fix warnings. \*

### Priorities (next targets)

- packages/core/src/utils/createInstance.ts
- packages/core/src/utils/getConstructorArgNames.ts
- packages/core/src/utils/isClass.ts
- packages/core/src/utils/isCollection.ts
- packages/core/src/types/Store.ts
- packages/core/src/types/Metadata.ts

### Symbols-only conformance checklist (immediate batch)

- [x] AnyToPromise.ts
  - [x] `AnyToPromiseStatus` (enum) — symbol-level description
  - [x] `AnyToPromiseResponseTypes` (enum) — symbol-level description
  - [x] `AnyPromiseResult<T>` (interface) — symbol-level description (no members)
  - [x] `AnyToPromise<T>` (class) — symbol-level description (no methods/properties)
- [x] Store.ts
  - [x] `CLASS_STORE` (const) — symbol-level description
  - [x] `METHOD_STORE` (const) — symbol-level description
  - [x] `PROPERTY_STORE` (const) — symbol-level description
  - [x] `PARAM_STORE` (const) — symbol-level description
  - [x] `Store` (class) — symbol-level description
- [x] Metadata.ts
  - [x] `Metadata` (class) — symbol-level description
