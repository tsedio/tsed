import {EndpointMetadata, Get, PlatformResponse, PlatformTest, View} from "@tsed/common";
import {Ignore, Property, Returns} from "@tsed/schema";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";
import {renderView} from "./renderView";

const sandbox = Sinon.createSandbox();

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

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    sandbox.stub(ctx.response, "render").resolves("HTML");

    ctx.data = {data: "data"};

    await renderView(ctx.data, ctx);

    expect(ctx.response.render).to.have.been.calledWithExactly("view", {
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

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);
    sandbox.stub(ctx.response, "render").callsFake(() => {
      throw new Error("parser error");
    });

    ctx.data = {data: "data"};

    let actualError: any;
    try {
      await renderView(ctx.data, ctx);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.equal("Template rendering error: Test.test()\nError: parser error");
  });
});
