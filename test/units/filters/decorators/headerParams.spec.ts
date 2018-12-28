import {ParamTypes} from "@tsed/common";
import {HeaderParamsFilter} from "../../../../packages/common/src/filters/components/HeaderParamsFilter";
import {HeaderParams} from "../../../../packages/common/src/filters/decorators/headerParams";
import {ParamRegistry} from "../../../../packages/common/src/filters/registries/ParamRegistry";
import * as Sinon from "sinon";

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
