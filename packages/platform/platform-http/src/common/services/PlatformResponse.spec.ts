import {PlatformViews} from "@tsed/platform-views";
import {createReadStream} from "fs";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {PlatformResponse} from "./PlatformResponse.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

vi.mock("on-finished");

function createResponse() {
  const ctx = PlatformTest.createRequestContext();
  const platformViews = PlatformTest.get(PlatformViews);

  return {res: ctx.response.raw, response: ctx.response, platformViews, ctx};
}

describe("PlatformResponse", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformResponse instance", () => {
    const {res, response, ctx} = createResponse();

    expect(response.raw).toEqual(res);
    expect(response.request).toEqual(ctx.request);
  });
  describe("statusCode", () => {
    it("should return status code", () => {
      const {res, response} = createResponse();

      res.statusCode = 201;

      expect(response.statusCode).toEqual(201);
    });
  });
  describe("status()", () => {
    it("should set status code", () => {
      const {res, response} = createResponse();
      vi.spyOn(res, "status").mockReturnValue(undefined);
      response.status(204);

      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
  describe("setHeaders()", () => {
    it("should set headers", () => {
      const {res, response} = createResponse();

      response.setHeaders({"x-token": "token"});

      expect(res.headers).toEqual({
        "x-request-id": "id",
        "x-token": "token"
      });
    });
  });
  describe("contentType()", () => {
    it("should set content Type", () => {
      const {res, response} = createResponse();

      response.contentType("application/json");

      expect(res.headers).toEqual({
        "content-type": "application/json",
        "x-request-id": "id"
      });
    });
  });
  describe("getContentType()", () => {
    it("should get content Type", () => {
      const {res, response} = createResponse();

      res.headers["content-type"] = "application/json";

      expect(response.getContentType()).toEqual("application/json");
    });
  });
  describe("contentLength()", () => {
    it("should set content length", () => {
      const {res, response} = createResponse();

      response.contentLength(5);

      expect(res.headers).toEqual({"content-length": 5, "x-request-id": "id"});
    });
  });
  describe("getContentLength()", () => {
    it("should set content Type", () => {
      const {res, response} = createResponse();

      response.contentLength(5);

      expect(response.getContentLength()).toEqual(5);
    });

    it("should set content Type (size 0)", () => {
      const {res, response} = createResponse();

      response.contentLength(" " as any);

      expect(response.getContentLength()).toEqual(0);
    });
  });
  describe("redirect()", () => {
    it("should set redirect", () => {
      const {res, response} = createResponse();

      response.redirect(302, "/path");

      expect(res.headers).toEqual({location: "/path", "x-request-id": "id", "content-length": 27});
      expect(res.statusCode).toEqual(302);
    });

    it("should set redirect (default status)", () => {
      const {res, response} = createResponse();

      response.redirect(0, "/path");

      expect(res.headers).toEqual({location: "/path", "x-request-id": "id", "content-length": 27});
      expect(res.statusCode).toEqual(302);
    });

    it("should set redirect (301)", () => {
      const {res, response, ctx} = createResponse();
      res.headers["location"] = "https://location";
      ctx.request.getReq().method = "HEAD";

      response.redirect(301, "https://location");

      expect(res.headers).toEqual({
        location: "https://location",
        "x-request-id": "id"
      });
      expect(res.statusCode).toEqual(301);
    });

    it("should set redirect (302, back url)", () => {
      const {res, response, ctx} = createResponse();
      ctx.request.getReq().method = "HEAD";
      ctx.request.headers["referrer"] = "https://referrer.com";

      response.redirect(302, "back");

      expect(res.headers).toEqual({
        location: "https://referrer.com",
        "x-request-id": "id"
      });
      expect(res.statusCode).toEqual(302);
    });
    it("should set redirect (302, back url, default)", () => {
      const {res, response, ctx} = createResponse();
      ctx.request.getReq().method = "HEAD";

      response.redirect(302, "back");

      expect(res.headers).toEqual({
        location: "/",
        "x-request-id": "id"
      });
      expect(res.statusCode).toEqual(302);
    });
  });
  describe("render()", () => {
    it("should return a string", async () => {
      const {response, platformViews} = createResponse();

      response.locals.locale = "fr-FR";
      vi.spyOn(platformViews, "render").mockResolvedValue("HTML");

      const result = await response.render("view", {
        test: "test"
      });

      expect(platformViews.render).toHaveBeenCalledWith("view", {
        locale: "fr-FR",
        test: "test"
      });
      expect(result).toEqual("HTML");
    });
  });
  describe("location()", () => {
    it("should set location", () => {
      const {res, response} = createResponse();

      response.location("/path");

      expect(res.headers).toEqual({
        location: "/path",
        "x-request-id": "id"
      });
    });
  });
  describe("body()", () => {
    it("should call body with undefined", () => {
      const {res, response} = createResponse();

      response.body(undefined);

      expect(res.data).toBeUndefined();
    });
    it("should call body with string", () => {
      const {res, response} = createResponse();

      response.body("string");

      expect(res.data).toEqual("string");
      expect(response.getBody()).toEqual("string");
    });
    it("should call body with stream", () => {
      const {res, response} = createResponse();
      const stream = createReadStream(rootDir + "/__mock__/data.txt");
      vi.spyOn(stream, "pipe").mockReturnValue(undefined as any);

      response.body(stream);

      expect(stream.pipe).toHaveBeenCalledWith(res);
    });
    it("should call body with buffer", () => {
      const {res, response} = createResponse();
      const buffer = Buffer.from("string");

      response.body(buffer);

      expect(res.data).toEqual(buffer);
      expect(res.headers).toEqual({
        "content-length": 6,
        "content-type": "application/octet-stream",
        "x-request-id": "id"
      });
    });
    it("should call body with {}", () => {
      const {res, response} = createResponse();

      response.body({});

      expect(res.data).toEqual({});
    });
  });
  describe("finish()", () => {
    it("should finish context", async () => {
      const {response, ctx} = createResponse();

      expect(response.isDone()).toEqual(false);

      await ctx.finish();

      expect(response.isDone()).toEqual(true);
    });
  });
  describe("getHeaders()", () => {
    it("should get headers", () => {
      const {res, response} = createResponse();

      res.headers["content-type"] = "application/json";

      expect(response.getHeaders()).toEqual({
        "content-type": "application/json",
        "x-request-id": "id"
      });
    });
  });
  describe("response()", () => {
    it("should return the response framework", () => {
      const {res, response} = createResponse();

      expect(response.response).toEqual(res);
    });
  });
  describe("getRes()", () => {
    it("should return the response framework", () => {
      const {res, response} = createResponse();

      expect(response.getRes()).toEqual(res);
    });
  });
  describe("res()", () => {
    it("should return the response framework", () => {
      const {res, response} = createResponse();

      expect(response.res).toEqual(res);
    });
  });
  describe("attachment()", () => {
    it("should set attachment", () => {
      const {res, response} = createResponse();

      res.attachment = vi.fn();

      response.attachment("filename");

      expect(res.attachment).toHaveBeenCalledWith("filename");
    });
  });
  describe("onEnd()", () => {
    it("should listen onEnd event", () => {
      const {res, response} = createResponse();
      const cb = vi.fn();

      res.on = vi.fn();

      response.onEnd(cb);

      expect(res.on).toHaveBeenCalledWith("finish", cb);
    });
  });
  describe("cookie()", () => {
    it("should manipulate cookies", () => {
      const {res, response} = createResponse();

      res.cookie = (...args: any[]) => {
        let value = `${args[0]}=${args[1]}`;

        if (!res.headers["set-cookie"]) {
          res.headers["set-cookie"] = value;
        } else {
          res.headers["set-cookie"] = [].concat(res.headers["set-cookie"], value as any);
        }
      };

      res.clearCookie = (name: string) => {
        res.headers["set-cookie"] = res.headers["set-cookie"].filter((cookie: string) => cookie.startsWith(name + "="));
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
