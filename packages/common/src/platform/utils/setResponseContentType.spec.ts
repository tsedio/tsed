import {EndpointMetadata, Get, PlatformResponse, PlatformTest} from "@tsed/common";
import {Returns} from "@tsed/schema";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";
import {setResponseContentType} from "./setResponseContentType";

const sandbox = Sinon.createSandbox();

describe("setResponseContentType", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should set the appropriate content type", async () => {
    class Test {
      @Get("/")
      @(Returns(200).ContentType("text/html"))
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    sandbox.stub(ctx.response, "render").resolves("HTML");

    ctx.data = {data: "data"};

    await setResponseContentType(ctx.data, ctx);

    expect(ctx.response.raw.contentType).to.have.been.calledWithExactly("text/html");
  });
  it("should set the json content-type", async () => {
    class Test {
      @Get("/")
      @(Returns(200).ContentType("application/json"))
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    sandbox.stub(ctx.response, "render").resolves("HTML");

    ctx.data = {data: "data"};

    await setResponseContentType(ctx.data, ctx);

    expect(ctx.response.raw.contentType).to.have.been.calledWithExactly("application/json");
  });
  it("should not set the json content-type", async () => {
    class Test {
      @Get("/")
      @(Returns(200).ContentType("application/json"))
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    sandbox.stub(ctx.response, "render").resolves("HTML");

    ctx.data = "data";

    await setResponseContentType(ctx.data, ctx);

    expect(ctx.response.raw.contentType).to.not.have.been.called;
  });
});
