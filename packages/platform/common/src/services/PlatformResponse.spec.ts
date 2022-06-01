import {PlatformTest} from "@tsed/common";
import {createReadStream} from "fs";
import {PlatformViews} from "@tsed/platform-views";
import {PlatformResponse} from "./PlatformResponse";

function createResponse() {
  const ctx = PlatformTest.createRequestContext();
  const platformViews = PlatformTest.get(PlatformViews);

  return {res: ctx.response.raw, response: ctx.response, platformViews};
}

describe("PlatformResponse", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformResponse instance", () => {
    const {res, response} = createResponse();

    expect(response.raw).toEqual(res);
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
      jest.spyOn(res, "status").mockReturnValue(undefined);
      response.status(204);

      expect(res.status).toBeCalledWith(204);
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
  });
  describe("redirect()", () => {
    it("should set redirect", () => {
      const {res, response} = createResponse();

      response.redirect(302, "/path");

      expect(res.headers).toEqual({location: "/path", "x-request-id": "id"});
      expect(res.statusCode).toEqual(302);
    });
  });
  describe("render()", () => {
    it("should return a string", async () => {
      const {response, platformViews} = createResponse();

      response.locals.locale = "fr-FR";
      jest.spyOn(platformViews, "render").mockResolvedValue("HTML");

      const result = await response.render("view", {
        test: "test"
      });

      expect(platformViews.render).toBeCalledWith("view", {
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
      const stream = createReadStream(__dirname + "/__mock__/data.txt");
      jest.spyOn(stream, "pipe").mockReturnValue(undefined as any);

      response.body(stream);

      expect(stream.pipe).toBeCalledWith(res);
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
  describe("destroy()", () => {
    it("should destroy response", async () => {
      const {response} = createResponse();

      expect(response.isDone()).toEqual(false);

      response.destroy();

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
});
