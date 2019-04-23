import * as Sinon from "sinon";
import {Cookies, ParamRegistry, ParamTypes} from "../../../src/filters";
import {CookiesFilter} from "../../../src/filters/components/CookiesFilter";

class Test {
}

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
