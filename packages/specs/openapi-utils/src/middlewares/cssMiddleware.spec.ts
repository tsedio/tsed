import Fs from "node:fs";

import {runInContext} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {cssMiddleware} from "./cssMiddleware.js";

describe("cssMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  beforeEach(() => {
    vi.spyOn(Fs, "readFileSync").mockReturnValue(".css{}");
  });
  it("should create a middleware", async () => {
    const ctx = PlatformTest.createRequestContext();

    await runInContext(ctx, () => cssMiddleware("/path")());

    expect(ctx.response.raw.headers).toEqual({
      "content-type": "text/css",
      "x-request-id": "id"
    });
    expect(ctx.response.raw.statusCode).toEqual(200);
    expect(ctx.response.raw.data).toEqual(".css{}");
  });
});
