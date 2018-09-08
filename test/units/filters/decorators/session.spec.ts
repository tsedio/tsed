import {ParamTypes} from "@tsed/common";
import {SessionFilter} from "../../../../packages/common/src/filters/components/SessionFilter";
import {Session} from "../../../../packages/common/src/filters/decorators/session";
import {ParamRegistry} from "../../../../packages/common/src/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

class Test {}

describe("Session", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    Session("test", Test);
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(SessionFilter, {
      expression: "test",
      useType: Test,
      paramType: ParamTypes.SESSION
    }));
});
