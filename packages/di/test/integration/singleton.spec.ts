import {expect} from "chai";
import {Container, GlobalProviders, InjectorService, ProviderScope, Scope, Service} from "@tsed/di";

describe("DI Singleton", () => {
  @Service()
  class ServiceSingleton {
    constructor(public injector: InjectorService) {
    }
  }

  @Service()
  @Scope(ProviderScope.REQUEST)
  class ServiceRequest {
    constructor() {

    }
  }

  @Service()
  @Scope(ProviderScope.INSTANCE)
  class ServiceInstance {
    constructor() {

    }
  }

  @Service()
  class ServiceSingletonWithRequestDep {
    constructor(public serviceRequest: ServiceRequest, public serviceRequest2: ServiceRequest) {
    }
  }

  @Service()
  class ServiceSingletonWithInstanceDep {
    constructor(public serviceInstance: ServiceInstance, public serviceInstance2: ServiceInstance) {
    }
  }

  after(() => {
    GlobalProviders.delete(ServiceSingleton);
    GlobalProviders.delete(ServiceRequest);
    GlobalProviders.delete(ServiceInstance);
    GlobalProviders.delete(ServiceSingletonWithRequestDep);
    GlobalProviders.delete(ServiceSingletonWithInstanceDep);
  });

  describe("when it has a SINGLETON dependency", () => {
    it("should get the service instance", async () => {
      // GIVEN
      const injector = new InjectorService();
      const container = new Container();
      container.addProvider(ServiceSingleton);
      container.addProvider(ServiceRequest);
      container.addProvider(ServiceInstance);
      container.addProvider(ServiceSingletonWithRequestDep);
      container.addProvider(ServiceSingletonWithInstanceDep);

      // WHEN
      await injector.load(container);

      // THEN
      expect(injector.get<ServiceSingleton>(ServiceSingleton)!).to.be.instanceof(ServiceSingleton);
    });
  });
  describe("when it has a REQUEST dependency", () => {
    it("should get the instance and REQUEST dependency should be considered as local SINGLETON", async () => {
      // GIVEN
      const injector = new InjectorService();

      const container = new Container();
      container.addProvider(ServiceSingleton);
      container.addProvider(ServiceRequest);
      container.addProvider(ServiceInstance);
      container.addProvider(ServiceSingletonWithRequestDep);
      container.addProvider(ServiceSingletonWithInstanceDep);

      // WHEN
      await injector.load(container);
      const serviceSingletonWithReqDep = injector.get<ServiceSingletonWithRequestDep>(ServiceSingletonWithRequestDep)!;
      const serviceRequest = injector.get<ServiceRequest>(ServiceRequest)!;

      // THEN
      expect(serviceSingletonWithReqDep).to.be.instanceof(ServiceSingletonWithRequestDep);
      expect(serviceSingletonWithReqDep.serviceRequest).to.be.instanceof(ServiceRequest);
      expect(serviceSingletonWithReqDep.serviceRequest2).to.be.instanceof(ServiceRequest);

      // The same service injected twice or more are considered as a Singleton (REQUEST downgraded to SINGLETON)
      expect(serviceSingletonWithReqDep.serviceRequest).to.eq(serviceSingletonWithReqDep.serviceRequest2);

      // The service isn't registered in the injectorService
      expect(serviceRequest).to.eq(undefined);
    });
  });
  describe("when it has a INSTANCE dependency", () => {
    it("should get the service instance", async () => {
      // GIVEN
      const injector = new InjectorService();
      const container = new Container();
      container.addProvider(ServiceSingleton);
      container.addProvider(ServiceRequest);
      container.addProvider(ServiceInstance);
      container.addProvider(ServiceSingletonWithRequestDep);
      container.addProvider(ServiceSingletonWithInstanceDep);
      // WHEN
      await injector.load(container);
      const serviceWithInstDep = injector.get<ServiceSingletonWithInstanceDep>(ServiceSingletonWithInstanceDep)!;
      const serviceInstance = injector.get<ServiceInstance>(ServiceInstance)!;

      // THEN
      expect(serviceWithInstDep).to.be.instanceof(ServiceSingletonWithInstanceDep);
      expect(serviceWithInstDep.serviceInstance).to.be.instanceof(ServiceInstance);
      expect(serviceWithInstDep.serviceInstance2).to.be.instanceof(ServiceInstance);

      // A same service injected twice or more are considered as a new INSTANCE for each injection
      expect(serviceWithInstDep.serviceInstance).to.not.eq(serviceWithInstDep.serviceInstance2);

      // The service isn't registered in the injectorService
      expect(serviceInstance).to.eq(undefined);
    });
  });
});
