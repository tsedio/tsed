## 1. Implementation

- [x] 1.1 Send `requiredScopes`, or `scopesSupported` when none is required, as the `scope` of the bearer challenge

## 2. Tests and documentation

- [x] 2.1 Unit tests: supported scopes advertised and not enforced, required scopes first, no scope when none is configured
- [x] 2.2 Document the behavior in `docs/docs/mcp.md` and in the `tsed-mcp-server` agent skill

## 3. Validation

- [x] 3.1 `yarn test` in `packages/platform/platform-mcp`, `yarn test:lint`, spec typecheck, `openspec validate`
