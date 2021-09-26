import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {OidcSecureMiddleware} from "./OidcSecureMiddleware";

const sandbox = Sinon.createSandbox();
describe("OidcSecureMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should check if the request is not secure on GET verb", async () => {
    const middleware = await PlatformTest.invoke<OidcSecureMiddleware>(OidcSecureMiddleware);
    const request = PlatformTest.createRequest({
      secure: false,
      method: "GET",
      url: "/path",
      headers: {
        host: "host"
      }
    });

    const ctx = PlatformTest.createRequestContext({
      event: {
        request
      }
    });
    sandbox.stub(ctx.response, "redirect");

    middleware.use(ctx);

    expect(ctx.response.redirect).to.have.been.calledWithExactly(302, "https://host/path");
  });

  it("should check if the request is not secure on HEAD verb", async () => {
    const middleware = await PlatformTest.invoke<OidcSecureMiddleware>(OidcSecureMiddleware);
    const ctx = PlatformTest.createRequestContext({
      event: {
        request: PlatformTest.createRequest({
          secure: false,
          method: "GET",
          url: "/path",
          headers: {
            host: "host"
          }
        })
      }
    });

    sandbox.stub(ctx.response, "redirect");

    middleware.use(ctx);

    expect(ctx.response.redirect).to.have.been.calledWithExactly(302, "https://host/path");
  });

  it("should check if the request is not secure on POST verb", async () => {
    const middleware = await PlatformTest.invoke<OidcSecureMiddleware>(OidcSecureMiddleware);
    const ctx = PlatformTest.createRequestContext({
      event: {
        request: PlatformTest.createRequest({
          secure: false,
          method: "POST",
          url: "/path",
          headers: {
            host: "host"
          }
        })
      }
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

    const ctx = PlatformTest.createRequestContext({
      event: {
        request: PlatformTest.createRequest({
          secure: true,
          method: "GET",
          url: "/path",
          headers: {
            host: "host"
          }
        })
      }
    });

    sandbox.stub(ctx.response, "redirect");

    middleware.use(ctx);

    expect(ctx.response.redirect).to.not.have.been.called;
  });
});
