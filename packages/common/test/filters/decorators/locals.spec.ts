import {ParamTypes} from "@tsed/common";
import * as Sinon from "sinon";
import {Locals, ParamRegistry} from "../../../src/filters";
import {LocalsFilter} from "../../../src/filters/components/LocalsFilter";

describe("Locals", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    Locals("test");
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(LocalsFilter, {
      expression: "test",
      useConverter: false,
      paramType: ParamTypes.LOCALS
    }));
});
