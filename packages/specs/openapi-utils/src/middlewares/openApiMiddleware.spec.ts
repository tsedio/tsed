import Fs from "node:fs";

import {runInContext} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {openApiMiddleware} from "./openApiMiddleware.js";

describe("openApiMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  beforeEach(() => {
    vi.spyOn(Fs, "readFileSync").mockReturnValue("var test=1");
  });
  it("should create a middleware", async () => {
    const ctx = PlatformTest.createRequestContext();
    const conf = {specVersion: "3.0.1"};

    await runInContext(ctx, () => openApiMiddleware(conf as never)());

    expect(ctx.response.raw.headers).toEqual({
      "x-request-id": "id"
    });
    expect(ctx.response.raw.statusCode).toBe(200);
    expect(ctx.response.raw.data).toEqual({
      info: {
        title: "Api documentation",
        version: "1.0.0"
      },
      openapi: "3.0.1"
    });
  });
});
