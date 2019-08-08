import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry} from "../../../src/mvc";
import {PropertyRegistry} from "../../../src/jsonschema";
import {Allow} from "../../../src/mvc/decorators";

const sandbox = Sinon.createSandbox();
describe("Allow", () => {
  before(() => {
    sandbox.spy(PropertyRegistry, "get");
    sandbox.spy(ParamRegistry, "get");
  });
  after(() => sandbox.restore());

  describe("when decorator is used as param", () => {
    it("should called with the correct parameters", () => {
      // WHEN
      class Test {
        test(@Allow(null) test: string) {
        }
      }

      const metadata = ParamRegistry.get(prototypeOf(Test), "test", 0);
      // THEN
      ParamRegistry.get.should.have.been.calledWithExactly(prototypeOf(Test), "test", 0);
      metadata.allowedRequiredValues.should.deep.eq([null]);
    });
  });

  describe("when decorator is used as property", () => {
    it("should called with the correct parameters (string)", () => {
      // WHEN
      class Test {
        @Allow(null)
        test: string;
      }

      const metadata = PropertyRegistry.get(prototypeOf(Test), "test");

      // THEN
      PropertyRegistry.get.should.have.been.calledWithExactly(prototypeOf(Test), "test");
      metadata.allowedRequiredValues.should.deep.eq([null]);
      metadata.schema.toJSON().should.deep.eq({type: ["string", "null"]});
    });

    it("should called with the correct parameters (class)", () => {
      // WHEN
      class Children {
      }

      class Test {
        @Allow(null)
        test: Children;
      }

      const metadata = PropertyRegistry.get(prototypeOf(Test), "test");

      // THEN
      PropertyRegistry.get.should.have.been.calledWithExactly(prototypeOf(Test), "test");
      metadata.allowedRequiredValues.should.deep.eq([null]);
      metadata.schema.toJSON().should.deep.eq({
        "oneOf": [
          {
            "type": "null"
          },
          {
            "$ref": "#/definitions/Children"
          }
        ]
      });
    });
  });

  describe("when decorator is used in another way", () => {
    it("should called with the correct parameters", () => {
      // WHEN
      let actualError: any;
      try {
        @Allow(null)
        class Test {

          test: string;
        }
      } catch (er) {
        actualError = er;
      }

      actualError.message.should.deep.eq("Allow cannot used as class decorator on Test");
    });
  });
});
