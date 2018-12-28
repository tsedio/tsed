import {ENDPOINT_INFO} from "../../../../packages/common/src/filters/constants";
import {EndpointInfo} from "../../../../packages/common/src/filters/decorators/endpointInfo";
import {ParamRegistry} from "../../../../packages/common/src/filters/registries/ParamRegistry";
import * as Sinon from "sinon";

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
