import {createUpstreamTransport} from "./createUpstreamTransport.js";

const {StreamableHTTPClientTransport, SSEClientTransport, StdioClientTransport} = vi.hoisted(() => {
  class FakeTransport {
    readonly args: unknown[];

    constructor(...args: unknown[]) {
      this.args = args;
    }
  }

  return {
    StreamableHTTPClientTransport: class extends FakeTransport {},
    SSEClientTransport: class extends FakeTransport {},
    StdioClientTransport: class extends FakeTransport {}
  };
});

vi.mock("@modelcontextprotocol/client", () => ({StreamableHTTPClientTransport, SSEClientTransport}));
vi.mock("@modelcontextprotocol/client/stdio", () => ({
  StdioClientTransport,
  getDefaultEnvironment: () => ({PATH: "/usr/bin", HOME: "/home/tsed"})
}));

describe("createUpstreamTransport()", () => {
  it("creates a Streamable HTTP transport with the upstream headers", async () => {
    const transport = await createUpstreamTransport({
      type: "http",
      url: "https://upstream.example.com/mcp",
      headers: {authorization: "Bearer abc"}
    });

    expect(transport).toBeInstanceOf(StreamableHTTPClientTransport);
    expect((transport as any).args).toEqual([
      new URL("https://upstream.example.com/mcp"),
      {requestInit: {headers: {authorization: "Bearer abc"}}}
    ]);
  });

  it("merges the upstream headers over the request options", async () => {
    const transport = await createUpstreamTransport({
      type: "http",
      url: "https://upstream.example.com/mcp",
      requestInit: {redirect: "error", headers: {"x-static": "1", authorization: "Bearer static"}},
      headers: {authorization: "Bearer abc"}
    });

    expect((transport as any).args[1]).toEqual({
      requestInit: {redirect: "error", headers: {"x-static": "1", authorization: "Bearer abc"}}
    });
  });

  it.each([
    ["a Headers instance", new Headers({"X-Static": "1", Authorization: "Bearer static"})],
    [
      "a list of tuples",
      [
        ["X-Static", "1"],
        ["Authorization", "Bearer static"]
      ] as [string, string][]
    ]
  ])("accepts request headers given as %s", async (_, headers) => {
    const transport = await createUpstreamTransport({
      type: "http",
      url: "https://upstream.example.com/mcp",
      requestInit: {headers},
      headers: {Authorization: "Bearer abc"}
    });

    expect((transport as any).args[1]).toEqual({requestInit: {headers: {"x-static": "1", authorization: "Bearer abc"}}});
  });

  it("creates a legacy SSE transport", async () => {
    const transport = await createUpstreamTransport({type: "sse", url: "https://upstream.example.com/sse"});

    expect(transport).toBeInstanceOf(SSEClientTransport);
    expect((transport as any).args).toEqual([new URL("https://upstream.example.com/sse"), {requestInit: {headers: {}}}]);
  });

  it("creates a stdio transport inheriting the default environment", async () => {
    const transport = await createUpstreamTransport({type: "stdio", command: "npx", args: ["-y", "server"], cwd: "/data"});

    expect(transport).toBeInstanceOf(StdioClientTransport);
    expect((transport as any).args).toEqual([{command: "npx", args: ["-y", "server"], cwd: "/data"}]);
  });

  it("merges the stdio environment over the default one", async () => {
    const transport = await createUpstreamTransport({type: "stdio", command: "npx", env: {API_TOKEN: "abc", HOME: "/custom"}});

    expect((transport as any).args).toEqual([
      {command: "npx", args: undefined, cwd: undefined, env: {PATH: "/usr/bin", HOME: "/custom", API_TOKEN: "abc"}}
    ]);
  });
});
