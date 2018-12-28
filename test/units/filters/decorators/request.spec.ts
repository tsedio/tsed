import {EXPRESS_REQUEST} from "../../../../packages/common/src/filters/constants";
import {Req} from "../../../../packages/common/src/filters/decorators/request";
import {ParamRegistry} from "../../../../packages/common/src/filters/registries/ParamRegistry";
import * as Sinon from "sinon";

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
