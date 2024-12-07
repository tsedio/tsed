import {PlatformTest} from "@tsed/platform-http/testing";

import {PlatformFastifyRequest} from "./PlatformFastifyRequest.js";

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

    expect(request.raw).toEqual(req);
  });

  describe("secure", () => {
    it("should get secure info", () => {
      const {req, request} = createRequest();
      req.protocol = "https";

      expect(request.secure).toEqual(true);
    });
  });

  describe("host()", () => {
    it("should return the host", () => {
      const {req, request} = createRequest();

      req.hostname = "host";

      expect(request.host).toEqual("host");
    });
  });

  describe("getReq()", () => {
    it("should return nodejs request", () => {
      const {req, request} = createRequest();
      req.raw = {};

      expect(request.getReq()).toEqual({});
    });
  });
});
