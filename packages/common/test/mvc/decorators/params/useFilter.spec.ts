import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry, ParamTypes, UseFilter} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@UseFilter", () => {
  describe("when filter is a class", () => {
    before(() => {
      sandbox.stub(ParamRegistry, "useFilter");
    });
    after(() => {
      sandbox.restore();
    });
    it("should call ParamFilter.useFilter method with the correct parameters", () => {
      class Test {
      }

      class Ctrl {
        test(@UseFilter(ParamTypes.BODY, {
          expression: "expression",
          useConverter: true,
          useValidation: true,
          paramType: ParamTypes.BODY,
          useType: Test
        }) body: Test) {
        }
      }

      ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.BODY, {
        target: prototypeOf(Ctrl),
        propertyKey: "test",
        index: 0,
        expression: "expression",
        useType: Test,
        useConverter: true,
        useValidation: true,
        paramType: ParamTypes.BODY
      });
    });
  });
});
