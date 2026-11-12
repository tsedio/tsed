# Spec Delta

## Purpose

Defines when a type mapper (`@JsonMapper()`) registered, replaced or changed is taken into account by `serialize()` and `deserialize()`, including after the first mapping has run.

Two limits exist on the base branch and are kept: a model that is already compiled does not see a mapper registered later for one of its property types, and a mapper removed from the registry is still used by the models compiled with it. The requirements below do not cover these two cases.

## ADDED Requirements

### Requirement: A type mapper registered after the first mapping is used

A type mapper registered after `serialize()` or `deserialize()` has already run SHALL be used by the next call that maps that type directly (`{type: <the type>}`).

#### Scenario: Mapper registered at runtime

- **GIVEN** `serialize(new Money(5), {type: Money})` has already run once without a mapper for `Money`
- **WHEN** a mapper for `Money` is registered, then `serialize(new Money(5), {type: Money})` is called again
- **THEN** the second call uses the new mapper

### Requirement: A replaced type mapper is no longer used

When a type mapper is replaced in the registry, the next `serialize()` or `deserialize()` call SHALL stop using the former mapper, including for the models already compiled with it.

#### Scenario: Mapper replaced

- **GIVEN** a mapper `A` registered for `Money` and used once to deserialize a model with a `Money` property
- **WHEN** a mapper `B` replaces `A` for `Money`
- **THEN** the next call maps the `Money` property with `B`

### Requirement: A method replaced on a registered mapper is followed

When a method of a registered mapper object is replaced in place, without a change of the registry, the next `serialize()` or `deserialize()` call SHALL use the new method.

#### Scenario: Method replaced in place

- **GIVEN** a mapper object registered for `Money` and used once to serialize a model with a `Money` property
- **WHEN** its `serialize` method is replaced on the same object
- **THEN** the next call uses the new `serialize` method

### Requirement: An explicit types container is honoured

When the caller passes its own `types` container in the options, `serialize()` and `deserialize()` SHALL use the mappers of that container for that call, as they do today.

#### Scenario: Custom types option

- **GIVEN** a `types` map holding a custom mapper for `Money`
- **WHEN** `serialize(order, {type: Order, types})` is called
- **THEN** the custom mapper is used for that call
