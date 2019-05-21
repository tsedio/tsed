import {GlobalProviders, ProviderType, Service} from "@tsed/di";
import * as Sinon from "sinon";

class Test {
}

describe("Service", () => {
  const serviceRegistry = GlobalProviders.getRegistry(ProviderType.SERVICE);
  before(() => {
    Sinon.stub(serviceRegistry, "merge");
  });

  after(() => {
    // @ts-ignore
    serviceRegistry.merge.restore();
  });

  it("should set metadata", () => {

    // WHEN
    Service()(Test);

    // THEN
    serviceRegistry.merge.should.have.been.calledWithExactly(Test, {
      instance: undefined,
      provide: Test,
      type: ProviderType.SERVICE
    });
  });
});
