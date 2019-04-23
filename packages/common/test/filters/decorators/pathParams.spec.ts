import * as Sinon from "sinon";
import {ParamRegistry, PathParams,ParamTypes} from "../../../src/filters";
import {PathParamsFilter} from "../../../src/filters/components/PathParamsFilter";

class Test {
}

describe("PathParams", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    PathParams("test", Test);
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(PathParamsFilter, {
      expression: "test",
      useType: Test,
      paramType: ParamTypes.PATH
    }));
});
