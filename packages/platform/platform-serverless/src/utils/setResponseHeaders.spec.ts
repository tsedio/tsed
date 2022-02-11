import {Location, PlatformTest, Redirect} from "@tsed/common";
import {Get} from "@tsed/platform-serverless";
import {JsonEntityStore, Returns} from "@tsed/schema";
import {setResponseHeaders} from "./setResponseHeaders";
import {createServerlessContext} from "../../test/utils/createServerlessContext";

describe("setResponseHeaders", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should set headers, status and contentType", async () => {
    class Test {
      @Get("/")
      @Returns(200).Header("x-header", "test")
      test() {}
    }

    const ctx = createServerlessContext({
      endpoint: JsonEntityStore.fromMethod(Test, "test")
    });

    jest.spyOn(ctx.response, "setHeaders");
    jest.spyOn(ctx.response, "status");
    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    expect(ctx.response.setHeaders).toHaveBeenCalledWith({"x-header": "test"});
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

    jest.spyOn(ctx.response, "redirect");

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
    jest.spyOn(ctx.response, "redirect");

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
    jest.spyOn(ctx.response, "redirect");

    ctx.response.setHeaders({Location: "/path/other"});

    // WHEN
    await setResponseHeaders(ctx as any);

    // THEN
    expect(ctx.response.redirect).toHaveBeenCalledWith(302, "/path/other");
  });
  it("should do nothing when headers is already sent", async () => {
    class Test {
      @Get("/")
      @Returns(200).Header("x-header", "test")
      test() {}
    }

    const ctx = createServerlessContext({
      endpoint: JsonEntityStore.fromMethod(Test, "test")
    });

    await ctx.destroy();

    jest.spyOn(ctx.response, "setHeaders");
    jest.spyOn(ctx.response, "isDone");

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    return expect(ctx.response.isDone).toHaveBeenCalled();
  });
});
