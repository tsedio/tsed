import {Container, GlobalProviders, InjectorService, OnDestroy, ProviderScope, Scope, Service} from "../../src";

describe("DI", () => {
  @Service()
  @Scope(ProviderScope.INSTANCE)
  class ServiceInstance {
    constructor() {

    }
  }

  @Service()
  class ServiceSingleton {
    constructor() {
    }
  }


  @Service()
  @Scope(ProviderScope.REQUEST)
  class ServiceRequest implements OnDestroy {
    constructor(public serviceSingleton: ServiceSingleton, public serviceInstance: ServiceInstance) {

    }

    $onDestroy(): Promise<any> | void {
      return undefined;
    }
  }

  after(() => {
    GlobalProviders.delete(ServiceSingleton);
    GlobalProviders.delete(ServiceRequest);
    GlobalProviders.delete(ServiceInstance);
  });

  describe("create new injector", () => {
    it("should load all providers with the SINGLETON scope only", async () => {
      // GIVEN
      const injector = new InjectorService();
      const providers = new Container();
      providers.add(ServiceInstance);
      providers.add(ServiceSingleton);
      providers.add(ServiceRequest);

      // WHEN
      await injector.load(providers);
    });
  });
});
