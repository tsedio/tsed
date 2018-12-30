import {ParamTypes} from "@tsed/common";
import * as Sinon from "sinon";
import {HeaderParams, ParamRegistry} from "../../../src/filters";
import {HeaderParamsFilter} from "../../../src/filters/components/HeaderParamsFilter";

describe("HeaderParams", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    HeaderParams("test");
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(HeaderParamsFilter, {
      expression: "test",
      paramType: ParamTypes.HEADER
    }));
});
