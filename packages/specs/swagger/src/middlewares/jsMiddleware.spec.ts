import {PlatformTest} from "@tsed/common";
import Fs from "fs";
import {jsMiddleware} from "./jsMiddleware";

describe("jsMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  beforeEach(() => {
    jest.spyOn(Fs, "readFileSync").mockReturnValue("var test=1");
  });
  it("should create a middleware", () => {
    const ctx = PlatformTest.createRequestContext();

    jsMiddleware("/path")(ctx);

    expect(ctx.response.raw.headers).toEqual({
      "content-type": "application/javascript",
      "x-request-id": "id"
    });
    expect(ctx.response.raw.statusCode).toBe(200);
    expect(ctx.response.raw.data).toBe("var test=1");
  });
});
