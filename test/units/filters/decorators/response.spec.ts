import {EXPRESS_RESPONSE} from "../../../../packages/common/src/filters/constants";
import {Res} from "../../../../packages/common/src/filters/decorators/response";
import {ParamRegistry} from "../../../../packages/common/src/filters/registries/ParamRegistry";
import * as Sinon from "sinon";

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
