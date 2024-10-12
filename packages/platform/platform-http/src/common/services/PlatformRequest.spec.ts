import {PlatformHandlerMetadata} from "@tsed/platform-router";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {PlatformRequest} from "./PlatformRequest.js";

function createRequest() {
  const $ctx = PlatformTest.createRequestContext();

  return {req: $ctx.request.request, request: $ctx.request};
}

describe("PlatformRequest", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should create a PlatformRequest instance", () => {
    const request = PlatformTest.createRequest();
    const response = PlatformTest.createResponse();
    const $ctx = PlatformTest.createRequestContext({
      event: {
        request,
        response
      }
    });

    expect($ctx.request.raw).toEqual(request);
    expect($ctx.request.response).toEqual($ctx.response);
    expect($ctx.request.headers).toEqual({});
    expect($ctx.request.get("host")).toEqual(undefined);
    expect($ctx.request.getHeader("host")).toEqual(undefined);
    expect($ctx.request.method).toEqual("GET");
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

  describe("route()", () => {
    it("should return route", () => {
      const $ctx = PlatformTest.createRequestContext();
      $ctx.handlerMetadata = new PlatformHandlerMetadata({
        handler: () => {}
      });
      $ctx.handlerMetadata.path = "/id";

      expect($ctx.request.route).toEqual("/id");
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

      vi.spyOn(req, "accepts");

      request.accepts("application/json");

      expect(req.accepts).toHaveBeenCalledWith("application/json");
    });
  });

  describe("rawBody()", () => {
    it("should return the rawBody", () => {
      const {req, request} = createRequest();
      req.rawBody = "raw";
      const raw = request.rawBody;

      expect(raw).toEqual("raw");
    });
    it("should return the body", () => {
      const {req, request} = createRequest();
      req.body = "raw";
      const raw = request.rawBody;

      expect(raw).toEqual("raw");
    });
  });

  describe("files()", () => {
    it("should return the files", () => {
      const {req, request} = createRequest();
      req.files = "files";

      expect(request.files).toEqual("files");
    });
  });

  describe("getReq()", () => {
    it("should return req", () => {
      const {req, request} = createRequest();

      expect(request.req).toEqual(req);
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
