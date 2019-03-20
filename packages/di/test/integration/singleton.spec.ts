import {expect} from "chai";
import {GlobalProviders, InjectorService, ProviderScope, Scope, Service} from "../../src";

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

      // WHEN
      await injector.load();

      // THEN
      injector.get(ServiceSingleton)!.should.be.instanceof(ServiceSingleton);
    });
  });
  describe("when it has a REQUEST dependency", () => {
    it("should get the instance and REQUEST dependency should be considered as local SINGLETON", async () => {
      // GIVEN
      const injector = new InjectorService();

      // WHEN
      await injector.load();
      const serviceSingletonWithReqDep = injector.get<ServiceSingletonWithRequestDep>(ServiceSingletonWithRequestDep)!;
      const serviceRequest = injector.get<ServiceRequest>(ServiceRequest)!;

      // THEN
      serviceSingletonWithReqDep.should.be.instanceof(ServiceSingletonWithRequestDep);
      serviceSingletonWithReqDep.serviceRequest.should.be.instanceof(ServiceRequest);
      serviceSingletonWithReqDep.serviceRequest2.should.be.instanceof(ServiceRequest);

      // The same service injected twice or more are considered as a Singleton (REQUEST downgraded to SINGLETON)
      serviceSingletonWithReqDep.serviceRequest.should.eq(serviceSingletonWithReqDep.serviceRequest2);

      // The service isn't registered in the injectorService
      expect(serviceRequest).to.eq(undefined);
    });
  });
  describe("when it has a INSTANCE dependency", () => {
    it("should get the service instance", async () => {
      // GIVEN
      const injector = new InjectorService();

      // WHEN
      await injector.load();
      const serviceWithInstDep = injector.get<ServiceSingletonWithInstanceDep>(ServiceSingletonWithInstanceDep)!;
      const serviceInstance = injector.get<ServiceInstance>(ServiceInstance)!;

      // THEN
      serviceWithInstDep.should.be.instanceof(ServiceSingletonWithInstanceDep);
      serviceWithInstDep.serviceInstance.should.be.instanceof(ServiceInstance);
      serviceWithInstDep.serviceInstance2.should.be.instanceof(ServiceInstance);

      // A same service injected twice or more are considered as a new INSTANCE for each injection
      serviceWithInstDep.serviceInstance.should.not.eq(serviceWithInstDep.serviceInstance2);

      // The service isn't registered in the injectorService
      expect(serviceInstance).to.eq(undefined);
    });
  });
});
