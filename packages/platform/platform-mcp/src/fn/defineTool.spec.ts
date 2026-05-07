import {inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {afterEach, beforeEach, describe, expect, it} from "vitest";

import {defineTool} from "./defineTool.js";

describe("defineTool", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should wrap handler errors with structured MCP payloads", async () => {
    const token = defineTool<any>({
      name: "failing-tool",
      description: "Always throws",
      handler() {
        throw new Error("boom");
      }
    });

    const definition = inject<any>(token);

    const result = await definition.handler({}, {} as any);

    expect(result.structuredContent).toEqual({
      status_code: undefined,
      code: "E_MCP_TOOL_ERROR",
      message: "boom",
      request_id: expect.any(String),
      tool: "failing-tool"
    });
  });

  it("should derive error code from error name and status when available", async () => {
    const token = defineTool<any>({
      name: "http-tool",
      handler() {
        const er = new Error("Not found") as Error & {status?: number; name: string};
        er.name = "NotFound";
        er.status = 404;
        throw er;
      }
    });

    const definition = inject<any>(token);
    const result = await definition.handler({}, {} as any);

    expect(result.structuredContent).toEqual({
      status_code: 404,
      code: "E_MCP_TOOL_NOT_FOUND",
      message: "Not found",
      request_id: expect.any(String),
      tool: "http-tool"
    });
  });
});
