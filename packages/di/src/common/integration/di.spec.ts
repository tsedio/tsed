import {Inject} from "../decorators/inject.js";
import {Injectable} from "../decorators/injectable.js";
import {Scope} from "../decorators/scope.js";
import {Service} from "../decorators/service.js";
import {Container} from "../domain/Container.js";
import {LocalsContainer} from "../domain/LocalsContainer.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {OnDestroy} from "../interfaces/OnDestroy.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";
import {InjectorService} from "../services/InjectorService.js";

describe("DI", () => {
  describe("create new injector", () => {
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

    it("should load all providers with the SINGLETON scope only", async () => {
      // GIVEN
      const injector = new InjectorService();
      const providers = new Container();
      providers.add(ServiceInstance);
      providers.add(ServiceSingleton);
      providers.add(ServiceRequest);

      // WHEN
      await injector.load(providers);

      // THEN
      expect(injector.get(ServiceSingleton)).toEqual(injector.invoke(ServiceSingleton));
      expect(injector.get(ServiceRequest)).toBeUndefined();
      expect(injector.get(ServiceInstance)).toBeUndefined();

      expect(injector.invoke(ServiceRequest) === injector.invoke(ServiceRequest)).toEqual(false);
      expect(injector.invoke(ServiceInstance) === injector.invoke(ServiceInstance)).toEqual(false);

      const locals = new LocalsContainer();
      expect(injector.invoke(ServiceRequest, {locals})).toEqual(injector.invoke(ServiceRequest, {locals}));
      expect(injector.invoke(ServiceInstance, {locals}) === injector.invoke(ServiceInstance, {locals})).toEqual(false);
    });
  });

  describe("it should invoke service with abstract class", () => {
    abstract class BaseService {}

    @Injectable()
    class NestedService extends BaseService {}

    class BaseMyService {
      @Inject(NestedService)
      nested: BaseService;
    }

    @Injectable()
    class MyService extends BaseMyService {}

    afterAll(() => {
      GlobalProviders.delete(MyService);
      GlobalProviders.delete(NestedService);
    });

    it("should inject the expected class", async () => {
      const injector = new InjectorService();
      const providers = new Container();
      providers.add(MyService);
      providers.add(NestedService);

      await injector.load(providers);

      expect(injector.get<MyService>(MyService)!.nested).toBeInstanceOf(NestedService);
    });
  });

  describe("it should invoke service with a symbol", () => {
    interface BaseService {}

    const BaseService: unique symbol = Symbol("BaseService");

    @Injectable({provide: BaseService})
    class NestedService implements BaseService {}

    @Injectable()
    class MyService {
      @Inject(BaseService)
      nested: BaseService;
    }

    afterAll(() => {
      GlobalProviders.delete(MyService);
      GlobalProviders.delete(NestedService);
    });

    it("should inject the expected class", async () => {
      const injector = new InjectorService();
      const providers = new Container();
      providers.add(MyService);
      providers.add(NestedService);

      await injector.load(providers);

      expect(injector.get<MyService>(MyService)!.nested).toBeInstanceOf(NestedService);
    });
  });

  describe("invoke class with a provider", () => {
    it("should invoke class with a another useClass", async () => {
      @Injectable()
      class MyClass {}

      class FakeMyClass {}

      const injector = new InjectorService();

      injector.addProvider(MyClass, {
        useClass: FakeMyClass
      });

      const instance = injector.invoke(MyClass);

      expect(instance).toBeInstanceOf(FakeMyClass);
      expect(injector.get(MyClass)).toBeInstanceOf(FakeMyClass);

      await injector.load();

      expect(injector.get(MyClass)).toBeInstanceOf(FakeMyClass);
    });
  });
});
