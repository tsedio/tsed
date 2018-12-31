import * as Sinon from "sinon";
import {ParamRegistry, Res} from "../../../src/filters";
import {EXPRESS_RESPONSE} from "../../../src/filters/constants";

describe("Response", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    Res();
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(EXPRESS_RESPONSE));
});
