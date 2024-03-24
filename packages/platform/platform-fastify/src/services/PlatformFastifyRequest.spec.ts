import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {PlatformFastifyRequest} from "./PlatformFastifyRequest";

function createRequest() {
  const request = PlatformTest.createRequest();
  const ctx = PlatformTest.createRequestContext({
    event: {
      request
    },
    RequestKlass: PlatformFastifyRequest
  });

  return {req: request, request: ctx.request};
}

describe("PlatformFastifyRequest", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should create a PlatformRequest instance", () => {
    const {req, request} = createRequest();

    expect(request.raw).to.eq(req);
  });

  describe("secure", () => {
    it("should get secure info", () => {
      const {req, request} = createRequest();
      req.protocol = "https";

      expect(request.secure).to.deep.eq(true);
    });
  });

  describe("host()", () => {
    it("should return the host", () => {
      const {req, request} = createRequest();

      req.hostname = "host";

      expect(request.host).to.equal("host");
    });
  });

  describe("getReq()", () => {
    it("should return nodejs request", () => {
      const {req, request} = createRequest();
      req.raw = {};

      expect(request.getReq()).to.deep.eq({});
    });
  });
});
