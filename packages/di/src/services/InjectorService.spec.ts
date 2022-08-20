import {Configuration} from "@tsed/common";
import {Store} from "@tsed/core";
import {
  Container,
  GlobalProviders,
  Inject,
  Injectable,
  InjectorService,
  LocalsContainer,
  Provider,
  ProviderScope,
  ProviderType,
  registerProvider
} from "@tsed/di";
import {INJECTABLE_PROP} from "../constants/constants";

class Test {
  @Inject()
  prop: InjectorService;

  value: any;
  constant: any;

  constructor() {}

  @Inject()
  test(injectorService: InjectorService) {
    return injectorService;
  }

  test2(@Inject() injectorService: InjectorService) {
    return injectorService;
  }

  test3(o: any) {
    return o + " called ";
  }
}

describe("InjectorService", () => {
  describe("has()", () => {
    it("should return true", () => {
      expect(new InjectorService().has(InjectorService)).toBe(true);
    });

    it("should return false", () => {
      expect(new InjectorService().has(Test)).toBe(false);
    });
  });

  describe("get()", () => {
    it("should return element", () => {
      expect(new InjectorService().get(InjectorService)).toBeInstanceOf(InjectorService);
    });

    it("should return undefined", () => {
      expect(new InjectorService().get(Test)).toBeUndefined();
    });
  });
  describe("getAll()", () => {
    it("should return all instance", () => {
      const injector = new InjectorService();
      injector.addProvider("token", {
        type: ProviderType.VALUE,
        useValue: 1
      });

      expect(!!injector.getAll(ProviderType.VALUE).length).toEqual(true);
      expect(!!injector.getAll(ProviderType.FACTORY).length).toEqual(false);
    });
  });

  describe("toArray()", () => {
    it("should return instances", () => {
      expect(new InjectorService().toArray()).toBeInstanceOf(Array);
    });
  });

  describe("invoke()", () => {
    describe("when we call invoke with rebuild options (SINGLETON)", () => {
      it("should invoke the provider from container", async () => {
        // GIVEN
        const token = class Test {};

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;
        provider.deps = [InjectorService];

        const injector = new InjectorService();
        const container = new Container();
        container.set(token, provider);

        await injector.load(container);

        jest.spyOn(injector as any, "resolve");
        jest.spyOn(injector as any, "invoke");
        jest.spyOn(injector, "getProvider");

        const locals = new LocalsContainer();

        // WHEN

        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals, {rebuild: true});

        // THEN
        expect(result1 !== result2).toEqual(true);
        expect(injector.getProvider).toBeCalledWith(token);

        expect((injector as any).resolve).toBeCalledWith(token, locals, {rebuild: true});
        expect((injector as any).invoke).toBeCalledWith(InjectorService, locals, {
          parent: token
        });
      });
    });
    describe("when provider is a SINGLETON", () => {
      it("should invoke the provider from container", async () => {
        // GIVEN
        const token = class Test {};

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;

        const injector = new InjectorService();
        const container = new Container();
        container.set(token, provider);

        await injector.load(container);

        jest.spyOn(injector as any, "resolve");
        jest.spyOn(injector, "getProvider");

        const locals = new LocalsContainer();

        // WHEN

        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals);

        // THEN
        expect(result1).toEqual(result2);

        return expect((injector as any).resolve).not.toBeCalled();
      });
    });
    describe("when provider is a REQUEST", () => {
      it("should invoke a request from local container", async () => {
        // GIVEN
        const token = class Test {};

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.REQUEST;

        const injector = new InjectorService();
        const container = new Container();
        container.set(token, provider);

        await injector.load(container);

        jest.spyOn(injector as any, "resolve");
        jest.spyOn(injector, "get");
        jest.spyOn(injector, "getProvider");

        const locals = new LocalsContainer(); // LocalContainer for the first request
        const locals2 = new LocalsContainer(); // LocalContainer for the second request

        // WHEN REQ1
        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals);

        // WHEN REQ2
        const result3: any = injector.invoke(token, locals2);

        // THEN
        expect(result1).toEqual(result2);
        expect(result2 !== result3).toEqual(true);

        expect(injector.getProvider).toBeCalledWith(token);
        expect((injector as any).resolve).toBeCalledWith(token, locals, {});
        expect(locals.get(token)).toEqual(result1);
        expect(locals2.get(token)).toEqual(result3);

        return expect(injector.get).not.toBeCalled();
      });
    });
    describe("when provider is a INSTANCE", () => {
      it("should invoke a new instance", async () => {
        // GIVEN
        const token = class Test {};

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.INSTANCE;

        const injector = new InjectorService();
        const container = new Container();
        container.set(token, provider);

        await injector.load(container);

        jest.spyOn(injector as any, "resolve");
        jest.spyOn(injector, "get");
        jest.spyOn(injector, "getProvider");

        const locals = new LocalsContainer(); // LocalContainer for the first request

        // WHEN REQ1
        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals);

        // THEN
        expect(result1 !== result2).toEqual(true);

        expect(injector.getProvider).toBeCalledWith(token);
        expect((injector as any).resolve).toBeCalledWith(token, locals, {});
        expect(locals.has(token)).toEqual(false);

        return expect(injector.get).not.toBeCalled();
      });
    });
    describe("when provider is a SINGLETON", () => {
      beforeAll(() => {
        jest.spyOn(GlobalProviders, "onInvoke").mockReturnValue(undefined);
      });
      afterAll(() => {
        jest.resetAllMocks();
      });
      it("should invoke the provider from container", async () => {
        // GIVEN
        const token = class Test {};
        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;

        const injector = new InjectorService();
        injector.set(token, provider);

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        expect(result).toBeInstanceOf(token);
        expect(GlobalProviders.onInvoke).toBeCalledWith(provider, expect.any(LocalsContainer), expect.anything());
      });
    });
    describe("when provider is a Value (useValue)", () => {
      it("should invoke the provider from container (1)", async () => {
        // GIVEN
        const token = Symbol.for("TokenValue");

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;
        provider.useValue = "TEST";

        const injector = new InjectorService();
        const container = new Container();
        container.set(token, provider);

        await injector.load(container);

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        expect(result).toEqual("TEST");
      });

      it("should invoke the provider from container (2)", async () => {
        // GIVEN
        const token = Symbol.for("TokenValue");

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;
        provider.useValue = () => "TEST";

        const injector = new InjectorService();
        const container = new Container();
        container.set(token, provider);

        await injector.load(container);

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        expect(result).toEqual("TEST");
      });

      it("should invoke the provider from container with falsy value", async () => {
        // GIVEN
        const token = Symbol.for("TokenValue");

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;
        provider.useValue = null;

        const injector = new InjectorService();
        const container = new Container();
        container.set(token, provider);

        await injector.load(container);

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        expect(result).toEqual(null);
      });
    });
    describe("when provider is a Factory (useFactory)", () => {
      it("should invoke the provider from container", async () => {
        // GIVEN
        const token = Symbol.for("TokenFactory");

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;
        provider.useFactory = () => ({factory: "factory"});

        const injector = new InjectorService();
        const container = new Container();
        container.set(token, provider);

        await injector.load(container);

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        expect(result).toEqual({factory: "factory"});
      });
    });
    describe("when provider is an AsyncFactory (useAsyncFactory)", () => {
      it("should invoke the provider from container", async () => {
        // GIVEN
        const tokenChild = Symbol.for("TokenChildFactory");
        const providerChild = new Provider<any>(tokenChild);
        providerChild.useAsyncFactory = async (dep: any) => "test async";

        const token = Symbol.for("TokenFactory");
        const provider = new Provider<any>(token);
        provider.deps = [tokenChild];
        provider.useAsyncFactory = async (dep: any) => ({factory: dep + " factory"});
        provider.hooks = {
          $onDestroy: () => {}
        };

        const tokenSync = Symbol.for("TokenSyncFactory");
        const providerSync = new Provider<any>(tokenSync);
        providerSync.deps = [token];
        providerSync.hooks = {$onDestroy: jest.fn(), $onInit: jest.fn()};
        providerSync.useFactory = (asyncInstance: any) => asyncInstance.factory;

        const injector = new InjectorService();
        const container = new Container();
        container.set(tokenChild, providerChild);
        container.set(token, provider);
        container.set(tokenSync, providerSync);

        await injector.load(container);

        // WHEN
        const result: any = injector.invoke(token);
        const result2: any = injector.invoke(tokenSync);

        // THEN
        expect(result).toEqual({factory: "test async factory"});
        expect(result2).toEqual("test async factory");

        await injector.emit("$onInit");

        expect(providerSync.hooks.$onInit).toHaveBeenCalledWith("test async factory");
      });
      it("should invoke the provider from container with nested async factory", async () => {
        // GIVEN
        const tokenChild = Symbol.for("TokenChildFactory");
        const providerChild = new Provider<any>(tokenChild);
        providerChild.useAsyncFactory = async (dep: any) => "test async";

        const token = Symbol.for("TokenFactory");
        const provider = new Provider<any>(token);
        provider.deps = [tokenChild];
        provider.useAsyncFactory = async (dep: any) => ({factory: dep + " factory"});

        const token2 = Symbol.for("TokenFactory2");
        const provider2 = new Provider<any>(token2);
        provider2.deps = [token];
        provider2.useAsyncFactory = async (dep: any) => {
          return {factory: dep.factory + " factory2"};
        };

        const injector = new InjectorService();
        const container = new Container();
        container.set(tokenChild, providerChild);
        container.set(token, provider);
        container.set(token2, provider2);

        await injector.load(container);

        // WHEN
        const result: any = injector.invoke(token2);

        // THEN
        expect(result).toEqual({factory: "test async factory factory2"});
      });
    });
    describe("when provider is an unknown provider", () => {
      it("should invoke the class from given parameter", async () => {
        // GIVEN
        const token = class {};

        const injector = new InjectorService();

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        expect(result).toBeInstanceOf(token);
      });
    });
    describe("when one of dependencies is undefined", () => {
      it("should throw InjectionError > UndefinedTokenError", async () => {
        // GIVEN
        const token2 = class Ctrl {
          constructor() {}
        };
        const token3 = class Test {
          constructor(test: any) {}
        };

        const provider2 = new Provider<any>(token2);
        provider2.scope = ProviderScope.SINGLETON;
        provider2.type = ProviderType.CONTROLLER;
        provider2.useClass = token2;

        const provider3 = new Provider<any>(token3);
        provider3.scope = ProviderScope.SINGLETON;
        provider3.deps = [undefined];

        const injector = new InjectorService();
        injector.set(token2, provider2);
        injector.set(token3, provider3);

        // WHEN
        let actualError;
        try {
          injector.invoke(token3);
        } catch (er) {
          actualError = er;
        }

        // THEN
        expect(actualError.message).toContain(
          "Injection failed on Test\nOrigin: Unable to inject dependency. Given token is undefined. Have you enabled emitDecoratorMetadata in your tsconfig.json or decorated your class with @Injectable, @Service, ... decorator ?"
        );
      });
      it("should throw InjectionError > Object", async () => {
        // GIVEN
        const token2 = class Ctrl {
          constructor() {}
        };
        const token3 = class Test {
          constructor(test: Object) {}
        };

        const provider2 = new Provider<any>(token2);
        provider2.scope = ProviderScope.SINGLETON;
        provider2.type = ProviderType.CONTROLLER;
        provider2.useClass = token2;

        const provider3 = new Provider<any>(token3);
        provider3.scope = ProviderScope.SINGLETON;
        provider3.deps = [Object];

        const injector = new InjectorService();
        injector.set(token2, provider2);
        injector.set(token3, provider3);

        // WHEN
        let actualError;
        try {
          injector.invoke(token3);
        } catch (er) {
          actualError = er;
        }

        // THEN
        expect(actualError.message).toContain("Injection failed on Test\nOrigin: Unable to inject dependency.");
      });
    });
    describe("when error occur", () => {
      it("should throw InjectionError", async () => {
        // GIVEN
        const token1 = Symbol.for("TokenValue");
        const token2 = Symbol.for("TokenFactory");
        const token3 = class Test {
          constructor(dep: any) {}
        };

        const provider1 = new Provider<any>(token1);
        provider1.scope = ProviderScope.SINGLETON;
        provider1.useValue = () => undefined; // should throw error because instance is undefined

        const provider2 = new Provider<any>(token2);
        provider2.scope = ProviderScope.SINGLETON;
        provider2.deps = [token1];
        provider2.useFactory = () => ({});

        const provider3 = new Provider<any>(token3);
        provider3.scope = ProviderScope.SINGLETON;
        provider3.deps = [token2];

        const injector = new InjectorService();
        injector.set(token1, provider1);
        injector.set(token2, provider2);
        injector.set(token3, provider3);

        // WHEN
        let actualError;
        try {
          injector.invoke(token3);
        } catch (er) {
          actualError = er;
        }

        // THEN
        expect(actualError.message).toEqual(
          "Injection failed on Test > TokenFactory > TokenValue\nOrigin: Unable to create new instance from undefined value. Check your provider declaration for TokenValue"
        );
      });
    });
    describe("when provider has Provider as dependencies", () => {
      it("should inject Provider", () => {
        // GIVEN
        const injector = new InjectorService();
        const token = Symbol.for("TokenProvider1");
        injector.add(token, {
          deps: [Provider],
          configuration: {
            test: "test"
          },
          useFactory(provider: any) {
            return {to: provider};
          }
        });

        // WHEN
        const instance: any = injector.invoke(token)!;

        // THEN
        expect(instance).toEqual({to: injector.getProvider(token)});
      });
    });
    describe("when provider has Configuration as dependencies", () => {
      it("should inject Provider", () => {
        // GIVEN
        const injector = new InjectorService();
        const token = Symbol.for("TokenProvider1");
        injector.add(token, {
          deps: [Configuration],
          useFactory(settings: any) {
            return {to: settings};
          }
        });

        // WHEN
        const instance: any = injector.invoke(token)!;

        // THEN
        expect(instance).toEqual({to: injector.settings});
      });
    });
  });
  describe("loadModule()", () => {
    it("should load DI with a rootModule", async () => {
      // GIVEN
      @Injectable()
      class RootModule {}

      const token = class Test {};
      const provider = new Provider<any>(token);

      provider.scope = ProviderScope.SINGLETON;
      provider.deps = [InjectorService];

      const injector = new InjectorService();

      await injector.loadModule(RootModule);

      expect(injector.get(RootModule)).toBeInstanceOf(RootModule);
    });
  });
  describe("loadModule()", () => {
    it("should load DI with a rootModule", async () => {
      // GIVEN
      @Injectable()
      class RootModule {}

      const injector = new InjectorService();

      await injector.loadModule(RootModule);

      expect(injector.get(RootModule)).toBeInstanceOf(RootModule);
    });
  });

  describe("bindInjectableProperties()", () => {
    class TestBind {}

    it("should bind all properties", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new TestBind();

      jest.spyOn(injector as any, "bindMethod").mockReturnValue(undefined);
      jest.spyOn(injector as any, "bindProperty").mockReturnValue(undefined);
      jest.spyOn(injector as any, "bindConstant").mockReturnValue(undefined);
      jest.spyOn(injector as any, "bindValue").mockReturnValue(undefined);
      jest.spyOn(injector as any, "bindInterceptor").mockReturnValue(undefined);

      const injectableProperties = {
        testMethod: {
          bindingType: "method"
        },
        testProp: {
          bindingType: "property"
        },
        testConst: {
          bindingType: "constant"
        },
        testValue: {
          bindingType: "value"
        },
        testInterceptor: {
          bindingType: "interceptor"
        }
      };

      Store.from(TestBind).set(INJECTABLE_PROP, injectableProperties);

      // WHEN
      injector.bindInjectableProperties(instance, new LocalsContainer(), {});

      // THEN
      expect(injector.bindMethod).toBeCalledWith(instance, injectableProperties.testMethod);
      expect(injector.bindProperty).toBeCalledWith(instance, injectableProperties.testProp, new LocalsContainer(), {});
      expect(injector.bindConstant).toBeCalledWith(instance, injectableProperties.testConst);
      expect(injector.bindValue).toBeCalledWith(instance, injectableProperties.testValue);
      expect(injector.bindInterceptor).toBeCalledWith(instance, injectableProperties.testInterceptor);
    });
  });

  describe("bindMethod()", () => {
    it("should bind the method", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new Test();

      const spyTest2 = jest.spyOn(instance, "test2");
      jest.spyOn(injector, "get");

      // WHEN
      injector.bindMethod(instance, {bindingType: "method", propertyKey: "test2"} as any);
      const result = (instance as any).test2();

      // THEN
      expect(spyTest2).toBeCalledWith(injector);
      expect(injector.get).toBeCalledWith(InjectorService);
      expect(result).toEqual(injector);
    });
  });

  describe("bindProperty()", () => {
    it("should bind the method", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new Test();

      // WHEN
      injector.bindProperty(
        instance,
        {
          bindingType: "property",
          propertyKey: "prop",
          resolver: (injector: InjectorService) => () => injector.get(InjectorService)
        } as any,
        new LocalsContainer(),
        {}
      );

      // THEN
      expect(instance.prop).toEqual(injector);
    });
  });

  describe("bindValue()", () => {
    it("should bind a property with a value (1)", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new Test();

      // WHEN
      injector.bindValue(instance, {propertyKey: "value", expression: "expression"} as any);

      instance.value = "test";
      // THEN
      expect(instance.value).toEqual("test");
    });

    it("should bind a property with a value (2)", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new Test();

      // WHEN
      injector.bindValue(instance, {propertyKey: "value", expression: "UNKNOW", defaultValue: "test2"} as any);

      // THEN
      expect(instance.value).toEqual("test2");
    });
  });

  describe("bindConstant()", () => {
    it("should bind a property with a value (1)", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new Test();

      injector.settings.set("expression", "constant");

      // WHEN
      injector.bindConstant(instance, {propertyKey: "constant", expression: "expression"} as any);

      // THEN
      expect(instance.constant).toEqual("constant");
      // should be the same
      expect(instance.constant).toEqual("constant");

      let actualError: any;
      try {
        instance.constant = "test";
      } catch (er) {
        actualError = er;
      }
      expect(!!actualError).toEqual(true);
    });

    it("should bind a property with a value (2)", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new Test();

      // WHEN
      injector.bindConstant(instance, {propertyKey: "constant", expression: "UNKNOW", defaultValue: "test"} as any);

      // THEN
      expect(instance.constant).toEqual("test");
    });
  });

  describe("bindInterceptor()", () => {
    it("should bind the method with intercept", async () => {
      // GIVEN
      class InterceptorTest {
        intercept(ctx: any) {
          return ctx.next() + " intercepted";
        }
      }

      const injector = new InjectorService();
      const container = new Container();
      container.addProvider(InterceptorTest);

      await injector.load(container);

      const instance = new Test();
      const originalMethod = instance["test"];

      jest.spyOn(injector, "get");

      // WHEN
      injector.bindInterceptor(instance, {
        bindingType: "interceptor",
        propertyKey: "test3",
        useType: InterceptorTest
      } as any);

      const result = (instance as any).test3("test");

      // THEN
      expect(expect(originalMethod)).not.toEqual(instance.test3);
      expect(injector.get).toBeCalledWith(InterceptorTest);

      expect(result).toEqual("test called  intercepted");
    });
  });

  describe("resolveConfiguration()", () => {
    it("should load configuration from each providers", () => {
      // GIVEN
      const injector = new InjectorService();

      injector.settings.set({
        scopes: {
          [ProviderType.VALUE]: ProviderScope.SINGLETON
        }
      });

      expect(injector.settings.get("scopes")).toEqual({
        [ProviderType.VALUE]: ProviderScope.SINGLETON
      });

      injector.add(Symbol.for("TOKEN1"), {
        configuration: {
          custom: "config",
          scopes: {
            provider_custom: ProviderScope.SINGLETON
          }
        }
      });

      injector.add(Symbol.for("TOKEN2"), {
        configuration: {
          scopes: {
            provider_custom_2: ProviderScope.SINGLETON
          }
        }
      });

      // WHEN
      injector.resolveConfiguration();
      // should load only once the configuration
      injector.resolveConfiguration();

      // THEN
      expect(injector.settings.get<string>("custom")).toEqual("config");
      expect(injector.settings.get<any>("scopes")).toEqual({
        provider_custom_2: "singleton",
        provider_custom: "singleton",
        value: "singleton"
      });
    });
    it("should load configuration from each providers (with resolvers)", () => {
      // GIVEN
      const injector = new InjectorService();

      injector.settings.set({
        scopes: {
          [ProviderType.VALUE]: ProviderScope.SINGLETON
        }
      });

      expect(injector.settings.get("scopes")).toEqual({
        [ProviderType.VALUE]: ProviderScope.SINGLETON
      });

      injector.add(Symbol.for("TOKEN1"), {
        configuration: {
          custom: "config",
          scopes: {
            provider_custom: ProviderScope.SINGLETON
          }
        },
        resolvers: [jest.fn() as any]
      });

      injector.add(Symbol.for("TOKEN2"), {
        configuration: {
          scopes: {
            provider_custom_2: ProviderScope.SINGLETON
          }
        }
      });

      // WHEN
      injector.resolveConfiguration();

      // THEN
      expect(injector.resolvers.length).toEqual(1);
    });
  });

  describe("resolvers", () => {
    it("should load all providers with the SINGLETON scope only", async () => {
      class ExternalService {
        constructor() {}
      }

      class MyService {
        constructor(public externalService: ExternalService) {}
      }

      const externalDi = new Map();
      externalDi.set(ExternalService, "MyClass");
      // GIVEN
      const injector = new InjectorService();
      injector.settings.resolvers.push(externalDi);

      const container = new Container();
      container.add(MyService, {
        deps: [ExternalService]
      });

      // WHEN
      await injector.load(container);

      // THEN
      expect(injector.get(MyService)).toBeInstanceOf(MyService);
      expect(injector.get<MyService>(MyService)!.externalService).toEqual("MyClass");
    });
  });

  describe("alter()", () => {
    it("should alter value", () => {
      @Injectable()
      class Test {
        $alterValue(value: any) {
          return "alteredValue";
        }
      }

      jest.spyOn(Test.prototype, "$alterValue");

      // GIVEN
      const injector = new InjectorService();
      injector.invoke<Test>(Test);

      const service = injector.get<Test>(Test)!;

      const value = injector.alter("$alterValue", "value");

      expect(service.$alterValue).toBeCalledWith("value");
      expect(value).toEqual("alteredValue");
    });
    it("should alter value (factory)", () => {
      registerProvider({
        provide: "TOKEN",
        useFactory: () => {
          return {};
        },
        hooks: {
          $alterValue(instance: any, value: any) {
            return "alteredValue";
          }
        }
      });

      // GIVEN
      const injector = new InjectorService();
      injector.invoke<any>("TOKEN");

      const value = injector.alter("$alterValue", "value");

      expect(value).toEqual("alteredValue");
    });
  });

  describe("alterAsync()", () => {
    it("should alter value", async () => {
      @Injectable()
      class Test {
        async $alterValue(value: any) {
          return "alteredValue";
        }
      }

      jest.spyOn(Test.prototype, "$alterValue");

      // GIVEN
      const injector = new InjectorService();
      injector.invoke<Test>(Test);

      const service = injector.get<Test>(Test)!;

      const value = await injector.alterAsync("$alterValue", "value");

      expect(service.$alterValue).toBeCalledWith("value");
      expect(value).toEqual("alteredValue");
    });
  });
});
