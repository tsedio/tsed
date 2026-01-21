import {inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {afterEach, beforeEach, describe, expect, it} from "vitest";

import {defineTool} from "./defineTool.js";

describe("defineTool", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should wrap handler errors with structured MCP payloads", async () => {
    const token = defineTool({
      name: "failing-tool",
      description: "Always throws",
      handler() {
        throw new Error("boom");
      }
    });

    const definition = inject<any>(token);

    const result = await definition.handler({}, {} as any);

    expect(result.structuredContent).toEqual({
      code: "E_MCP_TOOL_ERROR",
      message: "boom"
    });
  });
});
