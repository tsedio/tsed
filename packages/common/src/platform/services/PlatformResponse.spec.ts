import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";
import {PlatformResponse} from "./PlatformResponse";

const sandbox = Sinon.createSandbox();

function createResponse() {
  const res: any = new FakeResponse(sandbox);
  const response = new PlatformResponse(res);

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

      const result = await response.render("view", {});

      expect(result).to.eq("PlatformResponse.render method is not implemented");
    });
  });
  describe("location()", () => {
    it("should set location", () => {
      const {res, response} = createResponse();

      response.location("/path");

      expect(res.location).to.have.been.calledWithExactly("/path");
    });
  });
  describe("destroy()", () => {
    it("should return a string", async () => {
      const {response} = createResponse();

      const result = await response.render("view", {});

      expect(result).to.eq("PlatformResponse.render method is not implemented");
    });
  });
});
