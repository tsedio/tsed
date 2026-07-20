## 1. Dependencies and API migration

- [x] 1.1 Replace the v1 SDK dependency with the v2 server and Node transport packages and require Zod 4.2+.
- [x] 1.2 Migrate source imports and handler context types to MCP SDK v2.
- [x] 1.3 Use the v2 Node Streamable HTTP server transport for the Ts.ED endpoint.

## 2. Validation

- [x] 2.1 Update transport mocks and add a regression assertion for the v2 transport wiring.
- [x] 2.2 Regenerate the lockfile and run package type checks and tests.

## 3. JSON Schema registration

- [x] 3.1 Replace the Zod conversion helper with an MCP v2 `fromJsonSchema()` adapter for Ts.ED schemas.
- [x] 3.2 Remove direct Zod conversion dependencies and update schema unit and integration tests.
- [x] 3.3 Verify that invalid tool input is rejected before its handler executes.
