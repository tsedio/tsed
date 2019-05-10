import * as Sinon from "sinon";
import {GlobalProviders, InjectorService, OnDestroy, ProviderScope, Scope, Service} from "../../src";
import {LocalsContainer} from "../../src/class/LocalsContainer";

describe("DI Request", () => {
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

  describe("when invoke a service declared as REQUEST", () => {
    it("should get a new instance of ServiceRequest", async () => {
      // GIVEN
      const injector = new InjectorService();
      await injector.load();

      // we use a local container to create a new context
      const locals = new LocalsContainer();

      // WHEN
      const result1: any = await injector.invoke(ServiceRequest, locals);
      const result2: any = await injector.invoke(ServiceRequest, locals);
      const serviceSingleton1: any = await injector.invoke(ServiceSingleton, locals);
      const serviceSingleton2: any = injector.get(ServiceSingleton);

      Sinon.stub(result1, "$onDestroy");

      locals.destroy();
      // THEN
      result1.should.eq(result2);
      result1.serviceSingleton.should.eq(serviceSingleton1);
      result1.serviceInstance.should.instanceof(ServiceInstance);

      serviceSingleton1.should.eq(serviceSingleton2);

      return result1.$onDestroy.should.have.been.called;
    });
  });
});
