import {PlatformTest} from "@tsed/platform-http/testing";

import {PlatformKoaRequest} from "./PlatformKoaRequest.js";
import {PlatformKoaResponse} from "./PlatformKoaResponse.js";

function createResponse() {
  const res = PlatformTest.createResponse();
  const req = PlatformTest.createRequest();

  const koaContext: any = {
    response: {}
  };

  const koaResponse: any = Object.assign(res, {
    res,
    get ctx() {
      return koaContext;
    }
  });

  const koaRequest: any = {
    ...req,
    req,
    get ctx() {
      return koaContext;
    }
  };

  koaContext.response = koaResponse;

  const ctx = PlatformTest.createRequestContext({
    event: {
      response: koaResponse,
      request: koaRequest
    },
    ResponseKlass: PlatformKoaResponse,
    RequestKlass: PlatformKoaRequest
  });

  return {res, response: ctx.response as PlatformKoaResponse, ctx, koaResponse, koaRequest, koaContext};
}

describe("PlatformKoaResponse", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformResponse instance", () => {
    const {koaResponse, response} = createResponse();

    expect(response.raw).toEqual(koaResponse);
  });

  describe("getRes()", () => {
    it("return res", async () => {
      const {res, response} = createResponse();

      const result = await response.getRes();

      expect(result).toEqual(res);
    });
  });
  describe("statusCode", () => {
    it("return statusCode", () => {
      const {response} = createResponse();

      response.status(302);

      expect(response.statusCode).toEqual(302);
    });
  });
  describe("hasStatus", () => {
    it("return hasStatus", () => {
      const {response} = createResponse();

      response.status(404);
      expect(response.statusCode).toEqual(404);
      expect(response.hasStatus()).toEqual(false);

      response.status(201);
      expect(response.hasStatus()).toEqual(true);
    });
  });
  describe("contentType()", () => {
    it("should set contentType", () => {
      const {ctx, koaResponse} = createResponse();

      ctx.response.contentType("text/html");

      expect(koaResponse.type).toEqual("text/html");
    });
  });
  describe("body()", () => {
    it("should set body", () => {
      const {response, koaResponse} = createResponse();

      response.body("body");

      expect(koaResponse.body).toEqual("body");
      expect(response.getBody()).toEqual("body");
    });
  });
  describe("location", () => {
    it("should set header location", () => {
      const {res, response} = createResponse();

      response.location("https://location");

      expect(res.headers).toEqual({
        location: "https://location",
        "x-request-id": "id"
      });
    });

    it("should go back based on Referrer", async () => {
      const {res, response} = createResponse();

      response.request.raw.headers["referrer"] = "https://location/back";

      await response.location("back");

      expect(res.headers).toEqual({
        location: "https://location/back",
        "x-request-id": "id"
      });
    });

    it("should go back based on default path", async () => {
      const {res, response} = createResponse();

      await response.location("back");

      expect(res.headers).toEqual({
        location: "/",
        "x-request-id": "id"
      });
    });
  });
  describe("redirect", () => {
    it("should set header location (HEAD)", async () => {
      const {res, response, koaRequest, koaResponse} = createResponse();

      res.headers["location"] = "https://location";
      koaRequest.method = "HEAD";

      await response.redirect(301, "https://location");

      // expect(koaResponse.body).toEqual("Moved Permanently. Redirecting to https://location");
      expect(response.statusCode).toEqual(301);
      expect(res.headers).toEqual({
        location: "https://location",
        "x-request-id": "id"
      });
      expect(res.data).toEqual(undefined);
    });
    it("should set header location (POST)", async () => {
      const {res, response, koaRequest, koaResponse, ctx} = createResponse();

      res.headers["location"] = "https://location";
      koaRequest.method = "POST";

      await response.redirect(301, "https://location");

      // expect(koaResponse.body).toEqual("Moved Permanently. Redirecting to https://location");
      expect(response.statusCode).toEqual(301);
      expect(res.headers).toEqual({
        "content-length": 50,
        location: "https://location",
        "x-request-id": "id"
      });
    });
  });
  describe("getHeaders()", () => {
    it("should get headers", () => {
      const {ctx} = createResponse();

      ctx.response.setHeader("contentType", "application/json");

      const result = ctx.response.getHeaders();

      expect(result).toEqual({
        contenttype: "application/json",
        "x-request-id": "id"
      });
    });
  });
  describe("cookie()", () => {
    it("should manipulate cookies", () => {
      const {res, response, koaContext} = createResponse();
      koaContext.cookies = {};
      koaContext.cookies.set = (...args: any[]) => {
        if (!args[1]) {
          res.headers["set-cookie"] = res.headers["set-cookie"].filter((cookie: string) => cookie.startsWith(args[0] + "="));
          return;
        }

        let value = `${args[0]}=${args[1]}`;

        if (!res.headers["set-cookie"]) {
          res.headers["set-cookie"] = [value];
        } else {
          res.headers["set-cookie"] = [].concat(res.headers["set-cookie"], value as any);
        }
      };

      response.cookie("locale", "fr-FR");
      expect(res.headers).toEqual({
        "set-cookie": ["locale=fr-FR"],
        "x-request-id": "id"
      });

      response.cookie("filename", "test");
      expect(res.headers).toEqual({
        "set-cookie": ["locale=fr-FR", "filename=test"],
        "x-request-id": "id"
      });

      response.cookie("filename", null);

      expect(res.headers).toEqual({
        "set-cookie": ["filename=test"],
        "x-request-id": "id"
      });
    });
  });
});
