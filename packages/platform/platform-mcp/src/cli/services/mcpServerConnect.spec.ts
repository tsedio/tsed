import {DITest, injector} from "@tsed/di";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

const {MCP_SERVER} = vi.hoisted(() => ({MCP_SERVER: Symbol("MCP_SERVER")}));

vi.mock("../../common/index.js", () => ({MCP_SERVER}));
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
  });
  afterEach(() => DITest.reset());

  it("connects the stdio transport", async () => {
    await mcpServerConnect("stdio");

    expect(mcpStdioServer).toHaveBeenCalledWith(server);
    expect(mcpStreamableServer).not.toHaveBeenCalled();
  });

  it("connects the Streamable HTTP transport", async () => {
    await mcpServerConnect("streamable-http");

    expect(mcpStreamableServer).toHaveBeenCalledWith(server);
    expect(mcpStdioServer).not.toHaveBeenCalled();
  });
});
