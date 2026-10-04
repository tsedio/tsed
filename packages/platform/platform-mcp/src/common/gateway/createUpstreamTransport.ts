import type {Transport} from "@modelcontextprotocol/client";
import type {McpUpstreamSettings} from "../interfaces/McpUpstreamSettings.js";

/**
 * Creates the MCP client transport matching a resolved upstream definition.
 *
 * The client package is imported lazily so applications without upstream never load it.
 *
 * @module platform/mcp
 */
export async function createUpstreamTransport(upstream: McpUpstreamSettings): Promise<Transport> {
  if (upstream.type === "stdio") {
    const {StdioClientTransport, getDefaultEnvironment} = await import("@modelcontextprotocol/client/stdio");
    const {command, args, env, cwd} = upstream;

    return new StdioClientTransport({command, args, cwd, ...(env && {env: {...getDefaultEnvironment(), ...env}})});
  }

  const {StreamableHTTPClientTransport, SSEClientTransport} = await import("@modelcontextprotocol/client");
  const requestInit: RequestInit = {
    ...upstream.requestInit,
    headers: {
      ...(upstream.requestInit?.headers as Record<string, string> | undefined),
      ...upstream.headers
    }
  };
  const url = new URL(upstream.url);

  return upstream.type === "sse" ? new SSEClientTransport(url, {requestInit}) : new StreamableHTTPClientTransport(url, {requestInit});
}
