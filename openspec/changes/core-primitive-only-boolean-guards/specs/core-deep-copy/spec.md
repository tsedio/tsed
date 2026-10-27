## ADDED Requirements

### Requirement: deepClone copies boxed primitives

`deepClone(value)` from `@tsed/core` SHALL return, for a boxed `Boolean`, `Number` or `String` object, a new object of the same type that holds the same primitive value. The copy SHALL NOT be the same reference as the source. The same SHALL apply to a boxed primitive found inside an object or an array.

#### Scenario: Boxed boolean

- **WHEN** `deepClone(new Boolean(false))` is called
- **THEN** it returns an object that is `instanceof Boolean`, whose `valueOf()` returns `false`, and that is not the source object

#### Scenario: Boxed number and string

- **WHEN** `deepClone(new Number(42))` and `deepClone(new String("a"))` are called
- **THEN** they return a `Number` object whose `valueOf()` returns `42` and a `String` object whose `valueOf()` returns `"a"`

#### Scenario: Nested boxed primitive

- **WHEN** `deepClone({flag: new Boolean(true)})` is called
- **THEN** the `flag` of the result is a `Boolean` object whose `valueOf()` returns `true`

#### Scenario: Constructors and primitives are unchanged

- **WHEN** `deepClone` is called with `Boolean`, `true` or `"a"`
- **THEN** it returns the same value

### Requirement: deepMerge treats boxed primitives as leaf values

`deepMerge(source, obj)` from `@tsed/core` SHALL return `obj` unchanged when `obj` is a boxed `Boolean`, `Number` or `String` object, like it does for primitives. It SHALL NOT throw.

#### Scenario: Boxed value overrides a primitive

- **WHEN** `deepMerge({flag: true}, {flag: new Boolean(false)})` is called
- **THEN** it does not throw, and the `flag` of the result is the given `Boolean` object, whose `valueOf()` returns `false`

#### Scenario: Boxed number and string

- **WHEN** `deepMerge({value: 1}, {value: new Number(2)})` and `deepMerge({value: "a"}, {value: new String("b")})` are called
- **THEN** the `value` of each result is the given boxed object

### Requirement: Caller behaviour is pinned by impact tests

The results of the callers of `isBoolean()` and `isPrimitive()` for `true`, `false`, `Boolean`, `new Boolean(true)` and `new Boolean(false)` SHALL be pinned by snapshot tests in each affected package (`core`, `di`, `json-mapper`, `schema`, `platform-http`, `platform-response-filter`). The guards SHALL be narrowed only once these snapshots are identical before and after the narrowing.

#### Scenario: Narrowing does not change caller results

- **WHEN** `isBoolean()` and `isPrimitive()` are narrowed to primitives only
- **THEN** every impact snapshot recorded before the change still matches
