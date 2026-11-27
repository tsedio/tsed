## 1. Implementation

- [x] 1.1 Answer `405` to `GET` and `DELETE` on each MCP path in `PlatformMcpModule`
- [x] 1.2 Answer `405` to `GET` and `DELETE` on `/mcp` in `mcpStreamableServer`

## 2. Tests and documentation

- [x] 2.1 Unit tests for the module and the CLI server; integration tests on Express and Fastify
- [x] 2.2 Document the behavior in `docs/docs/mcp.md` and in the `tsed-mcp-server` agent skill

## 3. Validation

- [x] 3.1 `yarn test` in `packages/platform/platform-mcp`, `yarn test:lint`, spec typecheck, `openspec validate`
