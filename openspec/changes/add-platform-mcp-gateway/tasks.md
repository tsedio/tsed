## 1. Settings and dependencies

- [x] 1.1 Add `@modelcontextprotocol/client` and `oauth4webapi` to `packages/platform/platform-mcp/package.json` and run `yarn install`
- [x] 1.2 Add `McpUpstreamSettings` (http/sse/stdio union, prefix, filters, pool) and `McpAuthSettings` (issuer, mode, clientId, clientSecret, audience, verifier, resource, scopes, resourceName, resourceDocumentation) interfaces under `src/common/interfaces/`
- [x] 1.3 Extend `PlatformMcpSettings` with `upstream?` and `auth?`, with TSDoc

## 2. Endpoint OAuth (`mcp-endpoint-auth`)

- [x] 2.1 Add a helper resolving `auth.verifier` (instance or DI token) to an `OAuthTokenVerifier`
- [x] 2.2 Register `GET /.well-known/oauth-protected-resource{path}` per protected entry in `PlatformMcpModule.$onRoutesInit` and add it to `$logRoutes`
- [x] 2.3 Verify the bearer token before dispatch; answer `401`/`403` with the SDK challenge; set `req.auth` on success
- [x] 2.4 Built-in verifiers: issuer metadata discovery, `offline` (RFC 9068 JWT access tokens) and `introspection` (RFC 7662, cached), both through `oauth4webapi`; `mode` defaulting and startup validation
- [x] 2.5 Unit tests: metadata content, derived vs explicit `resource`, missing/invalid token, insufficient scope, DI verifier, unprotected entry unchanged

## 3. Gateway core (`mcp-gateway`)

- [x] 3.1 Add `createUpstreamTransport()` for `http`, `sse` and `stdio` with lazy imports of the client package
- [x] 3.2 Add `McpGatewayService`: lazy connect, pool keyed by the interpolated values, idle eviction, retry with backoff, `$onDestroy` cleanup
- [x] 3.3 Build and cache the upstream catalog (tools, resources, resource templates, prompts) with pagination, `include`/`exclude` filters and `prefix`; refresh on `list_changed`
- [x] 3.4 Add `attachUpstream(server, settings, authInfo)` registering catalog entries on the `McpServer` with forwarding handlers (original names, abort signal, progress)
- [x] 3.5 Collision detection with local-first precedence and warnings
- [x] 3.6 Interpolate `${OAUTH_TOKEN}`, `${OAUTH_CLIENT_ID}`, `${OAUTH_SCOPES}` in `headers` (http/sse) and `args`/`env` (stdio); placeholders require `auth`
- [x] 3.7 Call `attachUpstream` from `PlatformMcpModule.dispatch` between server creation and `server.connect()`
- [x] 3.8 Expose the upstream from `mcpServerConnect("streamable-http")`; ignore it with a warning in stdio mode; reject placeholders
- [x] 3.9 Unit tests for 3.1–3.6 using in-memory transports and a fake upstream `McpServer`

## 4. Integration tests

- [x] 4.1 Add a fixture upstream MCP server (Streamable HTTP) and a stdio fixture script under `test/`
- [x] 4.2 Add `test/mcp.gateway.shared.ts`: listing with local tools, forwarded calls, prefix/filter, upstream down, protected endpoint end to end (challenge → token → interpolated header and stdio args)
- [x] 4.3 Run the shared suite on Express and Fastify

## 5. Documentation

- [x] 5.1 Add "Gateway" and "Protect an endpoint with OAuth" sections to `docs/docs/mcp.md` (configuration, verification modes, placeholders, stdio process-per-token caveat, proxy `resource` caveat)
- [x] 5.2 Document the agent plugin skill (`plugins/tsed/skills/tsed-mcp-server`), the package readme, a provider-agnostic OIDC example and the `curl` checks
- [ ] 5.3 Run `yarn api:build` to validate TSDoc

## 6. Validation

- [x] 6.1 `cd packages/platform/platform-mcp && yarn test` (147 tests)
- [x] 6.2 `yarn test:lint`
- [x] 6.3 `openspec validate add-platform-mcp-gateway`
- [ ] 6.4 `yarn build` of `@tsed/platform-mcp`

## 7. Code review fixes

- [x] 7.1 Require `auth.resource` or `auth.audience` for the built-in verifiers (the expected audience must not come from the `Host` header); validate `issuer` / `resource` URLs at startup
- [x] 7.2 Never evict an upstream connection that is serving a request
- [x] 7.3 Compile upstream JSON Schemas once per catalog instead of on every request
- [x] 7.4 Make the audience mandatory in introspection too: reject tokens when the authorization server returns no matching `aud`
- [x] 7.5 Allow `audience: false` in introspection mode only (startup warning); refuse it in offline mode
- [ ] 7.6 Answer forwarded calls with an explicit "upstream unavailable" error while the upstream is down, and log the outage once per backoff window

## 8. Real-world validation and delivery

- [ ] 8.1 End-to-end OAuth flow with a real MCP client (Claude, MCP Inspector) against the OIDC provider, including CIMD registration
- [ ] 8.2 Directus 12 as upstream with `${OAUTH_TOKEN}` forwarding
- [ ] 8.3 Koa integration test
- [ ] 8.4 Run the CLI in `streamable-http` mode against a real upstream; confirm upstream connections are closed on exit
- [ ] 8.5 Commit, push and open the pull request
- [ ] 8.6 Archive the OpenSpec change after merge
