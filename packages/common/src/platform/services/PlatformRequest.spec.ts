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

  describe("accepts()", () => {
    it("should set status code", () => {
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
