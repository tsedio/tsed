import {PlatformTest} from "@tsed/common";
import {PlatformKoaResponse} from "@tsed/platform-koa";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeResponse} from "../../../../test/helper";

const sandbox = Sinon.createSandbox();

function createResponse() {
  const res: any = new FakeResponse(sandbox);
  const response = new PlatformKoaResponse(res);

  return {res, response};
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
    it("should set header location", async () => {
      const {res, response} = createResponse();

      await response.location("https://location");

      expect(res.set).to.have.been.calledWithExactly("Location", "https://location");
    });

    it("should go back based on Referrer", async () => {
      const {res, response} = createResponse();

      res.ctx = {
        get: sandbox.stub().returns("https://location/back")
      };

      await response.location("back");

      expect(res.set).to.have.been.calledWithExactly("Location", "https://location/back");
      expect(res.ctx.get).to.have.been.calledWithExactly("Referrer");
    });

    it("should go back based on default path", async () => {
      const {res, response} = createResponse();

      res.ctx = {
        get: sandbox.stub()
      };

      await response.location("back");

      expect(res.set).to.have.been.calledWithExactly("Location", "/");
      expect(res.ctx.get).to.have.been.calledWithExactly("Referrer");
    });
  });
  describe("redirect", () => {
    it("should set header location (HEAD)", async () => {
      const {res, response} = createResponse();

      res.get = sandbox.stub().withArgs("Location").returns("https://location");

      res.ctx = {req: {method: "HEAD"}};
      res.res = {
        end: sandbox.stub()
      };

      await response.redirect(301, "https://location");

      expect(res.body).to.equal("Moved Permanently. Redirecting to https://location");
      expect(response.statusCode).to.equal(301);
      expect(res.set.getCall(0)).to.have.been.calledWithExactly("Location", "https://location");
      expect(res.set.getCall(1)).to.have.been.calledWithExactly("Content-Length", "50");
      expect(res.res.end).to.have.been.calledWithExactly();
    });
    it("should set header location (POST)", async () => {
      const {res, response} = createResponse();

      res.get = sandbox.stub().withArgs("Location").returns("https://location");

      res.ctx = {req: {method: "POST"}};
      res.res = {
        end: sandbox.stub()
      };

      await response.redirect(301, "https://location");

      expect(res.body).to.equal("Moved Permanently. Redirecting to https://location");
      expect(response.statusCode).to.equal(301);
      expect(res.set.getCall(0)).to.have.been.calledWithExactly("Location", "https://location");
      expect(res.set.getCall(1)).to.have.been.calledWithExactly("Content-Length", "50");
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
