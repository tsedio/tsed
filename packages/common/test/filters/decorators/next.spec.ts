import * as Sinon from "sinon";
import {Next, ParamRegistry} from "../../../src/filters";
import {EXPRESS_NEXT_FN} from "../../../src/filters/constants";

describe("Next", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    Next();
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(EXPRESS_NEXT_FN));
});
