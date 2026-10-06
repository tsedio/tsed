import {McpServer} from "@modelcontextprotocol/server";
import {afterEach, beforeEach, describe, expect, it, type Mock, vi} from "vitest";

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
    get: vi.fn((path: string, handler: Function) => routeHandlers.set(`GET ${path}`, handler)),
    delete: vi.fn((path: string, handler: Function) => routeHandlers.set(`DELETE ${path}`, handler)),
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
  let createServer: Mock<() => McpServer>;
  let servers: McpServer[];

  beforeEach(() => {
    vi.clearAllMocks();
    routeHandlers.clear();
    servers = [];
    createServer = vi.fn<() => McpServer>(() => {
      let transport: {close: () => unknown} | undefined;
      const server = {
        connect: vi.fn().mockImplementation((value) => {
          transport = value;
        }),
        close: vi.fn().mockImplementation(() => transport?.close())
      };

      servers.push(server as unknown as McpServer);

      return server as unknown as McpServer;
    });
  });

  afterEach(() => {
    const close = listenServer.on.mock.calls.find(([event]) => event === "close")?.[1] as Function | undefined;
    close?.();
  });

  it("configures an Express MCP endpoint", async () => {
    void mcpStreamableServer(createServer);
    await vi.waitFor(() => expect(app.listen).toHaveBeenCalled());

    expect(express.json).toHaveBeenCalledOnce();
    expect(app.use).toHaveBeenCalledWith("json-middleware");
    expect(app.post).toHaveBeenCalledWith("/mcp", expect.any(Function));
  });

  it.each(["GET", "DELETE"])("answers 405 to %s requests, which a stateless endpoint does not serve", async (method) => {
    void mcpStreamableServer(createServer);
    await vi.waitFor(() => expect(routeHandlers.get(`${method} /mcp`)).toBeDefined());

    const res = {status: vi.fn().mockReturnThis(), set: vi.fn().mockReturnThis(), json: vi.fn()};

    routeHandlers.get(`${method} /mcp`)!({}, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.set).toHaveBeenCalledWith("Allow", "POST");
    expect(res.json).toHaveBeenCalledWith({jsonrpc: "2.0", error: {code: -32000, message: "Method not allowed."}, id: null});
    expect(createServer).not.toHaveBeenCalled();
  });

  it("creates a transport and dispatches each MCP request", async () => {
    void mcpStreamableServer(createServer);
    await vi.waitFor(() => expect(routeHandlers.get("/mcp")).toBeDefined());
    const on = vi.fn();
    const req = {body: {jsonrpc: "2.0"}};
    const res = {on};

    await routeHandlers.get("/mcp")!(req, res);

    const transport = NodeStreamableHTTPServerTransport.mock.results[0].value;
    expect(NodeStreamableHTTPServerTransport).toHaveBeenCalledWith({sessionIdGenerator: undefined, enableJsonResponse: true});
    expect(createServer).toHaveBeenCalledOnce();
    expect(servers[0].connect).toHaveBeenCalledWith(transport);
    expect(transport.handleRequest).toHaveBeenCalledWith(req, res, req.body);

    on.mock.calls.find(([event]) => event === "close")![1]();
    expect(transport.close).toHaveBeenCalledOnce();
  });

  it("rejects when Express cannot start", async () => {
    const result = mcpStreamableServer(createServer);
    await vi.waitFor(() => expect(listenServer.on).toHaveBeenCalledWith("error", expect.any(Function)));
    const error = new Error("port unavailable");
    listenServer.on.mock.calls.find(([event]) => event === "error")![1](error);

    await expect(result).rejects.toThrow(error);
  });
});
