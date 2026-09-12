## Context

`generateCode` already receives the resolved Prisma Client path and uses it for the generated client re-export. The model transformation chain does not currently receive that value, so `transformScalarToType` hard-codes `@prisma/client` for `Decimal` fields.

## Goals / Non-Goals

### Goals

- Use the configured Prisma Client path for generated `Decimal` imports.
- Match the module-specifier normalization used by the generated client re-export.
- Add a regression test for a non-default client output path.

### Non-Goals

- Change support for Prisma generator providers.
- Change generated imports for scalar types other than `Decimal`.

## Decisions

- Add the client path to the generator transform context, threaded from `generateCode` to model generation and scalar transformation.
- Resolve the Decimal import with the same `@prisma/client` versus relative custom-output convention as `generateClientIndex`.
- Assert the generated model source contains the custom-path `Prisma` import.

## Risks / Trade-offs

- Relative paths must be resolved from the generated models directory; reuse the existing convention to avoid inconsistent output.
- Default-path generation remains covered by the existing behavior and must not change.

## Migration Plan

No migration is required. Regenerating code will produce a corrected import for custom Prisma Client outputs.

## Documentation

Document a paired `generator client` and `generator tsed` configuration with custom output directories. Clarify that generated Ts.ED models resolve the Prisma namespace from that configured client output.

## Open Questions

None.
