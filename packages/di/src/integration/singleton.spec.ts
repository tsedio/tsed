import {Scope} from "../decorators/scope";
import {Service} from "../decorators/service";
import {Container} from "../domain/Container";
import {ProviderScope} from "../domain/ProviderScope";
import {GlobalProviders} from "../registries/GlobalProviders";
import {InjectorService} from "../services/InjectorService";

describe("DI Singleton", () => {
  @Service()
  class ServiceSingleton {
    constructor(public injector: InjectorService) {}
  }

  @Service()
  @Scope(ProviderScope.REQUEST)
  class ServiceRequest {
    constructor() {}
  }

  @Service()
  @Scope(ProviderScope.INSTANCE)
  class ServiceInstance {
    constructor() {}
  }

  @Service()
  class ServiceSingletonWithRequestDep {
    constructor(public serviceRequest: ServiceRequest, public serviceRequest2: ServiceRequest) {}
  }

  @Service()
  class ServiceSingletonWithInstanceDep {
    constructor(public serviceInstance: ServiceInstance, public serviceInstance2: ServiceInstance) {}
  }

  afterAll(() => {
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
      expect(injector.get<ServiceSingleton>(ServiceSingleton)!).toBeInstanceOf(ServiceSingleton);
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
      expect(serviceSingletonWithReqDep).toBeInstanceOf(ServiceSingletonWithRequestDep);
      expect(serviceSingletonWithReqDep.serviceRequest).toBeInstanceOf(ServiceRequest);
      expect(serviceSingletonWithReqDep.serviceRequest2).toBeInstanceOf(ServiceRequest);

      // The same service injected twice or more are considered as a Singleton (REQUEST downgraded to SINGLETON)
      expect(serviceSingletonWithReqDep.serviceRequest).toEqual(serviceSingletonWithReqDep.serviceRequest2);

      // The service isn't registered in the injectorService
      expect(serviceRequest).toBeUndefined();
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
      expect(serviceWithInstDep).toBeInstanceOf(ServiceSingletonWithInstanceDep);
      expect(serviceWithInstDep.serviceInstance).toBeInstanceOf(ServiceInstance);
      expect(serviceWithInstDep.serviceInstance2).toBeInstanceOf(ServiceInstance);

      // A same service injected twice or more are considered as a new INSTANCE for each injection
      expect(serviceWithInstDep.serviceInstance === serviceWithInstDep.serviceInstance2).toEqual(false);

      // The service isn't registered in the injectorService
      expect(serviceInstance).toBeUndefined();
    });
  });
});
