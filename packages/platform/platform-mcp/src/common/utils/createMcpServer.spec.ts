import {DITest} from "@tsed/di";
import {ResourceTemplate} from "@modelcontextprotocol/server";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {createMcpServer} from "./createMcpServer.js";

describe("createMcpServer", () => {
  beforeEach(() => DITest.create({name: "application", version: "1.2.3"}));
  afterEach(() => DITest.reset());

  it("creates independent server instances from the same resolved definitions", () => {
    const toolHandler = vi.fn();
    const resourceHandler = vi.fn();
    const promptHandler = vi.fn();
    const options = {
      tools: [{name: "search", handler: toolHandler}],
      resources: [{name: "readme", uri: "file:///README.md", handler: resourceHandler}],
      prompts: [{name: "summary", handler: promptHandler}]
    };

    const first = createMcpServer(options);
    const second = createMcpServer(options);

    expect(first).not.toBe(second);
    expect((first as any)._registeredTools.search).toBeDefined();
    expect((first as any)._registeredResources["file:///README.md"]).toBeDefined();
    expect((first as any)._registeredPrompts.summary).toBeDefined();
    expect((second as any)._registeredTools.search).toBeDefined();
  });

  it("uses the application metadata when no MCP identity is configured", () => {
    const server = createMcpServer({tools: [], resources: [], prompts: []});

    expect((server as any).server._serverInfo).toMatchObject({name: "application", version: "1.2.3"});
  });

  it("registers resources backed by a URI template", () => {
    const template = new ResourceTemplate("docs:///{name}", {list: undefined});
    const server = createMcpServer({
      tools: [],
      prompts: [],
      resources: [{name: "documentation", template, handler: vi.fn()}]
    });

    expect((server as any)._registeredResourceTemplates.documentation.resourceTemplate).toBe(template);
  });
});
