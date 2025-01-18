import Fs from "node:fs";

import {runInContext} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {jsMiddleware} from "./jsMiddleware.js";

describe("jsMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  beforeEach(() => {
    vi.spyOn(Fs, "readFileSync").mockReturnValue("var test=1");
  });
  it("should create a middleware", async () => {
    const ctx = PlatformTest.createRequestContext();

    await runInContext(ctx, () => jsMiddleware("/path")());

    expect(ctx.response.raw.headers).toEqual({
      "content-type": "application/javascript",
      "x-request-id": "id"
    });
    expect(ctx.response.raw.statusCode).toBe(200);
    expect(ctx.response.raw.data).toBe("var test=1");
  });
});
