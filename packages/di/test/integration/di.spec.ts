import {expect} from "chai";
import {
  Container,
  GlobalProviders,
  Inject,
  Injectable,
  InjectorService,
  LocalsContainer,
  OnDestroy,
  ProviderScope,
  Scope,
  Service
} from "@tsed/di";

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
      expect(injector.get(ServiceSingleton)).to.equal(injector.invoke(ServiceSingleton));
      expect(injector.get(ServiceRequest)).to.equal(undefined);
      expect(injector.get(ServiceInstance)).to.equal(undefined);

      expect(injector.invoke(ServiceRequest)).to.not.equal(injector.invoke(ServiceRequest));
      expect(injector.invoke(ServiceInstance)).to.not.equal(injector.invoke(ServiceInstance));

      const locals = new LocalsContainer();
      expect(injector.invoke(ServiceRequest, locals)).to.equal(injector.invoke(ServiceRequest, locals));
      expect(injector.invoke(ServiceInstance, locals)).to.not.equal(injector.invoke(ServiceInstance, locals));
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

    after(() => {
      GlobalProviders.delete(MyService);
      GlobalProviders.delete(NestedService);
    });

    it("should inject the expected class", async () => {
      const injector = new InjectorService();
      const providers = new Container();
      providers.add(MyService);
      providers.add(NestedService);

      await injector.load(providers);

      expect(injector.get<MyService>(MyService)!.nested).to.be.instanceOf(NestedService);
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

    after(() => {
      GlobalProviders.delete(MyService);
      GlobalProviders.delete(NestedService);
    });

    it("should inject the expected class", async () => {
      const injector = new InjectorService();
      const providers = new Container();
      providers.add(MyService);
      providers.add(NestedService);

      await injector.load(providers);

      expect(injector.get<MyService>(MyService)!.nested).to.be.instanceOf(NestedService);
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

      expect(instance).to.be.instanceOf(FakeMyClass);
      expect(injector.get(MyClass)).to.be.instanceOf(FakeMyClass);

      await injector.load();

      expect(injector.get(MyClass)).to.be.instanceOf(FakeMyClass);
    });
  });
});
