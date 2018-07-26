import {RESPONSE_DATA} from "../../../../packages/common/filters/constants";
import {ResponseData} from "../../../../packages/common/filters/decorators/responseData";
import {ParamRegistry} from "../../../../packages/common/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

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
