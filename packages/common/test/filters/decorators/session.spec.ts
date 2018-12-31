import {ParamTypes} from "@tsed/common";
import * as Sinon from "sinon";
import {ParamRegistry, Session} from "../../../src/filters";
import {SessionFilter} from "../../../src/filters/components/SessionFilter";

class Test {
}

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
