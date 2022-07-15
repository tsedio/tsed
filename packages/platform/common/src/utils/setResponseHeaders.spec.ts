import {EndpointMetadata, Get, PlatformTest} from "@tsed/common";
import {Redirect, Returns} from "@tsed/schema";
import {setResponseHeaders} from "./setResponseHeaders";

describe("setResponseHeaders", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should set headers, status and contentType", async () => {
    class Test {
      @Get("/")
      @Returns(200).Header("x-header", "test")
      test() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Test, "test");

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    expect(ctx.response.getHeaders()).toEqual({"x-request-id": "id", "x-header": "test"});
    expect(ctx.response.statusCode).toEqual(200);
  });

  it("should redirect", async () => {
    class Test {
      @Get("/")
      @Redirect(301, "/path")
      test() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Test, "test");

    jest.spyOn(ctx.response, "redirect").mockReturnValue(undefined as any);

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    expect(ctx.response.redirect).toBeCalledWith(301, "/path");
  });

  it("should do nothing when headers is already sent", async () => {
    class Test {
      @Get("/")
      @Returns(200).Header("x-header", "test")
      test() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.response.raw.headersSent = true;

    ctx.endpoint = EndpointMetadata.get(Test, "test");

    jest.spyOn(ctx.response.raw, "set");

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    return expect(ctx.response.raw.set).not.toBeCalled();
  });
});
