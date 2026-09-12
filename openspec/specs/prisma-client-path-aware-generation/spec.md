# Prisma Client Path-Aware Generation Specification

## Purpose

Ensure generated Prisma models import `Prisma` from the configured Prisma Client output.

## Requirements

### Requirement: Decimal imports use the configured Prisma Client path

The Prisma generator SHALL import the `Prisma` namespace used by generated `Decimal` model fields from the configured Prisma Client output.

#### Scenario: Custom Prisma Client output

- **WHEN** Prisma Client is configured with a custom output path and a generated model has a `Decimal` field
- **THEN** the generated model imports `Prisma` from the normalized relative path to that configured client output

#### Scenario: Default Prisma Client package

- **WHEN** Prisma Client is configured at `@prisma/client` and a generated model has a `Decimal` field
- **THEN** the generated model imports `Prisma` from `@prisma/client`
