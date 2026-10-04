import {DITest, injector, logger} from "@tsed/di";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

const {attachUpstream, createMcpServer, resolveMcpServerOptions, mcpStdioServer, mcpStreamableServer} = vi.hoisted(() => ({
  attachUpstream: vi.fn(),
  createMcpServer: vi.fn(),
  resolveMcpServerOptions: vi.fn(),
  mcpStdioServer: vi.fn(),
  mcpStreamableServer: vi.fn()
}));

vi.mock("../../common/utils/createMcpServer.js", () => ({createMcpServer, resolveMcpServerOptions}));
vi.mock("../../common/utils/attachUpstream.js", () => ({attachUpstream}));
vi.mock("./mcpStdioServer.js", () => ({mcpStdioServer}));
vi.mock("./mcpStreamableServer.js", () => ({mcpStreamableServer}));

import {mcpServerConnect} from "./mcpServerConnect.js";

describe("mcpServerConnect", () => {
  const server = {};

  beforeEach(() => {
    vi.clearAllMocks();
    DITest.create();
    resolveMcpServerOptions.mockReturnValue({tools: [], prompts: [], resources: []});
    createMcpServer.mockReturnValue(server);
  });
  afterEach(() => DITest.reset());

  it("connects the stdio transport", async () => {
    const result = await mcpServerConnect("stdio");

    expect(resolveMcpServerOptions).toHaveBeenCalledWith({});
    expect(createMcpServer).toHaveBeenCalledWith({tools: [], prompts: [], resources: []});
    expect(mcpStdioServer).toHaveBeenCalledWith(server);
    expect(mcpStreamableServer).not.toHaveBeenCalled();
    expect(result).toBe(server);
  });

  it("falls back to an empty MCP configuration", async () => {
    injector().settings.set("mcp", null);

    await mcpServerConnect("stdio");

    expect(resolveMcpServerOptions).toHaveBeenCalledWith({});
  });

  it("resolves once and creates a server only when Streamable HTTP receives a request", async () => {
    const result = {close: vi.fn()};
    const firstServer = {id: "first"};
    const secondServer = {id: "second"};
    injector().settings.set("mcp", {name: "cli-server"});
    createMcpServer.mockReset().mockReturnValueOnce(firstServer).mockReturnValueOnce(secondServer);
    mcpStreamableServer.mockResolvedValue(result);

    await expect(mcpServerConnect("streamable-http")).resolves.toBe(result);

    expect(resolveMcpServerOptions).toHaveBeenCalledWith({name: "cli-server"});
    expect(mcpStreamableServer).toHaveBeenCalledWith(expect.any(Function));
    expect(createMcpServer).not.toHaveBeenCalled();
    const createServer = vi.mocked(mcpStreamableServer).mock.calls[0][0];

    expect(await createServer()).toBe(firstServer);
    expect(await createServer()).toBe(secondServer);

    expect(createMcpServer).toHaveBeenNthCalledWith(1, {tools: [], prompts: [], resources: []});
    expect(createMcpServer).toHaveBeenNthCalledWith(2, {tools: [], prompts: [], resources: []});
    expect(mcpStdioServer).not.toHaveBeenCalled();
  });

  it("attaches the upstream to each Streamable HTTP server", async () => {
    const options = {tools: [], prompts: [], resources: [], upstream: {type: "http", url: "http://localhost/mcp"}};
    resolveMcpServerOptions.mockReturnValue(options);

    await mcpServerConnect("streamable-http");

    const createServer = vi.mocked(mcpStreamableServer).mock.calls[0][0];

    expect(await createServer()).toBe(server);
    expect(attachUpstream).toHaveBeenCalledExactlyOnceWith(server, options);
  });

  it("rejects caller identity placeholders in Streamable HTTP mode", async () => {
    resolveMcpServerOptions.mockReturnValue({
      tools: [],
      prompts: [],
      resources: [],
      upstream: {type: "http", url: "http://localhost/mcp", headers: {authorization: "Bearer ${OAUTH_TOKEN}"}}
    });

    await expect(mcpServerConnect("streamable-http")).rejects.toThrow("does not support ${OAUTH_*} placeholders");
    expect(mcpStreamableServer).not.toHaveBeenCalled();
  });

  it("ignores the upstream in stdio mode", async () => {
    resolveMcpServerOptions.mockReturnValue({tools: [], prompts: [], resources: [], upstream: {type: "stdio", command: "node"}});
    vi.spyOn(logger(), "warn").mockReturnValue(undefined as never);

    await mcpServerConnect("stdio");

    expect(attachUpstream).not.toHaveBeenCalled();
    expect(logger().warn).toHaveBeenCalledWith(expect.objectContaining({event: "MCP_SERVER_CONNECT"}));
  });

  it("propagates resolution failures before creating a transport", async () => {
    const error = new Error("invalid MCP definition");
    resolveMcpServerOptions.mockImplementationOnce(() => {
      throw error;
    });

    await expect(mcpServerConnect("streamable-http")).rejects.toThrow(error);

    expect(createMcpServer).not.toHaveBeenCalled();
    expect(mcpStreamableServer).not.toHaveBeenCalled();
  });

  it("propagates stdio connection failures", async () => {
    const error = new Error("stdio unavailable");
    mcpStdioServer.mockRejectedValueOnce(error);

    await expect(mcpServerConnect("stdio")).rejects.toThrow(error);

    expect(createMcpServer).toHaveBeenCalledWith({tools: [], prompts: [], resources: []});
  });

  it("rejects multiple MCP server settings", async () => {
    injector().settings.set("mcp", [{name: "first"}, {name: "second"}]);

    await expect(mcpServerConnect("stdio")).rejects.toThrow("The MCP CLI supports a single MCP server configuration.");

    expect(resolveMcpServerOptions).not.toHaveBeenCalled();
    expect(createMcpServer).not.toHaveBeenCalled();
  });
});
