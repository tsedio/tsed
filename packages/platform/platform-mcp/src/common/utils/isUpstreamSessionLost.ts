import type {Client} from "@modelcontextprotocol/client";

/**
 * Tells whether the upstream no longer knows the session of the client.
 *
 * A Streamable HTTP server keeping its sessions in memory answers `404` to every request of a session it
 * restarted without or closed (idle, request limit). The MCP client keeps sending the session and is never
 * closed: the connection must be replaced.
 *
 * @param error Error thrown by the client.
 * @param client Client which sent the request.
 * @module platform/mcp
 */
export function isUpstreamSessionLost(error: unknown, client: Pick<Client, "transport">): boolean {
  return Boolean(client.transport?.sessionId) && (error as {status?: unknown} | null)?.status === 404;
}
