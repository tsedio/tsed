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
        test(@Required(null) test: string) {
        }
      }

      const metadata = ParamRegistry.get(prototypeOf(Test), "test", 0);
      // THEN
      metadata.required.should.be.eq(true);

      ParamRegistry.get.should.have.been.calledWithExactly(prototypeOf(Test), "test", 0);
      metadata.allowedRequiredValues.should.deep.eq([null]);
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
      metadata.required.should.be.eq(true);

      PropertyRegistry.get.should.have.been.calledWithExactly(prototypeOf(Test), "test");
      metadata.allowedRequiredValues.should.deep.eq([null]);
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

      actualError.message.should.deep.eq("Required cannot used as class decorator on Test");
    });
  });
});
