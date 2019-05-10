import {GlobalProviders, ProviderType} from "@tsed/di";
import * as Sinon from "sinon";
import {Interceptor} from "../../src";


describe("@Interceptor", () => {
  const interceptorRegistry = GlobalProviders.getRegistry(ProviderType.INTERCEPTOR);
  before(() => {
    Sinon.stub(interceptorRegistry, "merge");
  });

  after(() => {
    // @ts-ignore
    interceptorRegistry.merge.restore();
  });

  it("should set metadata", () => {
    // GIVEN
    class Test {
    }

    // WHEN
    Interceptor()(Test);

    // THEN
    interceptorRegistry.merge.should.have.been.calledWithExactly(Test, {
      instance: undefined,
      provide: Test,
      type: ProviderType.INTERCEPTOR
    });
  });
});
