## Context

The package now separates shared MCP definitions from HTTP and CLI runtimes. The HTTP `McpServerFactory` contains the current registration flow, while the CLI factory retains an earlier lookup path and must remain independent of `@tsed/platform-http`.

## Goals / Non-Goals

**Goals:**

- Reuse the common settings and provider-discovery contract in the CLI factory.
- Exercise configured and provider-discovered registrations in CLI tests.
- Leave CLI server creation and transport connection selection intact.

**Non-Goals:**

- Migrate the CLI transport SDK or change its stdio/HTTP implementation.
- Change the HTTP factory or public MCP decorators/helpers.

## Decisions

- Read `PlatformMcpSettings` from `mcp` and pass `settings.tools`, `settings.resources`, and `settings.prompts` to token collection. This matches the HTTP configuration namespace while depending only on `common`.
- Use the CLI injector's provider lookup API and preserve transport construction unchanged. The two runtimes use different SDK versions and injector APIs, so only the registration semantics are shared.
- Use token string fallbacks for resource and prompt names, matching HTTP behavior and permitting token-only registrations.
- Use the MCP v2 stdio and Node Streamable HTTP transports in the CLI runtime. `MCP_SERVER` is now shared from `common` and is therefore incompatible with the legacy SDK v1 transports.

## Risks / Trade-offs

- [Settings migration] → Existing CLI root-level token arrays are no longer used; tests document the supported `mcp` location.
- [SDK differences] → Registration calls stay typed against the CLI SDK and are only normalized at the shared-definition boundary.
