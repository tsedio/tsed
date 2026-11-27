## ADDED Requirements

### Requirement: isBoolean accepts only boolean primitives

`isBoolean(value)` from `@tsed/core` SHALL return `true` if and only if `typeof value === "boolean"`. It SHALL return `false` for the `Boolean` constructor, for boxed `new Boolean(x)` objects, and for every other value.

#### Scenario: Boolean primitives

- **WHEN** `isBoolean(true)` and `isBoolean(false)` are called
- **THEN** both return `true`

#### Scenario: Boolean constructor

- **WHEN** `isBoolean(Boolean)` is called
- **THEN** it returns `false`

#### Scenario: Boxed boolean

- **WHEN** `isBoolean(new Boolean(true))` and `isBoolean(new Boolean(false))` are called
- **THEN** both return `false`

#### Scenario: Non-boolean values

- **WHEN** `isBoolean` is called with `"true"`, `1`, `0`, `null`, `undefined`, `{}` or `[]`
- **THEN** it returns `false` for each

### Requirement: isBooleanOrBooleanClass keeps accepting the constructor and boxed values

`isBooleanOrBooleanClass(value)` SHALL return `true` for boolean primitives, for the `Boolean` constructor and for boxed `new Boolean(x)` objects, and `false` otherwise.

#### Scenario: Constructor and boxed values

- **WHEN** `isBooleanOrBooleanClass` is called with `true`, `Boolean` or `new Boolean(false)`
- **THEN** it returns `true` for each

#### Scenario: Other values

- **WHEN** `isBooleanOrBooleanClass` is called with `"true"`, `1` or `String`
- **THEN** it returns `false` for each

### Requirement: isPrimitive accepts only string, number and boolean primitives

`isPrimitive(value)` SHALL return `true` if and only if `typeof value` is `"string"`, `"number"` or `"boolean"`. It SHALL return `false` for the `String`, `Number` and `Boolean` constructors and for their boxed objects.

#### Scenario: Primitive values

- **WHEN** `isPrimitive` is called with `""`, `"text"`, `0`, `NaN`, `42`, `true` or `false`
- **THEN** it returns `true` for each

#### Scenario: Primitive constructors

- **WHEN** `isPrimitive` is called with `String`, `Number` or `Boolean`
- **THEN** it returns `false` for each

#### Scenario: Boxed primitives

- **WHEN** `isPrimitive` is called with `new String("a")`, `new Number(1)` or `new Boolean(false)`
- **THEN** it returns `false` for each

#### Scenario: Non-primitive values

- **WHEN** `isPrimitive` is called with `null`, `undefined`, a symbol, a bigint, `{}`, `[]`, a `Date` or a class
- **THEN** it returns `false` for each

### Requirement: isPrimitiveOrPrimitiveClass keeps accepting constructors and boxed values

`isPrimitiveOrPrimitiveClass(value)` SHALL return `true` for string, number and boolean primitives, for the `String`, `Number` and `Boolean` constructors and for their boxed objects, and `false` otherwise. Guards that build on it, such as `isClass()`, SHALL keep their current results.

#### Scenario: Constructors and boxed values

- **WHEN** `isPrimitiveOrPrimitiveClass` is called with `Boolean`, `new Boolean(false)`, `String` or `new Number(1)`
- **THEN** it returns `true` for each

#### Scenario: isClass is unchanged

- **WHEN** `isClass` is called with `Boolean`, `String` or `Number`
- **THEN** it returns `false` for each, as before this change
