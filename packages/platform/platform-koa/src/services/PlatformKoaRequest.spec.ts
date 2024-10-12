import {PlatformTest} from "@tsed/platform-http/testing";

import {PlatformKoaRequest} from "./PlatformKoaRequest.js";

function createRequest() {
  const req = PlatformTest.createRequest();
  const koaRequest = {
    protocol: "http",
    req,
    get ctx() {
      return koaCtx;
    }
  };

  const koaCtx: any = {
    request: koaRequest,
    cookie: {
      test: "test"
    },
    cookies: {
      test: "test"
    },
    session: {
      test: "test"
    }
  };

  const ctx = PlatformTest.createRequestContext({
    event: {
      request: koaRequest,
      koaContext: koaCtx
    },
    RequestKlass: PlatformKoaRequest
  });

  return {req, request: ctx.request, koaCtx, koaRequest};
}

describe("PlatformKoaRequest", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformRequest instance", () => {
    const {koaRequest, request} = createRequest();

    expect(request.raw).toEqual(koaRequest);
  });

  describe("secure", () => {
    it("should get cookies from cookie", () => {
      const {koaCtx, request} = createRequest();
      koaCtx.request.secure = true;

      expect(request.secure).toEqual(true);
    });
  });

  describe("protocol()", () => {
    it("should return the protocol request state (http)", () => {
      const {koaCtx, request} = createRequest();

      koaCtx.request.req.protocol = "http";

      expect(request.protocol).toEqual("http");
    });
    it("should return the protocol request state (https)", () => {
      const {koaCtx, request} = createRequest();

      koaCtx.request.protocol = "https";

      expect(request.protocol).toEqual("https");
    });
  });

  describe("host()", () => {
    it("should return the host", () => {
      const {koaCtx, request} = createRequest();

      koaCtx.request.host = "host";

      expect(request.host).toEqual("host");
    });
  });

  describe("cookies", () => {
    it("should get cookies from cookies", () => {
      const {koaCtx, request} = createRequest();

      koaCtx.cookie = null;

      expect(request.cookies).toEqual({test: "test"});
    });
    it("should get cookies from cookie", () => {
      const {request} = createRequest();

      expect(request.cookies).toEqual({test: "test"});
    });
  });
  describe("session", () => {
    it("should get session", () => {
      const {request} = createRequest();

      expect(request.session).toEqual({test: "test"});
    });
  });
  describe("getReq()", () => {
    it("should return nodejs request", () => {
      const {req, request} = createRequest();

      expect(request.getReq()).toEqual(req);
    });
  });
});
