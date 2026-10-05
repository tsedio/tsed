## 1. Implementation

- [x] 1.1 Add the `PlatformMcpPreAuth` contract, `PlatformMcpPreAuthOption` and `PlatformMcpPreAuthSettings`; add `preAuth` to `PlatformMcpAuthSettings`; widen `PlatformMcpSettings.auth`
- [x] 1.2 Add `PlatformMcpAuthService.isOAuth()` and `preAuth()` (function or DI token)
- [x] 1.3 Run the check before OAuth in `PlatformMcpModule.dispatch`, fail closed without issuer, set `req.auth`
- [x] 1.4 Mount the metadata route and validate the OAuth settings only with an issuer; reject an empty `auth`

## 2. Tests

- [x] 2.1 Unit tests for `isOAuth()`, `preAuth()` and the module validation
- [x] 2.2 Integration tests on Express and Fastify: custom check alone, combined with OAuth, rejected key, upstream placeholder

## 3. Documentation

- [x] 3.1 Document `auth.preAuth` in `docs/docs/mcp.md`
- [x] 3.2 Update the `tsed-mcp-server` agent skill

## 4. Validation

- [x] 4.1 `yarn test` in `packages/platform/platform-mcp`
- [x] 4.2 `yarn test:lint`, spec typecheck, `openspec validate add-platform-mcp-pre-auth`
