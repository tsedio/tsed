import {expect} from "chai";
import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry} from "../../../src/mvc";
import {PropertyRegistry} from "../../../src/jsonschema";
import {Required} from "../../../src/mvc/decorators";

const sandbox = Sinon.createSandbox();
describe("Required", () => {
  before(() => {
    sandbox.spy(PropertyRegistry, "get");
    sandbox.spy(ParamRegistry, "get");
  });
  after(() => sandbox.restore());

  describe("when decorator is used as param", () => {
    it("should called with the correct parameters", () => {
      // WHEN
      class Test {
        test(@Required(null) test: string) {}
      }

      const metadata = ParamRegistry.get(prototypeOf(Test), "test", 0);
      // THEN
      expect(metadata.required).to.eq(true);

      expect(ParamRegistry.get).to.have.been.calledWithExactly(prototypeOf(Test), "test", 0);
      expect(metadata.allowedRequiredValues).to.deep.eq([null]);
    });
  });

  describe("when decorator is used as property", () => {
    it("should called with the correct parameters", () => {
      // WHEN
      class Test {
        @Required(null)
        test: string;
      }

      const metadata = PropertyRegistry.get(prototypeOf(Test), "test");

      // THEN
      expect(metadata.required).to.eq(true);

      expect(PropertyRegistry.get).to.have.been.calledWithExactly(prototypeOf(Test), "test");
      expect(metadata.allowedRequiredValues).to.deep.eq([null]);
    });
  });

  describe("when decorator is used in another way", () => {
    it("should called with the correct parameters", () => {
      // WHEN
      let actualError: any;
      try {
        @Required(null)
        class Test {
          test: string;
        }
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).to.deep.eq("Required cannot be used as class decorator on Test");
    });
  });
});
