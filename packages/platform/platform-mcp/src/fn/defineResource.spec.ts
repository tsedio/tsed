import {inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {afterEach, beforeEach, describe, expect, it} from "vitest";

import {defineResource} from "./defineResource.js";

describe("defineResource", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

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

    expect(result).toEqual({
      contents: [],
      _meta: {
        status_code: undefined,
        code: "E_MCP_RESOURCE_ERROR",
        error_name: "Error",
        message: "boom",
        request_id: expect.any(String),
        resource: "failing-resource"
      }
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

    expect(result).toEqual({
      contents: [],
      _meta: {
        status_code: 404,
        code: "E_MCP_RESOURCE_NOT_FOUND",
        error_name: "NotFound",
        message: "Not found",
        request_id: expect.any(String),
        resource: "http-resource"
      }
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

    expect(result).toEqual({
      contents: [],
      _meta: {
        status_code: undefined,
        code: "E_MCP_RESOURCE_ERROR",
        error_name: undefined,
        message: "boom",
        request_id: expect.any(String),
        resource: "primitive-error-resource"
      }
    });
  });
});
