import {EXPRESS_RESPONSE} from "../../../../packages/common/filters/constants";
import {Res} from "../../../../packages/common/filters/decorators/response";
import {ParamRegistry} from "../../../../packages/common/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

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
