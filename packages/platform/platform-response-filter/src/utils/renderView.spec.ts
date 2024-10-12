import {PlatformTest} from "@tsed/platform-http/testing";
import {EndpointMetadata, Get, Ignore, Property, Returns, View} from "@tsed/schema";

import {renderView} from "./renderView.js";

describe("renderView", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should render content", async () => {
    class Model {
      @Property()
      data: string;

      @Ignore()
      test: string;
    }

    class Test {
      @Get("/")
      @View("view", {options: "options"})
      @Returns(200, Model)
      test() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Test, "test");

    vi.spyOn(ctx.response, "render").mockResolvedValue("HTML");

    ctx.data = {data: "data"};

    await renderView(ctx.data, ctx);

    expect(ctx.response.render).toHaveBeenCalledWith("view", {
      $ctx: ctx,
      data: "data",
      options: "options"
    });
  });
  it("should throw an error", async () => {
    class Test {
      @Get("/")
      @View("view", {options: "options"})
      test() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Test, "test");

    vi.spyOn(ctx.response, "render").mockRejectedValue(new Error("parser error"));

    ctx.data = {data: "data"};

    let actualError: any;
    try {
      await renderView(ctx.data, ctx);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toEqual("Template rendering error: Test.test()\nError: parser error");
  });
});
