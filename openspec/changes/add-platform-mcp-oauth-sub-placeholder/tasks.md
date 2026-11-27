## 1. Implementation

- [x] 1.1 Add the `${OAUTH_SUB}` placeholder to `resolveUpstream`, read from `AuthInfo.extra.sub`

## 2. Tests and documentation

- [x] 2.1 Unit tests: subject interpolated in `args` and `env`, empty value when the claim is missing or not a string, placeholder detected at startup
- [x] 2.2 Document the placeholder in `docs/docs/mcp.md`, the settings JSDoc and the `tsed-mcp-server` agent skill

## 3. Validation

- [x] 3.1 `yarn test` in `packages/platform/platform-mcp`, `yarn test:lint`, spec typecheck, `openspec validate`
