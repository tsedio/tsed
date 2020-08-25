import {AcceptMime, AcceptMimesMiddleware, EndpointMetadata, Get, PlatformRequest, PlatformTest} from "@tsed/common";
import {catchError} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest} from "../../../../../test/helper";

const sandbox = Sinon.createSandbox();

describe("AcceptMimesMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should accept type", async () => {
    class Test {
      @Get("/")
      @AcceptMime("application/json")
      get() {}
    }

    const endpoint = EndpointMetadata.get(Test, "get");
    const request: any = new FakeRequest({
      sandbox,
      headers: {
        accept: "application/json"
      }
    });
    const ctx = PlatformTest.createRequestContext({
      request: new PlatformRequest(request),
      endpoint
    });

    const middleware = await PlatformTest.invoke<AcceptMimesMiddleware>(AcceptMimesMiddleware);
    middleware.use(ctx);

    expect(request.accepts).to.have.been.calledWithExactly(["application/json"]);
  });
  it("should refuse type", async () => {
    class Test {
      @Get("/")
      @AcceptMime("application/json")
      get() {}
    }

    const endpoint = EndpointMetadata.get(Test, "get");
    const request: any = new FakeRequest({
      sandbox,
      headers: {
        accept: "application/xml"
      }
    });
    const ctx = PlatformTest.createRequestContext({
      request: new PlatformRequest(request),
      endpoint
    });
    const middleware = await PlatformTest.invoke<AcceptMimesMiddleware>(AcceptMimesMiddleware);

    const error: any = catchError(() => middleware.use(ctx));

    expect(error.message).to.equal("You must accept content-type application/json");
  });
});
