import type {Transport} from "@modelcontextprotocol/client";
import type {PlatformMcpUpstreamSettings} from "../interfaces/PlatformMcpUpstreamSettings.js";

/**
 * Creates the MCP client transport matching a resolved upstream definition.
 *
 * The client package is imported lazily so applications without upstream never load it.
 *
 * @module platform/mcp
 */
export async function createUpstreamTransport(upstream: PlatformMcpUpstreamSettings): Promise<Transport> {
  if (upstream.type === "stdio") {
    const {StdioClientTransport, getDefaultEnvironment} = await import("@modelcontextprotocol/client/stdio");
    const {command, args, env, cwd} = upstream;

    return new StdioClientTransport({command, args, cwd, ...(env && {env: {...getDefaultEnvironment(), ...env}})});
  }

  const {StreamableHTTPClientTransport, SSEClientTransport} = await import("@modelcontextprotocol/client");
  // `requestInit.headers` may be a record, a list of tuples or a `Headers` instance
  const headers = new Headers(upstream.requestInit?.headers);

  Object.entries(upstream.headers || {}).forEach(([name, value]) => headers.set(name, value));

  const requestInit: RequestInit = {...upstream.requestInit, headers: Object.fromEntries(headers)};
  const url = new URL(upstream.url);

  return upstream.type === "sse" ? new SSEClientTransport(url, {requestInit}) : new StreamableHTTPClientTransport(url, {requestInit});
}
