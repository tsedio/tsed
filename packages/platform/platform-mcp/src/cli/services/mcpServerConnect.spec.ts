import {DITest, injector} from "@tsed/di";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

const {createMcpServer, resolveMcpServerOptions, MCP_SERVER} = vi.hoisted(() => ({
  createMcpServer: vi.fn(),
  resolveMcpServerOptions: vi.fn(),
  MCP_SERVER: Symbol("MCP_SERVER")
}));

vi.mock("../../common/index.js", () => ({MCP_SERVER}));
vi.mock("../../common/utils/createMcpServer.js", () => ({createMcpServer, resolveMcpServerOptions}));
vi.mock("./mcpStdioServer.js", () => ({mcpStdioServer: vi.fn()}));
vi.mock("./mcpStreamableServer.js", () => ({mcpStreamableServer: vi.fn()}));

import {mcpServerConnect} from "./mcpServerConnect.js";
import {mcpStdioServer} from "./mcpStdioServer.js";
import {mcpStreamableServer} from "./mcpStreamableServer.js";

describe("mcpServerConnect", () => {
  const server = {};

  beforeEach(() => {
    vi.clearAllMocks();
    DITest.create();
    injector().add(MCP_SERVER, {useValue: server});
    resolveMcpServerOptions.mockReturnValue({tools: [], prompts: [], resources: []});
  });
  afterEach(() => DITest.reset());

  it("connects the stdio transport", async () => {
    await mcpServerConnect("stdio");

    expect(mcpStdioServer).toHaveBeenCalledWith(server);
    expect(mcpStreamableServer).not.toHaveBeenCalled();
  });

  it("connects the Streamable HTTP transport", async () => {
    injector().settings.set("mcp", {name: "cli-server"});
    await mcpServerConnect("streamable-http");

    expect(resolveMcpServerOptions).toHaveBeenCalledWith({name: "cli-server"});
    expect(mcpStreamableServer).toHaveBeenCalledWith(expect.any(Function));
    const createServer = vi.mocked(mcpStreamableServer).mock.calls[0][0];

    createServer();

    expect(createMcpServer).toHaveBeenCalledWith({tools: [], prompts: [], resources: []});
    expect(mcpStdioServer).not.toHaveBeenCalled();
  });
});
