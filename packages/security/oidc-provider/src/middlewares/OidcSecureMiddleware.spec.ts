import {PlatformTest} from "@tsed/platform-http/testing";

import {OidcSecureMiddleware} from "./OidcSecureMiddleware.js";

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
    vi.spyOn(ctx.response, "redirect").mockReturnValue(undefined as any);

    middleware.use(ctx);

    expect(ctx.response.redirect).toHaveBeenCalledWith(302, "https://host/path");
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

    vi.spyOn(ctx.response, "redirect").mockReturnValue(undefined as any);

    middleware.use(ctx);

    expect(ctx.response.redirect).toHaveBeenCalledWith(302, "https://host/path");
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

    expect(actualError.status).toEqual(400);
    expect(actualError.message).toEqual("InvalidRequest");
    expect(actualError.body).toEqual({
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

    vi.spyOn(ctx.response, "redirect").mockReturnValue(undefined as any);

    middleware.use(ctx);

    expect(ctx.response.redirect).not.toHaveBeenCalled();
  });
});
