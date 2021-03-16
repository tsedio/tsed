import {prototypeOf} from "@tsed/core";
import {expect} from "chai";
import Sinon from "sinon";
import {Required} from "../../../src/mvc/decorators";
import {ParamMetadata} from "../models/ParamMetadata";
import {PropertyMetadata} from "../models/PropertyMetadata";

const sandbox = Sinon.createSandbox();
describe("Required", () => {
  before(() => {
    sandbox.spy(PropertyMetadata, "get");
    sandbox.spy(ParamMetadata, "get");
  });
  after(() => sandbox.restore());

  describe("when decorator is used as property", () => {
    it("should called with the correct parameters", () => {
      // WHEN
      class Test {
        @Required(null)
        test: string;
      }

      const metadata = PropertyMetadata.get(prototypeOf(Test), "test");

      // THEN
      expect(metadata.required).to.eq(true);

      expect(PropertyMetadata.get).to.have.been.calledWithExactly(prototypeOf(Test), "test");
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

      expect(actualError.message).to.deep.eq("Allow cannot be used as class decorator on Test");
    });
  });
});
