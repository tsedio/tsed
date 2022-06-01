import {PlatformTest} from "@tsed/common";
import {PlatformRequest} from "./PlatformRequest";
import {createSandbox} from "sinon";

function createRequest() {
  const $ctx = PlatformTest.createRequestContext();

  return {req: $ctx.request.request, request: $ctx.request};
}

const sandbox = createSandbox();
describe("PlatformRequest", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformRequest instance", () => {
    const request = PlatformTest.createRequest();
    const $ctx = PlatformTest.createRequestContext({
      event: {
        request
      }
    });

    expect($ctx.request.raw).toEqual(request);
  });

  describe("secure()", () => {
    it("should return the secure request state (false)", () => {
      const $ctx = PlatformTest.createRequestContext();

      $ctx.request.request.secure = false;

      expect($ctx.request.secure).toEqual(false);
    });
    it("should return the secure request state (true)", () => {
      const $ctx = PlatformTest.createRequestContext();

      $ctx.request.request.secure = true;
      expect($ctx.request.secure).toEqual(true);
    });
  });

  describe("protocol()", () => {
    it("should return the protocol request state (http)", () => {
      const $ctx = PlatformTest.createRequestContext();

      $ctx.request.request.protocol = "http";

      expect($ctx.request.protocol).toEqual("http");
    });
    it("should return the protocol request state (https)", () => {
      const {req, request} = createRequest();

      req.protocol = "https";
      expect(request.protocol).toEqual("https");
    });
  });

  describe("host()", () => {
    it("should return the host", () => {
      const {request} = createRequest();

      request.raw.headers["host"] = "host";

      expect(request.host).toEqual("host");
    });
  });

  describe("accepts()", () => {
    it("should set the accepts header", () => {
      const {req, request} = createRequest();

      jest.spyOn(req, "accepts");

      request.accepts("application/json");

      expect(req.accepts).toBeCalledWith("application/json");
    });
  });

  describe("getters", () => {
    it("should return the expected data", () => {
      const {request} = createRequest();
      request.raw.originalUrl = "/";
      request.raw.query =
        request.raw.session =
        request.raw.cookies =
        request.raw.params =
        request.raw.body =
          {
            obj: {
              test: "testValue"
            },
            test: "testValue"
          };

      expect(request.url).toEqual("/");
      expect(request.body).toEqual({
        obj: {
          test: "testValue"
        },
        test: "testValue"
      });
      expect(request.params).toEqual({
        obj: {
          test: "testValue"
        },
        test: "testValue"
      });
      expect(request.query).toEqual({
        obj: {
          test: "testValue"
        },
        test: "testValue"
      });
      expect(request.cookies).toEqual({
        obj: {
          test: "testValue"
        },
        test: "testValue"
      });
      expect(request.session).toEqual({
        obj: {
          test: "testValue"
        },
        test: "testValue"
      });
    });
  });
});
