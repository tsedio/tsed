import {GlobalProviders, Interceptor, ProviderType} from "@tsed/common";
import * as Sinon from "sinon";

class Test {}

describe("@Interceptor", () => {
  before(() => {
    this.serviceStub = Sinon.stub(GlobalProviders.getRegistry(ProviderType.INTERCEPTOR), "merge");

    Interceptor()(Test);
  });

  after(() => {
    this.serviceStub.restore();
  });

  it("should set metadata", () => {
    this.serviceStub.should.have.been.calledWithExactly(Test, {
      instance: undefined,
      provide: Test,
      type: ProviderType.INTERCEPTOR
    });
  });
});
