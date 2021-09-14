import {EndpointMetadata, Get, Location, PlatformResponse, PlatformTest, Redirect} from "@tsed/common";
import {Returns} from "@tsed/schema";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";
import {setResponseHeaders} from "./setResponseHeaders";

const sandbox = Sinon.createSandbox();
const next = sandbox.stub();

describe("setResponseHeaders", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should set headers, status and contentType", async () => {
    class Test {
      @Get("/")
      @(Returns(200).Header("x-header", "test"))
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    expect(response.set).to.have.been.calledWithExactly("x-header", "test");
    expect(response.status).to.have.been.calledWithExactly(200);
  });

  it("should redirect", async () => {
    class Test {
      @Get("/")
      @Redirect(301, "/path")
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    expect(response.redirect).to.have.been.calledWithExactly(301, "/path");
  });

  it("should call location", async () => {
    class Test {
      @Get("/")
      @Location("/path")
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    expect(response.location).to.have.been.calledWithExactly("/path");
  });

  it("should do nothing when headers is already sent", async () => {
    class Test {
      @Get("/")
      @(Returns(200).Header("x-header", "test"))
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    response.headersSent = true;

    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    return expect(response.set).to.not.have.been.called;
  });
});
