import {
  ContentType,
  EndpointMetadata,
  Get,
  Header,
  Location,
  PlatformHeadersMiddleware,
  PlatformResponse,
  PlatformTest,
  Redirect,
  Status,
} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";

const sandbox = Sinon.createSandbox();
const next = sandbox.stub();
describe("PlatformHeaders", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should set headers, status and contentType", async () => {
    class Test {
      @Get("/")
      @Status(200)
      @Header("x-header", "test")
      @Header("x-header-2", undefined)
      @ContentType("text/plain")
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const middleware: any = PlatformTest.get<PlatformHeadersMiddleware>(PlatformHeadersMiddleware);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    // WHEN
    await middleware.use(ctx, next);

    // THEN
    expect(response.set).to.have.been.calledWithExactly("x-header", "test");
    expect(response.contentType).to.have.been.calledWithExactly("text/plain");
    expect(response.status).to.have.been.calledWithExactly(200);
  });

  it("should redirect", async () => {
    class Test {
      @Get("/")
      @Redirect(301, "/path")
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const middleware: any = PlatformTest.get<PlatformHeadersMiddleware>(PlatformHeadersMiddleware);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    // WHEN
    await middleware.use(ctx, next);

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
    const middleware: any = PlatformTest.get<PlatformHeadersMiddleware>(PlatformHeadersMiddleware);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    // WHEN
    await middleware.use(ctx, next);

    // THEN
    expect(response.location).to.have.been.calledWithExactly("/path");
  });
});
