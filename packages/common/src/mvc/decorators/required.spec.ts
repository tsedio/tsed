import {prototypeOf} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {PropertyRegistry} from "../../../src/jsonschema";
import {ParamMetadata} from "../../../src/mvc";
import {Required} from "../../../src/mvc/decorators";

const sandbox = Sinon.createSandbox();
describe("Required", () => {
  before(() => {
    sandbox.spy(PropertyRegistry, "get");
    sandbox.spy(ParamMetadata, "get");
  });
  after(() => sandbox.restore());

  describe("when decorator is used as param", () => {
    it("should called with the correct parameters", () => {
      // WHEN
      class Test {
        test(@Required(null) test: string) {
        }
      }

      const metadata = ParamMetadata.get(prototypeOf(Test), "test", 0);
      // THEN
      expect(metadata.required).to.eq(true);

      expect(ParamMetadata.get).to.have.been.calledWithExactly(prototypeOf(Test), "test", 0);
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
