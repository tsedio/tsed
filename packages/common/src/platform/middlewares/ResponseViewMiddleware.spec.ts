import {EndpointMetadata, Get, PlatformResponse, PlatformTest, View} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";
import {ResponseViewMiddleware} from "./ResponseViewMiddleware";

const sandbox = Sinon.createSandbox();
describe("ResponseViewMiddleware :", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should render content", async () => {
    class Test {
      @Get("/")
      @View("view", {options: "options"})
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    const middleware = await PlatformTest.invoke<ResponseViewMiddleware>(ResponseViewMiddleware);
    const data = {data: "data"};

    response.render.callsFake((path: any, options: any, cb: Function) => {
      cb(null, "html");
    });

    const result = await middleware.use(data, ctx.endpoint, response);

    expect(result).to.eq("html");
    expect(response.render).to.have.been.calledWithExactly(
      "view",
      {
        data: "data",
        options: "options"
      },
      Sinon.match.func
    );
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

    const middleware = await PlatformTest.invoke<ResponseViewMiddleware>(ResponseViewMiddleware);
    const data = {data: "data"};

    response.render.callsFake((path: any, options: any, cb: Function) => {
      cb(new Error("parser error"));
    });

    let actualError: any;
    try {
      await middleware.use(data, ctx.endpoint, response);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.equal("Template rendering error: Test.test()\nError: parser error");
  });
});
