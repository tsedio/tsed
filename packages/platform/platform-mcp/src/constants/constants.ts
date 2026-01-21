/**
 * Provider type tokens used to register MCP tools, resources, and prompts with the Ts.ED DI container.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const MCP_PROVIDER_TYPES = {
  TOOL: "mcp:tool",
  RESOURCE: "mcp:resource",
  PROMPT: "mcp:prompt"
} as const;
