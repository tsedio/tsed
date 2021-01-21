import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeRequest} from "../../../../../test/helper";
import {PlatformRequest} from "./PlatformRequest";

const sandbox = Sinon.createSandbox();

function createRequest() {
  const req: any = new FakeRequest({sandbox});
  const request = new PlatformRequest(req);

  return {req, request};
}

describe("PlatformRequest", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformRequest instance", () => {
    const {req, request} = createRequest();

    expect(request.raw).to.eq(req);
  });

  describe("secure()", () => {
    it("should return the secure request state (false)", () => {
      const {req, request} = createRequest();

      req.secure = false;
      expect(request.secure).to.equal(false);
    });
    it("should return the secure request state (true)", () => {
      const {req, request} = createRequest();

      req.secure = true;
      expect(request.secure).to.equal(true);
    });
  });

  describe("protocol()", () => {
    it("should return the protocol request state (http)", () => {
      const {req, request} = createRequest();

      req.protocol = "http";
      expect(request.protocol).to.equal("http");
    });
    it("should return the protocol request state (https)", () => {
      const {req, request} = createRequest();

      req.protocol = "https";
      expect(request.protocol).to.equal("https");
    });
  });

  describe("host()", () => {
    it("should return the host", () => {
      const {req, request} = createRequest();

      expect(request.host).to.equal("headerValue");
    });
  });

  describe("accepts()", () => {
    it("should set the accepts header", () => {
      const {req, request} = createRequest();

      request.accepts("application/json");

      expect(req.accepts).to.have.been.calledWithExactly("application/json");
    });
  });

  describe("getters", () => {
    it("should return the expected data", () => {
      const {req, request} = createRequest();

      expect(request.url).to.equal("/");
      expect(request.body).to.deep.equal({
        obj: {
          test: "testValue"
        },
        test: "testValue"
      });
      expect(request.params).to.deep.equal({
        obj: {
          test: "testValue"
        },
        test: "testValue"
      });
      expect(request.query).to.deep.equal({
        obj: {
          test: "testValue"
        },
        test: "testValue"
      });
      expect(request.cookies).to.deep.equal({
        obj: {
          test: "testValue"
        },
        test: "testValue"
      });
      expect(request.session).to.deep.equal({
        obj: {
          test: "testValue"
        },
        test: "testValue"
      });
    });
  });
});
