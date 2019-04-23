import * as Sinon from "sinon";
import {ParamRegistry, QueryParams, ParamTypes} from "../../../src/filters";
import {QueryParamsFilter} from "../../../src/filters/components/QueryParamsFilter";

class Test {
}

describe("QueryParams", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    QueryParams("test", Test);
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(QueryParamsFilter, {
      expression: "test",
      useType: Test,
      useConverter: true,
      useValidation: true,
      paramType: ParamTypes.QUERY
    }));
});
