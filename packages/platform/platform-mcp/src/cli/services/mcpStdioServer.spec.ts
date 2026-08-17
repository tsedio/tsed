import {McpServer} from "@modelcontextprotocol/server";
import {DITest} from "@tsed/di";
import {beforeEach, describe, expect, it, vi} from "vitest";

import {mcpStdioServer} from "./mcpStdioServer.js";

// Mock the SDK
vi.mock("@modelcontextprotocol/server/stdio", () => ({
  StdioServerTransport: vi.fn(function StdioServerTransport() {
    return {
      connect: vi.fn(),
      close: vi.fn()
    };
  })
}));

describe("mcpStdioServer", () => {
  let mockServer: McpServer;
  let mockConnect: any;

  beforeEach(() => DITest.create());
  beforeEach(async () => {
    vi.clearAllMocks();

    mockConnect = vi.fn().mockResolvedValue(undefined);
    mockServer = {
      connect: mockConnect
    } as any;
  });

  it("should create a StdioServerTransport", async () => {
    await mcpStdioServer(mockServer);

    const {StdioServerTransport} = await import("@modelcontextprotocol/server/stdio");

    expect(StdioServerTransport).toHaveBeenCalledTimes(1);
  });

  it("should connect the server with the transport", async () => {
    await mcpStdioServer(mockServer);

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockConnect).toHaveBeenCalledWith(expect.any(Object));
  });

  it("should return the connection result", async () => {
    mockConnect.mockResolvedValue("connection-result");

    const result = await mcpStdioServer(mockServer);

    expect(result).toBe("connection-result");
  });

  it("should handle connection errors", async () => {
    const error = new Error("Connection failed");
    mockConnect.mockRejectedValue(error);

    await expect(mcpStdioServer(mockServer)).rejects.toThrow("Connection failed");
  });

  it("should dynamically import StdioServerTransport", async () => {
    const importSpy = vi.spyOn(await import("@modelcontextprotocol/server/stdio"), "StdioServerTransport");

    await mcpStdioServer(mockServer);

    expect(importSpy).toHaveBeenCalled();
  });
});
