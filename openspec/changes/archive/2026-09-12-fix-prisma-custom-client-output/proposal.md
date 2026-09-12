## Why

Prisma models containing a `Decimal` field import `Prisma` from the hard-coded `@prisma/client` package. When a project configures Prisma Client with a custom output directory, this import cannot resolve to the generated client and generated Ts.ED models fail to load.

## What Changes

- Make generated `Decimal` model imports resolve from the configured Prisma Client path.
- Preserve the existing `@prisma/client` import for projects using the default client location.
- Cover custom Prisma Client output generation with a focused regression test.
- Document custom Prisma Client output configuration for Ts.ED users.

## Capabilities

### New Capabilities

- `prisma-client-path-aware-generation`: Generated Prisma model code resolves `Decimal` imports from the configured client output.

### Modified Capabilities

- None.

## Impact

- Affects the `@tsed/prisma` code generator, its transform context, generator tests, tutorial, and package README.
- No public API or dependency changes.
