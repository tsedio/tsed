import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../test/helper";
import {OidcSecureMiddleware} from "./OidcSecureMiddleware";

const sandbox = Sinon.createSandbox();
describe("OidcSecureMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should check if the request is not secure on GET verb", async () => {
    const middleware = await PlatformTest.invoke<OidcSecureMiddleware>(OidcSecureMiddleware);
    const request = new FakeRequest({
      secure: false,
      method: "GET",
      url: "/path",
      headers: {
        host: "host"
      }
    });
    const response = new FakeResponse(sandbox);

    const ctx = PlatformTest.createRequestContext({
      request: request as any,
      response: response as any
    });

    middleware.use(ctx);

    expect(response.redirect).to.have.been.calledWithExactly(302, "https://host/path");
  });

  it("should check if the request is not secure on HEAD verb", async () => {
    const middleware = await PlatformTest.invoke<OidcSecureMiddleware>(OidcSecureMiddleware);
    const request = new FakeRequest({
      secure: false,
      method: "GET",
      url: "/path",
      headers: {
        host: "host"
      }
    });
    const response = new FakeResponse(sandbox);

    const ctx = PlatformTest.createRequestContext({
      request: request as any,
      response: response as any
    });

    middleware.use(ctx);

    expect(response.redirect).to.have.been.calledWithExactly(302, "https://host/path");
  });

  it("should check if the request is not secure on POST verb", async () => {
    const middleware = await PlatformTest.invoke<OidcSecureMiddleware>(OidcSecureMiddleware);
    const request = new FakeRequest({
      secure: false,
      method: "POST",
      url: "/path",
      headers: {
        host: "host"
      }
    });
    const response = new FakeResponse(sandbox);

    const ctx = PlatformTest.createRequestContext({
      request: request as any,
      response: response as any
    });

    let actualError: any;
    try {
      middleware.use(ctx);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.status).to.equal(400);
    expect(actualError.message).to.equal("InvalidRequest");
    expect(actualError.body).to.deep.equal({
      error: "invalid_request",
      error_description: "Do yourself a favor and only use https"
    });
  });

  it("should check if the request is secure on GET verb", async () => {
    const middleware = await PlatformTest.invoke<OidcSecureMiddleware>(OidcSecureMiddleware);
    const request = new FakeRequest({
      secure: true,
      method: "GET",
      url: "/path",
      headers: {
        host: "host"
      }
    });
    const response = new FakeResponse(sandbox);

    const ctx = PlatformTest.createRequestContext({
      request: request as any,
      response: response as any
    });

    middleware.use(ctx);

    expect(response.redirect).to.not.have.been.called;
  });
});
