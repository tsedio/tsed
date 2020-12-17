import {expect} from "chai";
import {GlobalProviders, ProviderType, Service} from "@tsed/di";
import Sinon from "sinon";

class Test {}

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
    expect(serviceRegistry.merge).to.have.been.calledWithExactly(Test, {
      instance: undefined,
      provide: Test,
      type: ProviderType.SERVICE
    });
  });
});
