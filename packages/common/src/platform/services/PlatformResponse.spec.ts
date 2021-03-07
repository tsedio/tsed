import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {createReadStream} from "fs";
import Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";
import {PlatformResponse} from "./PlatformResponse";
import {PlatformViews} from "./PlatformViews";

const sandbox = Sinon.createSandbox();

function createResponse() {
  const res: any = new FakeResponse(sandbox);
  const response = new PlatformResponse(res);
  response.platformViews = PlatformTest.get<PlatformViews>(PlatformViews);

  return {res, response};
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

      response.status(204);

      expect(res.status).to.have.been.calledWithExactly(204);
    });
  });
  describe("setHeaders()", () => {
    it("should set headers", () => {
      const {res, response} = createResponse();

      response.setHeaders({"x-token": "token"});

      expect(res.set).to.have.been.calledWithExactly("x-token", "token");
    });
  });
  describe("contentType()", () => {
    it("should set content Type", () => {
      const {res, response} = createResponse();

      response.contentType("application/json");

      expect(res.contentType).to.have.been.calledWithExactly("application/json");
    });
  });
  describe("getContentType()", () => {
    it("should get content Type", () => {
      const {res, response} = createResponse();

      res.get.returns("application/json");

      expect(response.getContentType()).to.equal("application/json");
      expect(res.get).to.have.been.calledWithExactly("Content-Type");
    });
  });
  describe("contentLength()", () => {
    it("should set content length", () => {
      const {res, response} = createResponse();

      response.contentLength(5);

      expect(res.set).to.have.been.calledWithExactly("Content-Length", "5");
    });
  });
  describe("getContentLength()", () => {
    it("should set content Type", () => {
      const {res, response} = createResponse();

      res.get.returns("5");

      expect(response.getContentLength()).to.equal(5);
      expect(res.get).to.have.been.calledWithExactly("Content-Length");
    });
  });
  describe("redirect()", () => {
    it("should set redirect", () => {
      const {res, response} = createResponse();

      response.redirect(302, "/path");

      expect(res.redirect).to.have.been.calledWithExactly(302, "/path");
    });
  });
  describe("render()", () => {
    it("should return a string", async () => {
      const {response} = createResponse();

      response.locals.locale = "fr-FR";
      sandbox.stub(response.platformViews, "render").resolves("HTML");

      const result = await response.render("view", {
        test: "test"
      });

      expect(response.platformViews.render).to.have.been.calledWithExactly("view", {
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

      expect(res.location).to.have.been.calledWithExactly("/path");
    });
  });
  describe("body()", () => {
    it("should call body with undefined", () => {
      const {res, response} = createResponse();

      response.body(undefined);

      expect(res.send).to.have.been.calledWithExactly();
    });
    it("should call body with string", () => {
      const {res, response} = createResponse();

      response.body("string");

      expect(res.send).to.have.been.calledWithExactly("string");
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

      expect(res.send).to.have.been.calledWithExactly(buffer);
      expect(res.contentType).to.have.been.calledWithExactly("application/octet-stream");
      expect(res.set).to.have.been.calledWithExactly("Content-Length", "6");
    });
    it("should call body with {}", () => {
      const {res, response} = createResponse();

      response.body({});

      expect(res.json).to.have.been.calledWithExactly({});
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

      res.getHeaders.returns({contentType: "application/json"});

      expect(response.getHeaders()).to.deep.equal({contentType: "application/json"});
    });
  });
});
