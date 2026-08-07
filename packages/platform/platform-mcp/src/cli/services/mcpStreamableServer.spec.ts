import {McpServer} from "@modelcontextprotocol/server";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

const {app, listenServer, NodeStreamableHTTPServerTransport, express, routeHandlers} = vi.hoisted(() => {
  const routeHandlers = new Map<string, Function>();
  const listeners = new Map<string, Function>();
  const listenServer = {
    on: vi.fn((event: string, handler: Function) => {
      listeners.set(event, handler);
      return listenServer;
    })
  };
  const app = {
    use: vi.fn(),
    post: vi.fn((path: string, handler: Function) => routeHandlers.set(path, handler)),
    listen: vi.fn((_: number, handler: Function) => {
      handler();
      return listenServer;
    })
  };
  const express = Object.assign(
    vi.fn(() => app),
    {json: vi.fn(() => "json-middleware")}
  );
  const NodeStreamableHTTPServerTransport = vi.fn(function () {
    return {close: vi.fn(), handleRequest: vi.fn().mockResolvedValue(undefined)};
  });

  return {app, listenServer, NodeStreamableHTTPServerTransport, express, routeHandlers, listeners};
});

vi.mock("express", () => ({default: express}));
vi.mock("@modelcontextprotocol/node", () => ({NodeStreamableHTTPServerTransport}));

import {mcpStreamableServer} from "./mcpStreamableServer.js";

describe("mcpStreamableServer", () => {
  let server: McpServer;
  let connect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    routeHandlers.clear();
    server = {connect: (connect = vi.fn().mockResolvedValue(undefined))} as any;
  });

  afterEach(() => {
    const close = listenServer.on.mock.calls.find(([event]) => event === "close")?.[1] as Function | undefined;
    close?.();
  });

  it("configures an Express MCP endpoint", async () => {
    void mcpStreamableServer(server);
    await vi.waitFor(() => expect(app.listen).toHaveBeenCalled());

    expect(express.json).toHaveBeenCalledOnce();
    expect(app.use).toHaveBeenCalledWith("json-middleware");
    expect(app.post).toHaveBeenCalledWith("/mcp", expect.any(Function));
  });

  it("creates a transport and dispatches each MCP request", async () => {
    void mcpStreamableServer(server);
    await vi.waitFor(() => expect(routeHandlers.get("/mcp")).toBeDefined());
    const on = vi.fn();
    const req = {body: {jsonrpc: "2.0"}};
    const res = {on};

    await routeHandlers.get("/mcp")!(req, res);

    const transport = NodeStreamableHTTPServerTransport.mock.results[0].value;
    expect(NodeStreamableHTTPServerTransport).toHaveBeenCalledWith({sessionIdGenerator: undefined, enableJsonResponse: true});
    expect(connect).toHaveBeenCalledWith(transport);
    expect(transport.handleRequest).toHaveBeenCalledWith(req, res, req.body);

    on.mock.calls.find(([event]) => event === "close")![1]();
    expect(transport.close).toHaveBeenCalledOnce();
  });

  it("rejects when Express cannot start", async () => {
    const result = mcpStreamableServer(server);
    await vi.waitFor(() => expect(listenServer.on).toHaveBeenCalledWith("error", expect.any(Function)));
    const error = new Error("port unavailable");
    listenServer.on.mock.calls.find(([event]) => event === "error")![1](error);

    await expect(result).rejects.toThrow(error);
  });
});
