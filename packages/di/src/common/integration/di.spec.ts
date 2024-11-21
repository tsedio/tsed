import {afterEach} from "vitest";

import {Inject} from "../decorators/inject.js";
import {Injectable} from "../decorators/injectable.js";
import {Scope} from "../decorators/scope.js";
import {Service} from "../decorators/service.js";
import {Container} from "../domain/Container.js";
import {LocalsContainer} from "../domain/LocalsContainer.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {inject} from "../fn/inject.js";
import {destroyInjector, injector} from "../fn/injector.js";
import {OnDestroy} from "../interfaces/OnDestroy.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";

describe("DI", () => {
  afterEach(() => destroyInjector());

  describe("from injector global container", () => {
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
      const providers = new Container();
      providers.add(ServiceInstance);
      providers.add(ServiceSingleton);
      providers.add(ServiceRequest);

      // WHEN
      await injector().load(providers);

      // THEN
      expect(injector().get(ServiceSingleton)).toEqual(inject(ServiceSingleton));
      expect(injector().get(ServiceRequest)).toBeUndefined();
      expect(injector().get(ServiceInstance)).toBeUndefined();

      expect(injector().invoke(ServiceRequest) === injector().invoke(ServiceRequest)).toEqual(false);
      expect(inject(ServiceInstance) === inject(ServiceInstance)).toEqual(false);

      const locals = new LocalsContainer();
      expect(inject(ServiceRequest, {locals})).toEqual(inject(ServiceRequest, {locals}));
      expect(inject(ServiceInstance, {locals}) === inject(ServiceInstance, {locals})).toEqual(false);
    });
  });
  describe("invoke class with abstract class", () => {
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
      const providers = new Container();
      providers.add(MyService);
      providers.add(NestedService);

      await injector().load(providers);

      expect(injector().get<MyService>(MyService)!.nested).toBeInstanceOf(NestedService);
    });
  });
  describe("invoke class with a symbol", () => {
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
      const providers = new Container();
      providers.add(MyService);
      providers.add(NestedService);

      await injector().load(providers);

      expect(injector().get<MyService>(MyService)!.nested).toBeInstanceOf(NestedService);
    });
  });
  describe("invoke class with a provider", () => {
    it("should invoke class with a another useClass", async () => {
      @Injectable()
      class MyClass {}

      class FakeMyClass {}

      injector().addProvider(MyClass, {
        useClass: FakeMyClass
      });

      const instance = inject(MyClass);

      expect(instance).toBeInstanceOf(FakeMyClass);
      expect(injector().get(MyClass)).toBeInstanceOf(FakeMyClass);

      await injector().load();

      expect(injector().get(MyClass)).toBeInstanceOf(FakeMyClass);
    });
  });
});
