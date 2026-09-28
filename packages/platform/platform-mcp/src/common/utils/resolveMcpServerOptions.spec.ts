import {DITest, injector} from "@tsed/di";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import {resolveMcpServerOptions} from "./createMcpServer.js";

describe("resolveMcpServerOptions", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("resolves configured and decorated definitions once", () => {
    const configuredTool = Symbol("configured-tool");
    const decoratedTool = Symbol("decorated-tool");
    const configuredResource = Symbol("configured-resource");
    const decoratedPrompt = Symbol("decorated-prompt");
    const configuredHandler = vi.fn();
    const decoratedHandler = vi.fn();

    injector().add(configuredTool, {useValue: {name: "configured-tool", handler: configuredHandler}});
    injector().add(decoratedTool, {
      type: MCP_PROVIDER_TYPES.TOOL,
      useValue: {name: "decorated-tool", handler: decoratedHandler}
    });
    injector().add(configuredResource, {useValue: {uri: "file:///configured", handler: vi.fn()}});
    injector().add(decoratedPrompt, {
      type: MCP_PROVIDER_TYPES.PROMPT,
      useValue: {name: "decorated-prompt", handler: vi.fn()}
    });

    const options = resolveMcpServerOptions({
      tools: [configuredTool, decoratedTool],
      resources: [configuredResource]
    });

    expect(options.tools).toEqual([
      {name: "configured-tool", handler: configuredHandler},
      {name: "decorated-tool", handler: decoratedHandler}
    ]);
    expect(options.resources).toEqual([{name: String(configuredResource), uri: "file:///configured", handler: expect.any(Function)}]);
    expect(options.prompts).toEqual([{name: "decorated-prompt", handler: expect.any(Function)}]);
  });

  it("keeps settings metadata while resolving registration definitions", () => {
    const options = resolveMcpServerOptions({
      name: "inventory",
      path: "/inventory/mcp",
      transportOptions: {enableJsonResponse: false}
    });

    expect(options).toMatchObject({
      name: "inventory",
      path: "/inventory/mcp",
      transportOptions: {enableJsonResponse: false},
      tools: [],
      prompts: [],
      resources: []
    });
  });
});
