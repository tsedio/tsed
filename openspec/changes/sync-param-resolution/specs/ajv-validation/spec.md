# Spec Delta

## Purpose

Defines what `@tsed/ajv` returns when it validates a value against a schema or a model, when the result comes as a promise, and how validation failures are reported.

## ADDED Requirements

### Requirement: validate() keeps returning a promise

`AjvService.validate()` SHALL keep its signature and SHALL always return a promise, whether the compiled validator is synchronous or not, so existing callers that use `.then()` or `.catch()` keep working.

#### Scenario: Caller chaining on validate()

- **GIVEN** application code that calls `ajvService.validate(value, {type: User}).catch(handler)`
- **WHEN** the value is invalid
- **THEN** `handler` receives the `AjvValidationError`, as before this change

### Requirement: Same-tick validation entry point

`AjvService` SHALL expose a validation method that returns the validated value directly, or throws an `AjvValidationError`, when the compiled validator is synchronous. It SHALL return a promise only when the schema is `$async` or when `ajv.loadSchema` is configured.

#### Scenario: Synchronous schema, valid value

- **GIVEN** a model without `$async` and no `ajv.loadSchema` setting
- **WHEN** the same-tick method validates a valid value
- **THEN** it returns the value, not a promise

#### Scenario: Synchronous schema, invalid value

- **GIVEN** a model whose `name` has `@MinLength(3)`
- **WHEN** the same-tick method validates `{name: "a"}`
- **THEN** it throws an `AjvValidationError` with the same message and errors as `validate()` rejects with

#### Scenario: loadSchema configured

- **GIVEN** an app with `ajv.loadSchema` set
- **WHEN** the same-tick method validates a value
- **THEN** it returns a promise that settles like `validate()`

### Requirement: Coerced values and cloning are unchanged

Both entry points SHALL return the coerced value when `returnsCoercedValues` is enabled, globally or in the options, and SHALL validate a copy of the value otherwise, as `validate()` does today.

#### Scenario: Coercion disabled

- **GIVEN** `returnsCoercedValues` is not enabled
- **WHEN** a value `{age: "12"}` is validated against a model with `age: number` and coercion on in AJV
- **THEN** the returned value is the original object, with `age` still `"12"`
