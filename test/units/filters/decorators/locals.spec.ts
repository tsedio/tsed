import {ParamTypes} from "@tsed/common";
import {LocalsFilter} from "../../../../packages/common/src/filters/components/LocalsFilter";
import {Locals} from "../../../../packages/common/src/filters/decorators/locals";
import {ParamRegistry} from "../../../../packages/common/src/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

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
