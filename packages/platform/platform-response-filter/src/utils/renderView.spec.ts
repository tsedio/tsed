import {EndpointMetadata, Get, PlatformTest} from "@tsed/common";
import {Ignore, Property, Returns} from "@tsed/schema";
import {View} from "@tsed/platform-views";
import {expect} from "chai";
import Sinon from "sinon";
import {renderView} from "./renderView";

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

    jest.spyOn(ctx.response, "render").mockResolvedValue("HTML");

    ctx.data = {data: "data"};

    await renderView(ctx.data, ctx);

    expect(ctx.response.render).toBeCalledWith("view", {
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

    jest.spyOn(ctx.response, "render").mockRejectedValue(new Error("parser error"));

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
