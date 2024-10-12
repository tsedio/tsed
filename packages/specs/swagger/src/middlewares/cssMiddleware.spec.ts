import {PlatformTest} from "@tsed/platform-http/testing";
import Fs from "fs";

import {cssMiddleware} from "./cssMiddleware.js";

describe("cssMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  beforeEach(() => {
    vi.spyOn(Fs, "readFileSync").mockReturnValue(".css{}");
  });
  it("should create a middleware", () => {
    const ctx = PlatformTest.createRequestContext();

    cssMiddleware("/path")(ctx);

    expect(ctx.response.raw.headers).toEqual({
      "content-type": "text/css",
      "x-request-id": "id"
    });
    expect(ctx.response.raw.statusCode).toEqual(200);
    expect(ctx.response.raw.data).toEqual(".css{}");
  });
});
