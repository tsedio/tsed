import {PlatformTest} from "@tsed/common";
import {PlatformKoaResponse} from "@tsed/platform-koa";
import {expect} from "chai";
import Sinon from "sinon";

const sandbox = Sinon.createSandbox();

function createResponse() {
  const response = PlatformTest.createResponse();
  const koaCtx = {
    response: {
      res: response
    }
  };

  response.ctx = koaCtx;

  const ctx = PlatformTest.createRequestContext({
    event: {
      response,
      ctx: koaCtx
    },
    ResponseKlass: PlatformKoaResponse
  });

  return {res: response, response: ctx.response};
}

describe("PlatformKoaResponse", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformResponse instance", () => {
    const {res, response} = createResponse();

    expect(response.raw).to.eq(res);
  });

  describe("getRes()", () => {
    it("return res", async () => {
      const {res, response} = createResponse();
      res.res = {};

      const result = await response.getRes();

      expect(result).to.eq(res.res);
    });
  });
  describe("statusCode", () => {
    it("return statusCode", async () => {
      const {response} = createResponse();

      response.status(302);

      expect(response.statusCode).to.eq(302);
    });
  });
  describe("hasStatus", () => {
    it("return hasStatus", async () => {
      const {response} = createResponse();

      response.status(404);
      expect(response.statusCode).to.eq(404);
      expect(response.hasStatus()).to.eq(false);

      response.status(201);
      expect(response.hasStatus()).to.eq(true);
    });
  });
  describe("contentType()", () => {
    it("should set contentType", async () => {
      const {res, response} = createResponse();

      response.contentType("text/html");

      expect(res.type).to.equal("text/html");
    });
  });
  describe("body()", () => {
    it("should set body", async () => {
      const {res, response} = createResponse();

      response.body("body");

      expect(res.body).to.equal("body");
    });
  });
  describe("location", () => {
    it("should set header location", () => {
      const {res, response} = createResponse();

      response.location("https://location");

      expect(res.headers).to.deep.eq({
        location: "https://location",
        "x-request-id": "id"
      });
    });

    it("should go back based on Referrer", async () => {
      const {res, response} = createResponse();

      response.request.raw.headers["referrer"] = "https://location/back";

      await response.location("back");

      expect(res.headers).to.deep.eq({
        location: "https://location/back",
        "x-request-id": "id"
      });
    });

    it("should go back based on default path", async () => {
      const {res, response} = createResponse();

      await response.location("back");

      expect(res.headers).to.deep.eq({
        location: "/",
        "x-request-id": "id"
      });
    });
  });
  describe("redirect", () => {
    it("should set header location (HEAD)", async () => {
      const {res, response} = createResponse();

      res.headers["location"] = "https://location";
      response.request.raw.method = "HEAD";
      res.res = {end: sandbox.stub()};

      await response.redirect(301, "https://location");

      expect(res.body).to.equal("Moved Permanently. Redirecting to https://location");
      expect(response.statusCode).to.equal(301);
      expect(res.headers).to.deep.eq({
        "content-length": 50,
        location: "https://location",
        "x-request-id": "id"
      });
      expect(res.res.end).to.have.been.calledWithExactly();
    });
    it("should set header location (POST)", async () => {
      const {res, response} = createResponse();

      res.headers["location"] = "https://location";
      response.request.raw.method = "POST";
      res.res = {end: sandbox.stub()};

      await response.redirect(301, "https://location");

      expect(res.body).to.equal("Moved Permanently. Redirecting to https://location");
      expect(response.statusCode).to.equal(301);
      expect(res.headers).to.deep.eq({
        "content-length": 50,
        location: "https://location",
        "x-request-id": "id"
      });
      expect(res.res.end).to.have.been.calledWithExactly("Moved Permanently. Redirecting to https://location");
    });
  });
  describe("getHeaders()", () => {
    it("should get headers", () => {
      const {res, response} = createResponse();

      res.headers = {contentType: "application/json"};

      const result = response.getHeaders();

      expect(result).to.deep.eq({contentType: "application/json"});
    });
  });
});
