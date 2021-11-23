import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {createReadStream} from "fs";
import Sinon from "sinon";
import {PlatformViews} from "@tsed/platform-views";
import {PlatformResponse} from "./PlatformResponse";

const sandbox = Sinon.createSandbox();

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

    expect(response.raw).to.eq(res);
  });

  describe("statusCode", () => {
    it("should return status code", () => {
      const {res, response} = createResponse();

      res.statusCode = 201;

      expect(response.statusCode).to.equal(201);
    });
  });
  describe("status()", () => {
    it("should set status code", () => {
      const {res, response} = createResponse();
      sandbox.stub(res, "status");
      response.status(204);

      expect(res.status).to.have.been.calledWithExactly(204);
    });
  });
  describe("setHeaders()", () => {
    it("should set headers", () => {
      const {res, response} = createResponse();

      response.setHeaders({"x-token": "token"});

      expect(res.headers).to.deep.eq({
        "x-request-id": "id",
        "x-token": "token"
      });
    });
  });
  describe("contentType()", () => {
    it("should set content Type", () => {
      const {res, response} = createResponse();

      response.contentType("application/json");

      expect(res.headers).to.deep.eq({
        "content-type": "application/json",
        "x-request-id": "id"
      });
    });
  });
  describe("getContentType()", () => {
    it("should get content Type", () => {
      const {res, response} = createResponse();

      res.headers["content-type"] = "application/json";

      expect(response.getContentType()).to.equal("application/json");
    });
  });
  describe("contentLength()", () => {
    it("should set content length", () => {
      const {res, response} = createResponse();

      response.contentLength(5);

      expect(res.headers).to.deep.eq({"content-length": 5, "x-request-id": "id"});
    });
  });
  describe("getContentLength()", () => {
    it("should set content Type", () => {
      const {res, response} = createResponse();

      response.contentLength(5);

      expect(response.getContentLength()).to.equal(5);
    });
  });
  describe("redirect()", () => {
    it("should set redirect", () => {
      const {res, response} = createResponse();

      response.redirect(302, "/path");

      expect(res.headers).to.deep.equal({location: "/path", "x-request-id": "id"});
      expect(res.statusCode).to.equal(302);
    });
  });
  describe("render()", () => {
    it("should return a string", async () => {
      const {response, platformViews} = createResponse();

      response.locals.locale = "fr-FR";
      sandbox.stub(platformViews, "render").resolves("HTML");

      const result = await response.render("view", {
        test: "test"
      });

      expect(platformViews.render).to.have.been.calledWithExactly("view", {
        locale: "fr-FR",
        test: "test"
      });
      expect(result).to.eq("HTML");
    });
  });
  describe("location()", () => {
    it("should set location", () => {
      const {res, response} = createResponse();

      response.location("/path");

      expect(res.headers).to.deep.eq({
        location: "/path",
        "x-request-id": "id"
      });
    });
  });
  describe("body()", () => {
    it("should call body with undefined", () => {
      const {res, response} = createResponse();

      response.body(undefined);

      expect(res.data).to.equal(undefined);
    });
    it("should call body with string", () => {
      const {res, response} = createResponse();

      response.body("string");

      expect(res.data).to.eq("string");
      expect(response.getBody()).to.eq("string");
    });
    it("should call body with stream", () => {
      const {res, response} = createResponse();
      const stream = createReadStream(__dirname + "/__mock__/data.txt");
      sandbox.stub(stream, "pipe");

      response.body(stream);

      expect(stream.pipe).to.have.been.calledWithExactly(res);
    });
    it("should call body with buffer", () => {
      const {res, response} = createResponse();
      const buffer = Buffer.from("string");

      response.body(buffer);

      expect(res.data).to.eq(buffer);
      expect(res.headers).to.deep.eq({
        "content-length": 6,
        "content-type": "application/octet-stream",
        "x-request-id": "id"
      });
    });
    it("should call body with {}", () => {
      const {res, response} = createResponse();

      response.body({});

      expect(res.data).to.deep.eq({});
    });
  });
  describe("destroy()", () => {
    it("should destroy response", async () => {
      const {response} = createResponse();

      expect(response.isDone()).to.eq(false);

      response.destroy();

      expect(response.isDone()).to.eq(true);
    });
  });
  describe("getHeaders()", () => {
    it("should get headers", () => {
      const {res, response} = createResponse();

      res.headers["content-type"] = "application/json";

      expect(response.getHeaders()).to.deep.equal({
        "content-type": "application/json",
        "x-request-id": "id"
      });
    });
  });
});
