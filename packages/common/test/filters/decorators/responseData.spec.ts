import * as Sinon from "sinon";
import {ParamRegistry, ResponseData} from "../../../src/filters";
import {RESPONSE_DATA} from "../../../src/filters/constants";

describe("ResponseData", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    ResponseData();
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(RESPONSE_DATA));
});
