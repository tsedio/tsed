import {hasUpstreamPlaceholders, resolveUpstream} from "./resolveUpstream.js";

const authInfo = {token: "abc", clientId: "client", scopes: ["mcp:read", "mcp:write"]};

describe("resolveUpstream()", () => {
  it("interpolates the caller identity in the headers of an HTTP upstream", () => {
    const upstream = {
      type: "http" as const,
      url: "http://localhost/mcp/${OAUTH_TOKEN}",
      headers: {
        Authorization: "Bearer ${OAUTH_TOKEN}",
        "X-Client": "${OAUTH_CLIENT_ID}",
        "X-Scopes": "${OAUTH_SCOPES}",
        "X-Static": "${OTHER}"
      }
    };

    expect(resolveUpstream(upstream, authInfo)).toEqual({
      ...upstream,
      headers: {
        Authorization: "Bearer abc",
        "X-Client": "client",
        "X-Scopes": "mcp:read mcp:write",
        "X-Static": "${OTHER}"
      }
    });
  });

  it("interpolates the caller identity in the args and env of a stdio upstream", () => {
    const upstream = {
      type: "stdio" as const,
      command: "npx",
      args: ["-y", "server", "--token=${OAUTH_TOKEN}"],
      env: {TOKEN: "${OAUTH_TOKEN}"}
    };

    expect(resolveUpstream(upstream, authInfo)).toEqual({
      ...upstream,
      args: ["-y", "server", "--token=abc"],
      env: {TOKEN: "abc"}
    });
  });

  it("replaces placeholders with empty values when the caller is not authenticated", () => {
    expect(resolveUpstream({type: "http", url: "http://localhost/mcp", headers: {authorization: "Bearer ${OAUTH_TOKEN}"}})).toEqual({
      type: "http",
      url: "http://localhost/mcp",
      headers: {authorization: "Bearer "}
    });
  });

  it("leaves definitions without headers, args or env untouched", () => {
    expect(resolveUpstream({type: "http", url: "http://localhost/mcp"}, authInfo)).toEqual({
      type: "http",
      url: "http://localhost/mcp",
      headers: undefined
    });
    expect(resolveUpstream({type: "stdio", command: "node"}, authInfo)).toEqual({
      type: "stdio",
      command: "node",
      args: undefined,
      env: undefined
    });
  });
});

describe("resolveUpstream() with ${OAUTH_SUB}", () => {
  const upstream = {type: "stdio" as const, command: "node", args: ["--user=${OAUTH_SUB}"], env: {USER_ID: "${OAUTH_SUB}"}};

  it("interpolates the subject exposed in the claims of the caller", () => {
    expect(resolveUpstream(upstream, {...authInfo, extra: {sub: "user-1"}})).toEqual({
      ...upstream,
      args: ["--user=user-1"],
      env: {USER_ID: "user-1"}
    });
  });

  it.each([
    ["the claims hold no subject", {...authInfo, extra: {}}],
    ["the subject is not a string", {...authInfo, extra: {sub: 42}}],
    ["the caller exposes no claims", authInfo]
  ])("replaces the placeholder with an empty value when %s", (_, info) => {
    expect(resolveUpstream(upstream, info)).toEqual({...upstream, args: ["--user="], env: {USER_ID: ""}});
  });
});

describe("hasUpstreamPlaceholders()", () => {
  it("detects placeholders in headers, args and env", () => {
    expect(hasUpstreamPlaceholders({type: "http", url: "http://localhost", headers: {a: "${OAUTH_TOKEN}"}})).toBe(true);
    expect(hasUpstreamPlaceholders({type: "stdio", command: "node", args: ["${OAUTH_CLIENT_ID}"]})).toBe(true);
    expect(hasUpstreamPlaceholders({type: "stdio", command: "node", env: {A: "${OAUTH_SCOPES}"}})).toBe(true);
    expect(hasUpstreamPlaceholders({type: "stdio", command: "node", env: {A: "${OAUTH_SUB}"}})).toBe(true);
  });

  it("ignores static definitions", () => {
    expect(hasUpstreamPlaceholders({type: "http", url: "http://localhost", headers: {a: "b"}})).toBe(false);
    expect(hasUpstreamPlaceholders({type: "stdio", command: "node"})).toBe(false);
  });
});
