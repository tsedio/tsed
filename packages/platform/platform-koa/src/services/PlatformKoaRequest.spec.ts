import {PlatformTest} from "@tsed/common";
import {PlatformKoaRequest} from "@tsed/platform-koa";
import {expect} from "chai";

function createRequest() {
  const request = PlatformTest.createRequest();
  const koaCtx = {
    request: {
      protocol: "http",
      req: request
    },
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
  request.ctx = koaCtx;
  const ctx = PlatformTest.createRequestContext({
    event: {
      request,
      ctx: koaCtx
    },
    RequestKlass: PlatformKoaRequest
  });

  return {req: request, request: ctx.request};
}

describe("PlatformKoaRequest", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformRequest instance", () => {
    const {req, request} = createRequest();

    expect(request.raw).to.eq(req);
  });

  describe("secure", () => {
    it("should get cookies from cookie", () => {
      const {req, request} = createRequest();
      req.ctx.request.secure = true;

      expect(request.secure).to.deep.eq(true);
    });
  });

  describe("protocol()", () => {
    it("should return the protocol request state (http)", () => {
      const {req, request} = createRequest();

      req.ctx.request.protocol = "http";

      expect(request.protocol).to.equal("http");
    });
    it("should return the protocol request state (https)", () => {
      const {req, request} = createRequest();

      req.ctx.request.protocol = "https";

      expect(request.protocol).to.equal("https");
    });
  });

  describe("host()", () => {
    it("should return the host", () => {
      const {req, request} = createRequest();

      req.ctx.request.host = "host";

      expect(request.host).to.equal("host");
    });
  });

  describe("cookies", () => {
    it("should get cookies from cookies", () => {
      const {req, request} = createRequest();

      req.ctx.cookie = null;

      expect(request.cookies).to.deep.eq({test: "test"});
    });
    it("should get cookies from cookie", () => {
      const {request} = createRequest();

      expect(request.cookies).to.deep.eq({test: "test"});
    });
  });
  describe("session", () => {
    it("should get session", () => {
      const {req, request} = createRequest();

      expect(request.session).to.deep.eq({test: "test"});
    });
  });
  describe("getReq()", () => {
    it("should return nodejs request", () => {
      const {req, request} = createRequest();
      req.req = {};

      expect(request.getReq()).to.deep.eq({});
    });
  });
});
