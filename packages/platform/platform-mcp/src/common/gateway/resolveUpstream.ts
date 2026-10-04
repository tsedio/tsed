import type {AuthInfo} from "@modelcontextprotocol/server";
import type {McpUpstreamSettings} from "../interfaces/McpUpstreamSettings.js";

const PLACEHOLDER = /\$\{(OAUTH_TOKEN|OAUTH_CLIENT_ID|OAUTH_SCOPES)\}/g;

function mapValues(record: Record<string, string> | undefined, fn: (value: string) => string) {
  return record && Object.fromEntries(Object.entries(record).map(([key, value]) => [key, fn(value)]));
}

function getValues(upstream: McpUpstreamSettings): string[] {
  return upstream.type === "stdio"
    ? [...(upstream.args || []), ...Object.values(upstream.env || {})]
    : Object.values(upstream.headers || {});
}

/**
 * Tells whether the upstream definition references the identity of the caller.
 */
export function hasUpstreamPlaceholders(upstream: McpUpstreamSettings) {
  return getValues(upstream).some((value) => value.search(PLACEHOLDER) !== -1);
}

/**
 * Replaces the `${OAUTH_*}` placeholders of an upstream definition with the verified identity of the caller.
 *
 * Headers are interpolated for `http` and `sse` upstreams, `args` and `env` for `stdio` upstreams.
 *
 * @module platform/mcp
 */
export function resolveUpstream<T extends McpUpstreamSettings>(upstream: T, authInfo?: AuthInfo): T {
  const values: Record<string, string> = {
    OAUTH_TOKEN: authInfo?.token || "",
    OAUTH_CLIENT_ID: authInfo?.clientId || "",
    OAUTH_SCOPES: authInfo?.scopes?.join(" ") || ""
  };
  const interpolate = (value: string) => value.replace(PLACEHOLDER, (_, name: string) => values[name]);

  if (upstream.type === "stdio") {
    return {...upstream, args: upstream.args?.map(interpolate), env: mapValues(upstream.env, interpolate)};
  }

  return {...upstream, headers: mapValues(upstream.headers, interpolate)};
}
