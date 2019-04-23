import * as Sinon from "sinon";
import {BodyParams, ParamRegistry, ParamTypes} from "../../../src/filters";
import {BodyParamsFilter} from "../../../src/filters/components/BodyParamsFilter";

class Test {
}

describe("BodyParams", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    BodyParams("test", Test);
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(BodyParamsFilter, {
      expression: "test",
      useType: Test,
      useConverter: true,
      useValidation: true,
      paramType: ParamTypes.BODY
    }));
});
