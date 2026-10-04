/**
 * Include/exclude filter evaluated on upstream names (tools, prompts) or URIs (resources).
 *
 * @module platform/mcp
 */
export interface McpUpstreamFilter {
  include?: (string | RegExp)[];
  exclude?: (string | RegExp)[];
}

interface McpUpstreamBaseSettings {
  /**
   * Optional prefix applied to the exposed tool and prompt names. No prefix by default.
   */
  prefix?: string;
  tools?: McpUpstreamFilter;
  resources?: McpUpstreamFilter;
  prompts?: McpUpstreamFilter;
  /**
   * Bounds of the upstream connection pool. One connection (or process, for stdio) is kept per distinct
   * set of interpolated values.
   */
  pool?: {
    /**
     * Maximum number of live connections. Defaults to `100`.
     */
    max?: number;
    /**
     * Idle time in milliseconds before a connection is closed. Defaults to `300000`.
     */
    idleTimeout?: number;
  };
}

/**
 * Upstream reached over Streamable HTTP (`http`) or legacy HTTP+SSE (`sse`).
 *
 * @module platform/mcp
 */
export interface McpHttpUpstreamSettings extends McpUpstreamBaseSettings {
  type: "http" | "sse";
  url: string;
  /**
   * Headers sent with every upstream request. Values support the `${OAUTH_TOKEN}`, `${OAUTH_CLIENT_ID}`
   * and `${OAUTH_SCOPES}` placeholders, replaced with the verified identity of the caller.
   */
  headers?: Record<string, string>;
  /**
   * Extra `fetch` options sent with every upstream request.
   */
  requestInit?: RequestInit;
}

/**
 * Upstream started as a local process speaking MCP over stdio (for instance a server started with `npx`).
 *
 * @module platform/mcp
 */
export interface McpStdioUpstreamSettings extends McpUpstreamBaseSettings {
  type: "stdio";
  command: string;
  /**
   * Arguments of the command. Values support the same placeholders as `headers`.
   * One process is started per distinct set of interpolated values.
   */
  args?: string[];
  /**
   * Environment of the child process, merged over the SDK safe environment subset.
   * Values support the same placeholders as `headers`.
   */
  env?: Record<string, string>;
  cwd?: string;
}

/**
 * Third-party MCP server exposed through a Ts.ED MCP endpoint.
 *
 * @module platform/mcp
 */
export type PlatformMcpUpstreamSettings = McpHttpUpstreamSettings | McpStdioUpstreamSettings;
