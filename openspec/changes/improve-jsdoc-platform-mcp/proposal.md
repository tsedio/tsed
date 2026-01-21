## Why

Platform MCP currently mixes sparse, outdated, or missing JSDoc across its classes and helper functions. This makes it harder for developers (and LLM tooling) to understand behavior, and it blocks our TSDoc-powered doc generation pipeline from producing accurate API reference pages for the docs site.

## What Changes

- Add or refresh TSDoc-compliant JSDoc blocks for every publicly exported class, function, and factory under `packages/platform/platform-mcp/src`.
- Describe params, generics, return values, and important side-effects/usage notes so tsdoc -> markdown conversion can surface the right metadata.
- Align tags/formatting with Ts.ED documentation conventions (e.g., `@param`, `@returns`, `@example`, `@deprecated` when relevant) to maintain consistency across packages.
- Ensure no behavioral changes—code stays the same, only comments improve clarity.

## Capabilities

### New Capabilities

- `platform-mcp-jsdoc-coverage`: Guarantees that exported symbols in Platform MCP expose complete, standardized TSDoc so automated reference docs stay accurate and rich enough for IDE/LLM consumption.

### Modified Capabilities

- _None_

## Impact

- Code: `packages/platform/platform-mcp/src/**/*` (comments only; no functional logic touched).
- Tooling: TSDoc parser + docs build gain higher-fidelity metadata for Platform MCP APIs.
- Documentation: Generated markdown under VitePress `/docs` reflects the clarified descriptions and parameter details.
