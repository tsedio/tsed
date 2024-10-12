import {PlatformTest} from "@tsed/platform-http/testing";
import {Get, JsonEntityStore, Redirect, Returns} from "@tsed/schema";

import {createServerlessContext} from "../../test/utils/createServerlessContext.js";
import {setResponseHeaders} from "./setResponseHeaders.js";

describe("setResponseHeaders", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should set headers, status and contentType", async () => {
    class Test {
      @Get("/")
      @(Returns(200).Header("x-header", "test"))
      test() {}
    }

    const ctx = createServerlessContext({
      endpoint: JsonEntityStore.fromMethod(Test, "test")
    });

    vi.spyOn(ctx.response, "setHeaders");
    vi.spyOn(ctx.response, "status");
    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    expect(ctx.response.setHeaders).toHaveBeenCalledWith({"x-header": "test"});
    expect(ctx.response.status).toHaveBeenCalledWith(200);
  });
  it("should not set headers automatically", async () => {
    class Test {
      @Get("/")
      @(Returns(200).Header("x-header"))
      test() {}
    }

    const ctx = createServerlessContext({
      endpoint: JsonEntityStore.fromMethod(Test, "test")
    });

    vi.spyOn(ctx.response, "setHeaders");
    vi.spyOn(ctx.response, "status");
    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    expect(ctx.response.setHeaders).toHaveBeenCalledWith({});
    expect(ctx.response.status).toHaveBeenCalledWith(200);
  });
  it("should redirect with 301", async () => {
    class Test {
      @Get("/")
      @Redirect(301, "/path")
      test() {}
    }

    const ctx = createServerlessContext({
      endpoint: JsonEntityStore.fromMethod(Test, "test")
    });

    vi.spyOn(ctx.response, "redirect");

    // WHEN
    await setResponseHeaders(ctx as any);

    // THEN
    expect(ctx.response.redirect).toHaveBeenCalledWith(301, "/path");
  });
  it("should redirect with default", async () => {
    class Test {
      @Get("/")
      @Redirect(302, "/path")
      test() {}
    }

    const ctx = createServerlessContext({
      endpoint: JsonEntityStore.fromMethod(Test, "test")
    });
    vi.spyOn(ctx.response, "redirect");

    // WHEN
    await setResponseHeaders(ctx as any);

    // THEN
    expect(ctx.response.redirect).toHaveBeenCalledWith(302, "/path");
  });
  it("should redirect with assigned value", async () => {
    class Test {
      @Get("/")
      @Redirect(302, "/path")
      test() {}
    }

    const ctx = createServerlessContext({
      endpoint: JsonEntityStore.fromMethod(Test, "test")
    });
    vi.spyOn(ctx.response, "redirect");

    ctx.response.setHeaders({Location: "/path/other"});

    // WHEN
    await setResponseHeaders(ctx as any);

    // THEN
    expect(ctx.response.redirect).toHaveBeenCalledWith(302, "/path/other");
  });
  it("should do nothing when headers is already sent", async () => {
    class Test {
      @Get("/")
      @(Returns(200).Header("x-header", "test"))
      test() {}
    }

    const ctx = createServerlessContext({
      endpoint: JsonEntityStore.fromMethod(Test, "test")
    });

    await ctx.destroy();

    vi.spyOn(ctx.response, "setHeaders");
    vi.spyOn(ctx.response, "isDone");

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    return expect(ctx.response.isDone).toHaveBeenCalled();
  });
  it("should do nothing if the endpoint isn't an operation", async () => {
    class Test {
      test() {}
    }

    const endpoint = JsonEntityStore.fromMethod(Test, "test");

    const ctx = createServerlessContext({
      endpoint: {} as never
    });

    vi.spyOn(ctx.response, "setHeaders");
    vi.spyOn(ctx.response, "isDone");
    vi.spyOn(ctx.logger, "debug");

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    expect(ctx.response.isDone).toHaveBeenCalled();
    expect(ctx.logger.debug).toHaveBeenCalledWith({
      event: "MISSING_OPERATION_METADATA",
      message: "No operation found on the endpoint. The response headers are not set.",
      endpoint: {}
    });
  });
});
