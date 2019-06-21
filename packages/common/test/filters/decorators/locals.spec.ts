import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {Locals, ParamRegistry, ParamTypes} from "../../../src/filters";
import {LocalsFilter} from "../../../src/filters/components/LocalsFilter";

const sandbox = Sinon.createSandbox();
describe("@Locals", () => {
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
      test(@Locals("expression") test: any) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(LocalsFilter, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0,
      expression: "expression",
      useConverter: false,
      paramType: ParamTypes.LOCALS
    });
  });
});
