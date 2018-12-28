import {RESPONSE_DATA} from "../../../../packages/common/src/filters/constants";
import {ResponseData} from "../../../../packages/common/src/filters/decorators/responseData";
import {ParamRegistry} from "../../../../packages/common/src/filters/registries/ParamRegistry";
import * as Sinon from "sinon";

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
