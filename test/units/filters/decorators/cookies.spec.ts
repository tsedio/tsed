import {ParamTypes} from "@tsed/common";
import {CookiesFilter} from "../../../../packages/common/src/filters/components/CookiesFilter";
import {Cookies} from "../../../../packages/common/src/filters/decorators/cookies";
import {ParamRegistry} from "../../../../packages/common/src/filters/registries/ParamRegistry";
import * as Sinon from "sinon";

class Test {}

describe("Cookies", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    Cookies("test", Test);
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(CookiesFilter, {
      expression: "test",
      useType: Test,
      paramType: ParamTypes.COOKIES
    }));
});
