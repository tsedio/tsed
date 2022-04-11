import {EndpointMetadata, Get, PlatformTest} from "@tsed/common";
import {Redirect, Returns} from "@tsed/schema";
import {expect} from "chai";
import Sinon from "sinon";
import {setResponseHeaders} from "./setResponseHeaders";

const sandbox = Sinon.createSandbox();

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
    expect(ctx.response.getHeaders()).to.deep.equal({"x-request-id": "id", "x-header": "test"});
    expect(ctx.response.statusCode).to.deep.eq(200);
  });

  it("should redirect", async () => {
    class Test {
      @Get("/")
      @Redirect(301, "/path")
      test() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Test, "test");

    Sinon.stub(ctx.response, "redirect");

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    expect(ctx.response.redirect).to.have.been.calledWithExactly(301, "/path");
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

    sandbox.stub(ctx.response.raw, "set");

    // WHEN
    await setResponseHeaders(ctx);

    // THEN
    return expect(ctx.response.raw.set).to.not.have.been.called;
  });
});
