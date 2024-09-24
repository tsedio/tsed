import {Store} from "@tsed/core";

import {DI_USE_OPTIONS} from "../constants/constants.js";
import {Configuration} from "../decorators/configuration.js";
import {Inject} from "../decorators/inject.js";
import {Injectable} from "../decorators/injectable.js";
import {Container} from "../domain/Container.js";
import {LocalsContainer} from "../domain/LocalsContainer.js";
import {Provider} from "../domain/Provider.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {ProviderType} from "../domain/ProviderType.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";
import {registerProvider} from "../registries/ProviderRegistry.js";
import {InjectorService} from "./InjectorService.js";

class Test {
  @Inject()
  prop: InjectorService;

  value: any;
  constant: any;

  constructor() {}

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
  describe("getMany()", () => {
    it("should return all instance", () => {
      const injector = new InjectorService();
      injector.addProvider("token", {
        type: ProviderType.VALUE,
        useValue: 1
      });

      expect(!!injector.getMany(ProviderType.VALUE).length).toEqual(true);
      expect(!!injector.getMany(ProviderType.FACTORY).length).toEqual(false);
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
        provider.alias = "alias";

        const injector = new InjectorService();
        const container = new Container();
        container.set(token, provider);

        await injector.load(container);

        vi.spyOn(injector as any, "resolve");
        vi.spyOn(injector as any, "invoke");
        vi.spyOn(injector, "getProvider");

        const locals = new LocalsContainer();

        // WHEN

        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals, {rebuild: true});

        // THEN
        expect(result1 !== result2).toEqual(true);
        expect(injector.getProvider).toHaveBeenCalledWith(token);
        expect(injector.get("alias")).toBeInstanceOf(token);

        expect((injector as any).resolve).toHaveBeenCalledWith(token, locals, {rebuild: true});
        expect((injector as any).invoke).toHaveBeenCalledWith(InjectorService, locals, {
          parent: token
        });
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

        vi.spyOn(injector as any, "resolve");
        vi.spyOn(injector, "get");
        vi.spyOn(injector, "getProvider");

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

        expect(injector.getProvider).toHaveBeenCalledWith(token);
        expect((injector as any).resolve).toHaveBeenCalledWith(token, locals, {});
        expect(locals.get(token)).toEqual(result1);
        expect(locals2.get(token)).toEqual(result3);

        return expect(injector.get).not.toHaveBeenCalled();
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

        vi.spyOn(injector as any, "resolve");
        vi.spyOn(injector, "get");
        vi.spyOn(injector, "getProvider");

        const locals = new LocalsContainer(); // LocalContainer for the first request

        // WHEN REQ1
        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals);

        // THEN
        expect(result1 !== result2).toEqual(true);

        expect(injector.getProvider).toHaveBeenCalledWith(token);
        expect((injector as any).resolve).toHaveBeenCalledWith(token, locals, {});
        expect(locals.has(token)).toEqual(false);

        return expect(injector.get).not.toHaveBeenCalled();
      });
    });
    describe("when provider is a SINGLETON", () => {
      beforeAll(() => {
        vi.spyOn(GlobalProviders, "onInvoke").mockReturnValue(undefined);
      });
      afterAll(() => {
        vi.resetAllMocks();
      });
      it("should invoke the provider from container", () => {
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
        expect(GlobalProviders.onInvoke).toHaveBeenCalledWith(provider, expect.any(LocalsContainer), expect.anything());
      });
      it("should invoke the provider from container (2)", async () => {
        // GIVEN
        const token = class Test {};

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;

        const injector = new InjectorService();
        const container = new Container();
        container.set(token, provider);

        await injector.load(container);

        vi.spyOn(injector as any, "resolve");
        vi.spyOn(injector, "getProvider");

        const locals = new LocalsContainer();

        // WHEN

        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals);

        // THEN
        expect(result1).toEqual(result2);

        return expect((injector as any).resolve).not.toHaveBeenCalled();
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
        providerChild.useAsyncFactory = (dep: any) => Promise.resolve("test async");

        const token = Symbol.for("TokenFactory");
        const provider = new Provider<any>(token);
        provider.deps = [tokenChild];
        provider.useAsyncFactory = (dep: any) => Promise.resolve({factory: dep + " factory"});
        provider.hooks = {
          $onDestroy: () => {}
        };

        const tokenSync = Symbol.for("TokenSyncFactory");
        const providerSync = new Provider<any>(tokenSync);
        providerSync.deps = [token];
        providerSync.hooks = {$onDestroy: vi.fn(), $onInit: vi.fn()};
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
        providerChild.useAsyncFactory = (dep: any) => Promise.resolve("test async");

        const token = Symbol.for("TokenFactory");
        const provider = new Provider<any>(token);
        provider.deps = [tokenChild];
        provider.useAsyncFactory = (dep: any) => Promise.resolve({factory: dep + " factory"});

        const token2 = Symbol.for("TokenFactory2");
        const provider2 = new Provider<any>(token2);
        provider2.deps = [token];
        provider2.useAsyncFactory = (dep: any) => {
          return Promise.resolve({factory: dep.factory + " factory2"});
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
      it("should invoke the class from given parameter", () => {
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
      it("should throw InjectionError > UndefinedTokenError", () => {
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
        provider3.deps = [undefined] as never;

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
          "Injection failed on Test\nOrigin: Unable to inject dependency. Given token is undefined. Could mean a circular dependency problem. Try to use @Inject(() => Token) to solve it."
        );
      });
      it("should throw InjectionError > Object", () => {
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
      it("should try to inject string token (optional)", () => {
        // GIVEN

        const injector = new InjectorService();

        // WHEN
        const result = injector.invoke("token.not.found");

        // THEN
        expect(result).toEqual(undefined);
      });
    });
    describe("when error occur", () => {
      it("should throw InjectionError", () => {
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
    it("should load DI with a rootModule (SINGLETON + deps)", async () => {
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

    it("should load DI with a rootModule", async () => {
      // GIVEN
      @Injectable()
      class RootModule {}

      const injector = new InjectorService();

      await injector.loadModule(RootModule);

      expect(injector.get(RootModule)).toBeInstanceOf(RootModule);
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
        resolvers: [vi.fn() as any]
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

      vi.spyOn(Test.prototype, "$alterValue");

      // GIVEN
      const injector = new InjectorService();
      injector.invoke<Test>(Test);

      const service = injector.get<Test>(Test)!;

      const value = injector.alter("$alterValue", "value");

      expect(service.$alterValue).toHaveBeenCalledWith("value");
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
        $alterValue(value: any) {
          return Promise.resolve("alteredValue");
        }
      }

      vi.spyOn(Test.prototype, "$alterValue");

      // GIVEN
      const injector = new InjectorService();
      injector.invoke<Test>(Test);

      const service = injector.get<Test>(Test)!;

      const value = await injector.alterAsync("$alterValue", "value");

      expect(service.$alterValue).toHaveBeenCalledWith("value");
      expect(value).toEqual("alteredValue");
    });
  });

  describe("imports", () => {
    it("should load all provider and override by configuration a provider (use)", async () => {
      const injector = new InjectorService();
      @Injectable()
      class TestService {
        get() {
          return "hello";
        }
      }

      injector.settings.set("imports", [
        {
          token: TestService,
          use: {
            get: vi.fn().mockReturnValue("world")
          }
        }
      ]);

      await injector.load();

      const result = injector.get<TestService>(TestService)!.get();
      expect(result).toEqual("world");
    });
    it("should load all provider and override by configuration a provider (useClass)", async () => {
      const injector = new InjectorService();
      @Injectable()
      class TestService {
        get() {
          return "hello";
        }
      }

      @Injectable()
      class FsTestService {
        get() {
          return "fs";
        }
      }

      injector.settings.set("imports", [
        {
          token: TestService,
          useClass: FsTestService
        }
      ]);

      await injector.load();

      const result = injector.get<TestService>(TestService)!.get();
      expect(result).toEqual("fs");
    });
    it("should load all provider and override by configuration a provider (useFactory)", async () => {
      const injector = new InjectorService();
      @Injectable()
      class TestService {
        get() {
          return "hello";
        }
      }

      injector.settings.set("imports", [
        {
          token: TestService,
          useFactory: () => {
            return {
              get() {
                return "world";
              }
            };
          }
        }
      ]);

      await injector.load();

      const result = injector.get<TestService>(TestService)!.get();
      expect(result).toEqual("world");
    });
    it("should load all provider and override by configuration a provider (useAsyncFactory)", async () => {
      const injector = new InjectorService();
      @Injectable()
      class TestService {
        get() {
          return "hello";
        }
      }

      injector.settings.set("imports", [
        {
          token: TestService,
          useAsyncFactory: () => {
            return Promise.resolve({
              get() {
                return "world";
              }
            });
          }
        }
      ]);

      await injector.load();

      const result = injector.get<TestService>(TestService)!.get();
      expect(result).toEqual("world");
    });
  });
});
