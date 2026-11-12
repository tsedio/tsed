# Spec Delta

## Purpose

Defines when a type mapper (`@JsonMapper()`) registered, replaced or changed is taken into account by `serialize()` and `deserialize()`, including after the first mapping has run.

## ADDED Requirements

### Requirement: A type mapper registered after the first mapping is used

A type mapper registered after `serialize()` or `deserialize()` has already run SHALL be used by the next call that maps that type.

#### Scenario: Mapper registered at runtime

- **GIVEN** `deserialize("2020-01-01", {type: Date})` has already run once
- **WHEN** a new `@JsonMapper(Date)` class is registered, then `deserialize("2020-01-01", {type: Date})` is called again
- **THEN** the second call uses the new mapper

### Requirement: A replaced or removed type mapper is no longer used

When a type mapper is replaced or removed from the registry, the next `serialize()` or `deserialize()` call SHALL stop using the former mapper.

#### Scenario: Mapper replaced

- **GIVEN** a mapper `A` registered for `Date` and used once
- **WHEN** a mapper `B` replaces `A` for `Date`
- **THEN** the next call maps `Date` with `B`

### Requirement: An explicit types container is honoured

When the caller passes its own `types` container in the options, `serialize()` and `deserialize()` SHALL use the mappers of that container for that call, as they do today.

#### Scenario: Custom types option

- **GIVEN** a `types` map holding a custom mapper for `String`
- **WHEN** `serialize("a", {types})` is called
- **THEN** the custom mapper is used for that call
