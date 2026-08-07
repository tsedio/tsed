## Context

`MCP_SERVER` is shared by the HTTP and CLI runtimes, while `mcpServerConnect()` selects the CLI transport. Neither runtime entry point currently has direct unit coverage.

## Goals / Non-Goals

**Goals:**

- Verify configured and discovered MCP registrations without a real transport.
- Verify each CLI connection mode delegates to exactly one transport.

**Non-Goals:**

- Start a listener or test MCP protocol traffic end-to-end.

## Decisions

- Inspect SDK registration state for the common factory and mock transport helpers for CLI connection selection. This tests behavior without binding stdio or an HTTP port.

## Risks / Trade-offs

- [SDK internals change] → Limit registration-state assertions to names and callbacks already exposed by the SDK registration API.
