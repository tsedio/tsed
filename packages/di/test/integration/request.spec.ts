import {expect} from "chai";
import Sinon from "sinon";
import {LocalsContainer, Container, GlobalProviders, InjectorService, OnDestroy, ProviderScope, Scope, Service} from "@tsed/di";

describe("DI Request", () => {
  @Service()
  @Scope(ProviderScope.INSTANCE)
  class ServiceInstance {
    constructor() {}
  }

  @Service()
  class ServiceSingleton {
    constructor() {}
  }

  @Service()
  @Scope(ProviderScope.REQUEST)
  class ServiceRequest implements OnDestroy {
    constructor(public serviceSingleton: ServiceSingleton, public serviceInstance: ServiceInstance) {}

    $onDestroy(): Promise<any> | void {
      return undefined;
    }
  }

  after(() => {
    GlobalProviders.delete(ServiceSingleton);
    GlobalProviders.delete(ServiceRequest);
    GlobalProviders.delete(ServiceInstance);
  });

  describe("when invoke a service declared as REQUEST", () => {
    it("should get a new instance of ServiceRequest", async () => {
      // GIVEN
      const injector = new InjectorService();
      const container = new Container();

      container.addProvider(ServiceSingleton);
      container.addProvider(ServiceRequest);
      container.addProvider(ServiceInstance);

      await injector.load(container);

      // we use a local container to create a new context
      const locals = new LocalsContainer();

      // WHEN
      const result1: any = injector.invoke(ServiceRequest, locals);
      const result2: any = injector.invoke(ServiceRequest, locals);
      const serviceSingleton1: any = injector.invoke(ServiceSingleton, locals);
      const serviceSingleton2: any = injector.get(ServiceSingleton);

      Sinon.stub(result1, "$onDestroy");

      await locals.destroy();
      // THEN
      expect(result1).to.eq(result2);
      expect(result1.serviceSingleton).to.eq(serviceSingleton1);
      expect(result1.serviceInstance).to.instanceof(ServiceInstance);

      expect(serviceSingleton1).to.eq(serviceSingleton2);

      return expect(result1.$onDestroy).to.have.been.calledWithExactly();
    });
  });
});
