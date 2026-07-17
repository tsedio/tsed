import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {PlatformTest} from "@tsed/platform-http/testing";
import {defineResource} from "./defineResource.js";
import {inject} from "@tsed/di";

describe("defineResource", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  function expectError(result: any, error: Record<string, unknown>) {
    expect(result.contents[0]).toEqual({
      uri: "tsed://resource",
      mimeType: "plain/text",
      text: error.message
    });
    expect(result.contents[1]).toEqual({
      uri: "tsed://resource",
      mimeType: "application/json",
      text: expect.any(String)
    });
    expect(JSON.parse(result.contents[1].text)).toEqual({
      ...error,
      request_id: expect.any(String)
    });
  }

  it("should wrap handler errors with structured MCP payloads", async () => {
    const token = defineResource({
      name: "failing-resource",
      uri: "tsed://resource",
      handler() {
        throw new Error("boom");
      }
    });

    const definition = inject<any>(token);
    const result = await definition.handler(new URL("tsed://resource"), {} as any);

    expectError(result, {
      code: "E_MCP_RESOURCE_ERROR",
      error_name: "Error",
      message: "boom",
      resource: "failing-resource"
    });
  });

  it("should derive error code from error name and status when available", async () => {
    const token = defineResource({
      name: "http-resource",
      uri: "tsed://resource",
      handler() {
        const er = new Error("Not found") as Error & {status?: number; name: string};
        er.name = "NotFound";
        er.status = 404;
        throw er;
      }
    });

    const definition = inject<any>(token);
    const result = await definition.handler(new URL("tsed://resource"), {} as any);

    expectError(result, {
      status_code: 404,
      code: "E_MCP_RESOURCE_NOT_FOUND",
      error_name: "NotFound",
      message: "Not found",
      resource: "http-resource"
    });
  });

  it("should handle primitive throws safely", async () => {
    const token = defineResource({
      name: "primitive-error-resource",
      uri: "tsed://resource",
      handler() {
        throw "boom";
      }
    });

    const definition = inject<any>(token);
    const result = await definition.handler(new URL("tsed://resource"), {} as any);

    expectError(result, {
      code: "E_MCP_RESOURCE_ERROR",
      message: "boom",
      resource: "primitive-error-resource"
    });
  });

  it("should normalize successful resource payloads", async () => {
    const token = defineResource({
      name: "resource",
      uri: "tsed://resource",
      handler() {
        return {id: "resource-id"} as any;
      }
    });

    const definition = inject<any>(token);
    const result = await definition.handler(new URL("tsed://resource"), {} as any);

    expect(result).toEqual({
      contents: [
        {
          uri: "tsed://resource",
          mimeType: "application/json",
          text: '{\n  "id": "resource-id"\n}'
        }
      ]
    });
  });
});
