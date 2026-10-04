import type {AuthInfo} from "@modelcontextprotocol/server";
import type {PlatformMcpUpstreamSettings} from "../interfaces/PlatformMcpUpstreamSettings.js";
import {hasPlaceholders, interpolate} from "./interpolate.js";

const OAUTH_PLACEHOLDERS = ["OAUTH_TOKEN", "OAUTH_CLIENT_ID", "OAUTH_SCOPES"] as const;

function mapValues(record: Record<string, string> | undefined, fn: (value: string) => string) {
  return record && Object.fromEntries(Object.entries(record).map(([key, value]) => [key, fn(value)]));
}

function getValues(upstream: PlatformMcpUpstreamSettings): string[] {
  return upstream.type === "stdio"
    ? [...(upstream.args || []), ...Object.values(upstream.env || {})]
    : Object.values(upstream.headers || {});
}

/**
 * Tells whether the upstream definition references the identity of the caller.
 */
export function hasUpstreamPlaceholders(upstream: PlatformMcpUpstreamSettings) {
  return getValues(upstream).some((value) => hasPlaceholders(value, OAUTH_PLACEHOLDERS));
}

/**
 * Replaces the `${OAUTH_*}` placeholders of an upstream definition with the verified identity of the caller.
 *
 * Headers are interpolated for `http` and `sse` upstreams, `args` and `env` for `stdio` upstreams.
 *
 * @module platform/mcp
 */
export function resolveUpstream<T extends PlatformMcpUpstreamSettings>(upstream: T, authInfo?: AuthInfo): T {
  const variables: Record<(typeof OAUTH_PLACEHOLDERS)[number], string | undefined> = {
    OAUTH_TOKEN: authInfo?.token,
    OAUTH_CLIENT_ID: authInfo?.clientId,
    OAUTH_SCOPES: authInfo?.scopes?.join(" ")
  };
  const resolve = (value: string) => interpolate(value, variables);

  if (upstream.type === "stdio") {
    return {...upstream, args: upstream.args?.map(resolve), env: mapValues(upstream.env, resolve)};
  }

  return {...upstream, headers: mapValues(upstream.headers, resolve)};
}
