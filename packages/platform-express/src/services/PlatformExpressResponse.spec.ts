import {PlatformResponse, PlatformTest} from "@tsed/common";
import {PlatformExpressResponse} from "@tsed/platform-express";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../test/helper";
import "./PlatformExpressResponse";

const sandbox = Sinon.createSandbox();

function createResponse() {
  const res: any = new FakeResponse(sandbox);
  const response = new PlatformExpressResponse(res);

  return {res, response};
}

describe("PlatformResponse", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformResponse instance", () => {
    const {res, response} = createResponse();

    expect(response.raw).to.eq(res);
  });

  describe("render()", () => {
    it("should render view", async () => {
      const {res, response} = createResponse();

      res.render.callsFake((view: any, options: any, cb: any) => {
        cb(null, "HTML");
      });

      const result = await response.render("view", {test: "test"});

      expect(result).to.eq("HTML");
      expect(res.render).to.have.been.calledWithExactly("view", {test: "test"}, Sinon.match.func);
    });

    it("should throw an error", async () => {
      const {res, response} = createResponse();

      res.render.callsFake((view: any, options: any, cb: any) => {
        cb(new Error("parse error"));
      });

      let actualError: any;
      try {
        await response.render("view", {test: "test"});
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).to.eq("parse error");
    });
  });
});
