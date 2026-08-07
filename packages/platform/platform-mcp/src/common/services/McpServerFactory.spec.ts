import {DITest, injector} from "@tsed/di";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import {MCP_SERVER} from "./McpServerFactory.js";

describe("McpServerFactory", () => {
  beforeEach(() => DITest.create({name: "test-server", version: "1.0.0"}));
  afterEach(() => DITest.reset());

  it("registers providers configured under mcp", async () => {
    const tool = Symbol("tool");
    const resource = Symbol("resource");
    const prompt = Symbol("prompt");
    const toolHandler = vi.fn();
    const resourceHandler = vi.fn();
    const promptHandler = vi.fn();

    injector().add(tool, {useFactory: () => ({name: "tool", handler: toolHandler})});
    injector().add(resource, {useFactory: () => ({uri: "file:///resource", handler: resourceHandler})});
    injector().add(prompt, {useFactory: () => ({name: "prompt", handler: promptHandler})});
    injector().settings.set("mcp", {tools: [tool], resources: [resource], prompts: [prompt]});

    const server = await DITest.invoke(MCP_SERVER);

    expect((server as any)._registeredTools.tool).toBeDefined();
    expect((server as any)._registeredResources["file:///resource"]).toBeDefined();
    expect((server as any)._registeredPrompts.prompt).toBeDefined();
  });

  it("registers providers discovered by MCP type", async () => {
    const tool = Symbol("tool");
    injector().add(tool, {type: MCP_PROVIDER_TYPES.TOOL, useFactory: () => ({name: "tool", handler: vi.fn()})});

    const server = await DITest.invoke(MCP_SERVER);

    expect((server as any)._registeredTools.tool).toBeDefined();
  });
});
