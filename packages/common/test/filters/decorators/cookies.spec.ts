import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {Cookies, ParamRegistry, ParamTypes} from "../../../src/filters";
import {CookiesFilter} from "../../../src/filters/components/CookiesFilter";

const sandbox = Sinon.createSandbox();
describe("@Cookies", () => {
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
      test(@Cookies("expression", Test) body: Test) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(CookiesFilter, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0,
      expression: "expression",
      useType: Test,
      paramType: ParamTypes.COOKIES,
      useConverter: false,
      useValidation: false
    });
  });
});
