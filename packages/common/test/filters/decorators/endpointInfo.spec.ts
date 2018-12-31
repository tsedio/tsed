import * as Sinon from "sinon";
import {EndpointInfo, ParamRegistry} from "../../../src/filters";
import {ENDPOINT_INFO} from "../../../src/filters/constants";

describe("EndpointInfo", () => {
  before(() => {
    this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
    EndpointInfo();
  });

  after(() => {
    this.decorateStub.restore();
  });

  it("should have been called ParamFilter.decorate method with the correct parameters", () =>
    this.decorateStub.should.have.been.calledOnce.and.calledWithExactly(ENDPOINT_INFO));
});
