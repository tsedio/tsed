import * as Sinon from "sinon";
import {ParamRegistry, Req} from "../../../src/filters";
import {EXPRESS_REQUEST} from "../../../src/filters/constants";

describe("Request", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    Req();
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(EXPRESS_REQUEST));
});
