import {GlobalProviders, ProviderType, Service} from "@tsed/common";
import * as Sinon from "sinon";

class Test {}

describe("Service", () => {
  before(() => {
    this.serviceStub = Sinon.stub(GlobalProviders.getRegistry(ProviderType.SERVICE), "merge");

    Service()(Test);
  });

  after(() => {
    this.serviceStub.restore();
  });

  it("should set metadata", () => {
    this.serviceStub.should.have.been.calledWithExactly(Test, {
      instance: undefined,
      provide: Test,
      type: ProviderType.SERVICE
    });
  });
});
