import {Scope} from "../decorators/scope.js";
import {Service} from "../decorators/service.js";
import {Container} from "../domain/Container.js";
import {LocalsContainer} from "../domain/LocalsContainer.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {OnDestroy} from "../interfaces/OnDestroy.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";
import {InjectorService} from "../services/InjectorService.js";

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
    constructor(
      public serviceSingleton: ServiceSingleton,
      public serviceInstance: ServiceInstance
    ) {}

    $onDestroy(): Promise<any> | void {
      return undefined;
    }
  }

  afterAll(() => {
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
      const result1: any = injector.invoke(ServiceRequest, {locals});
      const result2: any = injector.invoke(ServiceRequest, {locals});
      const serviceSingleton1: any = injector.invoke(ServiceSingleton, {locals});
      const serviceSingleton2: any = injector.get(ServiceSingleton);

      vi.spyOn(result1, "$onDestroy").mockResolvedValue(undefined);

      await locals.destroy();
      // THEN
      expect(result1).toEqual(result2);
      expect(result1.serviceSingleton).toEqual(serviceSingleton1);
      expect(result1.serviceInstance).toBeInstanceOf(ServiceInstance);

      expect(serviceSingleton1).toEqual(serviceSingleton2);

      return expect(result1.$onDestroy).toHaveBeenCalledWith();
    });
  });
});
