import * as Sinon from "sinon";
import {Err, ParamRegistry} from "../../../src/filters";
import {EXPRESS_ERR} from "../../../src/filters/constants";

describe("Err", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    Err();
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(EXPRESS_ERR));
});
