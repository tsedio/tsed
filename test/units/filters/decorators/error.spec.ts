import {EXPRESS_ERR} from "../../../../packages/common/filters/constants";
import {Err} from "../../../../packages/common/filters/decorators/error";
import {ParamRegistry} from "../../../../packages/common/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

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
