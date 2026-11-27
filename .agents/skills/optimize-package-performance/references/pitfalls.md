# Performance pitfalls and behaviour traps

Found while optimizing `@tsed/json-mapper` (tsedio/tsed#3486). Gains are on `serialize()` of 20 orders with a customer, 3 lines, a date and an untyped field (Node 24): 95–108 µs before, ~36 µs after.

## Patterns that cost the most

| Pattern                                                                                           | Where it was                                 | Fix                                                                         | Gain                    |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------- | ----------------------- |
| Context copied for every value (`{...options, type}`) before calling a mapper that never reads it | type mappers registered in `mapOptions()`    | call the built-in mapper directly, guarded by class and method identity     | ~-40%                   |
| Object rest per item (`mapItem(item, {id, ...options})`)                                          | `mapArray`, `mapSet`, `mapMap`               | destructure once per collection, pass `id` as an argument                   | ~-27%                   |
| `reduce` with spread (`{...acc, [key]: value}`), O(n²)                                            | `mapObject`, `mapMap`                        | plain `for` loop writing into one object                                    | -45% on untyped objects |
| Per-class result recomputed for every value (`getType()` walks `ancestorsOf()`)                   | `compile()`                                  | cache it in a `Map` keyed by class                                          | ~-15%                   |
| Registration redone on every call                                                                 | `mapOptions()` registering every type mapper | register again only when the mapper, its methods or its cache entry changed | part of the -40%        |
| `[a, b].includes(x)` in per-value code                                                            | `PrimitiveMapper`                            | `x === a \|\| x === b`                                                      | small, free             |
| Helper call instead of an inline `typeof` in per-value code                                       | `isObject()` in the primitive mappers        | keep `typeof x !== "object"`, with a comment saying why                     | ~15% when reverted      |

Measured and kept as is:

- `{...options, self: input}` once per object in the generated mappers: ~5%, and `self` is public API.
- `toISOString()` itself: inherent, ~20% of what remains.
- String-keyed dispatch in `execMapper()`: minor.

## Behaviour traps when rewriting

| Old construct                         | What it did implicitly                                                         | Test to write                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `[].concat(input).map(fn)`            | wraps a single value in an array, spreads an Array subclass into a plain array | single value given to a collection property, Array subclass mapped twice (cached type)                    |
| `array.map(fn)`                       | skips the holes of a sparse array (`fn` not called, hole kept)                 | `["a", , "b"]`: length 3, `1 in result` is false                                                          |
| `Object.entries(obj)`                 | own enumerable string keys only                                                | inherited and non-enumerable keys absent, key order kept                                                  |
| `{...acc, [key]: value}`              | defines `__proto__` as an own key                                              | `JSON.parse('{"__proto__": {...}}')` and a Map with a `__proto__` key keep the key and `Object.prototype` |
| `obj[key] = value` (the replacement)  | calls the `__proto__` setter: the key is dropped and the prototype changes     | use `Object.defineProperty` for `__proto__`                                                               |
| `fn(item, {id, ...options})` per item | removes `id` before nested calls                                               | an untyped object holding an array of models, nested in a collection: no stale item mapper id             |
| `new Date(object).toISOString()`      | ignores a `toISOString` overridden on the instance                             | call `Date.prototype.toISOString` on the instance                                                         |
| `mapper.serialize(value, ctx)`        | the mapper always receives the context                                         | a subclass or an instance whose method reads `ctx.type` still gets it                                     |
| mapper resolved on every call         | follows a mapper or method replaced or removed between two calls               | replace or remove the mapper, the method or the cache entry between two calls                             |

## Questions to ask about any fast path

1. What does the slow path give the callee that the fast path does not (context, `this`, options)? Who could read it: a subclass, a method replaced on the instance, a user mapper?
2. What can change between two calls (registry entries, instance methods, options such as `types`), and does the fast path notice it?
3. Is the guard an identity check (`===` on class and methods) rather than a shape check?
