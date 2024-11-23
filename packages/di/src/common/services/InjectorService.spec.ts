import {$emit} from "@tsed/hooks";

import {Configuration} from "../decorators/configuration.js";
import {Inject} from "../decorators/inject.js";
import {Injectable} from "../decorators/injectable.js";
import {Container} from "../domain/Container.js";
import {LocalsContainer} from "../domain/LocalsContainer.js";
import {Provider} from "../domain/Provider.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {ProviderType} from "../domain/ProviderType.js";
import {inject} from "../fn/inject.js";
import {destroyInjector, injector} from "../fn/injector.js";
import {registerProvider} from "../registries/ProviderRegistry.js";
import {InjectorService} from "./InjectorService.js";

vi.mock("@tsed/hooks", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@tsed/hooks")>();

  return {
    ...mod,
    $emit: vi.fn()
  };
});

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
  afterEach(() => destroyInjector());

  describe("has()", () => {
    it("should return true", () => {
      expect(injector().has(InjectorService)).toBe(true);
    });

    it("should return false", () => {
      expect(injector().has(Test)).toBe(false);
    });
  });
  describe("get()", () => {
    it("should return element", () => {
      expect(injector().get(InjectorService)).toBeInstanceOf(InjectorService);
    });

    it("should return Test", () => {
      expect(injector().get(Test)).toBeInstanceOf(Test);
    });
  });
  describe("getMany()", () => {
    it("should return all instance", () => {
      injector().addProvider("token", {
        type: ProviderType.VALUE,
        useValue: 1
      });

      expect(!!injector().getMany(ProviderType.VALUE).length).toEqual(true);

      injector().delete("token");
    });
  });
  describe("toArray()", () => {
    it("should return instances", () => {
      expect(injector().toArray()).toBeInstanceOf(Array);
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

        const container = new Container();
        container.set(token, provider);

        await injector().load(container);

        vi.spyOn(injector() as any, "invokeToken");
        vi.spyOn(injector() as any, "resolve");
        vi.spyOn(injector(), "getProvider");

        const locals = new LocalsContainer();

        // WHEN

        const result1: any = inject(token, {locals});
        const result2: any = inject(token, {locals, rebuild: true});

        // THEN
        expect(result1 !== result2).toEqual(true);
        expect(injector().getProvider).toHaveBeenCalledWith(token);
        expect(injector().get("alias")).toBeInstanceOf(token);

        expect((injector() as any).invokeToken).toHaveBeenCalledWith(token, {locals, rebuild: true});
        expect(injector().resolve).toHaveBeenCalledWith(InjectorService, {
          locals,
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

        const container = new Container();
        container.set(token, provider);

        await injector().load(container);

        vi.spyOn(injector() as any, "resolve");
        vi.spyOn(injector(), "get");
        vi.spyOn(injector(), "getProvider");

        const locals = new LocalsContainer(); // LocalContainer for the first request
        const locals2 = new LocalsContainer(); // LocalContainer for the second request

        // WHEN REQ1
        const result1: any = inject(token, {locals});
        const result2: any = inject(token, {locals});

        // WHEN REQ2
        const result3: any = inject(token, {locals: locals2});

        // THEN
        expect(result1).toEqual(result2);
        expect(result2 !== result3).toEqual(true);

        expect(injector().getProvider).toHaveBeenCalledWith(token);
        expect((injector() as any).resolve).toHaveBeenCalledWith(token, {locals});
        expect(locals.get(token)).toEqual(result1);
        expect(locals2.get(token)).toEqual(result3);

        expect(injector().get).not.toHaveBeenCalled();
      });
    });
    describe("when provider is a INSTANCE", () => {
      it("should invoke a new instance", async () => {
        // GIVEN
        const token = class Test {};

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.INSTANCE;

        const container = new Container();
        container.set(token, provider);

        await injector().load(container);

        vi.spyOn(injector() as any, "resolve");
        vi.spyOn(injector(), "get");
        vi.spyOn(injector(), "getProvider");

        const locals = new LocalsContainer(); // LocalContainer for the first request

        // WHEN REQ1
        const result1: any = inject(token, {locals});
        const result2: any = inject(token, {locals});

        // THEN
        expect(result1 !== result2).toEqual(true);

        expect(injector().getProvider).toHaveBeenCalledWith(token);
        expect((injector() as any).resolve).toHaveBeenCalledWith(token, {locals});
        expect(locals.has(token)).toEqual(false);
        expect(injector().get).not.toHaveBeenCalled();

        await injector().destroy();
      });
    });
    describe("when provider is a SINGLETON", () => {
      it("should invoke the provider from container", () => {
        // GIVEN
        const token = class Test {};
        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;

        injector().set(token, provider);

        // WHEN
        const result: any = inject(token);

        // THEN
        expect(result).toBeInstanceOf(token);
        expect($emit).toHaveBeenCalledWith("$beforeInvoke", token, [expect.any(Object)]);
        expect($emit).toHaveBeenCalledWith("$beforeInvoke:provider", [expect.any(Object)]);
        expect($emit).toHaveBeenCalledWith("$afterInvoke", token, [result, expect.any(Object)]);
      });
      it("should invoke the provider from container (2)", async () => {
        // GIVEN
        const token = class Test {};

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;

        const container = new Container();
        container.set(token, provider);

        await injector().load(container);

        vi.spyOn(injector() as any, "invokeToken");
        vi.spyOn(injector(), "getProvider");

        const locals = new LocalsContainer();

        // WHEN
        const result1: any = inject(token, {locals});
        const result2: any = inject(token, {locals});

        // THEN
        expect(result1).toEqual(result2);
        expect((injector() as any).invokeToken).not.toHaveBeenCalled();
      });
    });
    describe("when provider is a Value (useValue)", () => {
      it("should invoke the provider from container (1)", async () => {
        // GIVEN
        const token = Symbol.for("TokenValue1");

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;
        provider.useValue = "TEST";

        const container = new Container();
        container.set(token, provider);

        await injector().load(container);

        // WHEN
        const result: any = inject(token);

        // THEN
        expect(result).toEqual("TEST");
      });
      it("should invoke the provider from container (2)", async () => {
        // GIVEN
        const token = Symbol.for("TokenValue2");

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;
        provider.useValue = () => "TEST";

        const container = new Container();
        container.set(token, provider);

        await injector().load(container);

        // WHEN
        const result: any = inject(token);

        // THEN
        expect(result).toEqual("TEST");
      });
      it("should invoke the provider from container with falsy value", async () => {
        // GIVEN
        const token = Symbol.for("TokenValue3");

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;
        provider.useValue = null;

        const container = new Container();
        container.set(token, provider);

        await injector().load(container);

        // WHEN
        const result: any = inject(token);

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

        const container = new Container();
        container.set(token, provider);

        await injector().load(container);

        // WHEN
        const result: any = inject(token);

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

        const container = new Container();
        container.set(tokenChild, providerChild);
        container.set(token, provider);
        container.set(tokenSync, providerSync);

        await injector().load(container);

        // WHEN
        const result: any = inject(token);
        const result2: any = inject(tokenSync);

        // THEN
        expect(result).toEqual({factory: "test async factory"});
        expect(result2).toEqual("test async factory");

        await injector().emit("$onInit");

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

        const container = new Container();
        container.set(tokenChild, providerChild);
        container.set(token, provider);
        container.set(token2, provider2);

        await injector().load(container);

        // WHEN
        const result: any = inject(token2);

        // THEN
        expect(result).toEqual({factory: "test async factory factory2"});
      });
    });
    describe("when provider is an unknown provider", () => {
      it("should invoke the class from given parameter", () => {
        // GIVEN
        const token = class {};

        // WHEN
        const result: any = inject(token);

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

        injector().set(token2, provider2);
        injector().set(token3, provider3);

        // WHEN
        let actualError;
        try {
          inject(token3);
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

        injector().set(token2, provider2);
        injector().set(token3, provider3);

        // WHEN
        let actualError;
        try {
          inject(token3);
        } catch (er) {
          actualError = er;
        }

        // THEN
        expect(actualError.message).toContain("Injection failed on Test\nOrigin: Unable to inject dependency.");
      });
      it("should try to inject string token (optional)", () => {
        // GIVEN

        // WHEN
        const result = inject("token.not.found");

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

        injector().set(token1, provider1);
        injector().set(token2, provider2);
        injector().set(token3, provider3);

        // WHEN
        let actualError;
        try {
          inject(token3);
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

        const token = Symbol.for("TokenProvider1");
        injector().add(token, {
          deps: [Provider],
          configuration: {
            test: "test"
          },
          useFactory(provider: any) {
            return {to: provider};
          }
        });

        // WHEN
        const instance: any = inject(token)!;

        // THEN
        expect(instance).toEqual({to: injector().getProvider(token)});
      });
    });
    describe("when provider has Configuration as dependencies", () => {
      it("should inject Provider", () => {
        // GIVEN

        const token = Symbol.for("TokenProvider1");
        injector().add(token, {
          deps: [Configuration],
          useFactory(settings: any) {
            return {to: settings};
          }
        });

        // WHEN
        const instance: any = inject(token)!;

        // THEN
        expect(instance).toEqual({to: injector().settings});
      });
    });
  });
  describe("resolveConfiguration()", () => {
    it("should load configuration from each providers", () => {
      // GIVEN

      injector().settings.set({
        scopes: {
          [ProviderType.VALUE]: ProviderScope.SINGLETON
        }
      });

      expect(injector().settings.get("scopes")).toEqual({
        [ProviderType.VALUE]: ProviderScope.SINGLETON
      });

      injector().add(Symbol.for("TOKEN1"), {
        configuration: {
          custom: "config",
          scopes: {
            provider_custom: ProviderScope.SINGLETON
          }
        }
      });

      injector().add(Symbol.for("TOKEN2"), {
        configuration: {
          scopes: {
            provider_custom_2: ProviderScope.SINGLETON
          }
        }
      });

      // WHEN
      injector().resolveConfiguration();
      // should load only once the configuration
      injector().resolveConfiguration();

      // THEN
      expect(injector().settings.get<string>("custom")).toEqual("config");
      expect(injector().settings.get<any>("scopes")).toEqual({
        provider_custom_2: "singleton",
        provider_custom: "singleton",
        value: "singleton"
      });
    });
    it("should load configuration from each providers (with resolvers)", () => {
      // GIVEN

      injector().add(Symbol.for("TOKEN1"), {
        configuration: {
          custom: {
            config: "1"
          }
        }
      });

      injector().add(Symbol.for("TOKEN2"), {
        configuration: {
          custom: {
            config2: "1"
          }
        }
      });

      // WHEN
      injector().resolveConfiguration();

      // THEN
      expect(injector().settings.get("custom")).toEqual({config: "1", config2: "1"});
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

      inject<Test>(Test);

      const service = injector().get<Test>(Test)!;

      const value = injector().alter("$alterValue", "value");

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

      inject<any>("TOKEN");

      const value = injector().alter("$alterValue", "value");

      expect(value).toEqual("alteredValue");
    });
  });
  describe("alterAsync()", () => {
    it("should alter value", async () => {
      @Injectable()
      class Test {
        $alterValue(value: any) {
          return Promise.resolve(value + ":alteredValue");
        }
      }

      vi.spyOn(Test.prototype, "$alterValue");

      // GIVEN

      inject<Test>(Test);

      const value = await injector().alterAsync("$alterValue", "value");

      expect(value).toEqual("value:alteredValue");
    });
  });
  describe("imports", () => {
    it("should load all provider and override by configuration a provider (use)", async () => {
      @Injectable()
      class TestService {
        get() {
          return "hello";
        }
      }

      injector().settings.set("imports", [
        {
          token: TestService,
          use: {
            get: vi.fn().mockReturnValue("world")
          }
        }
      ]);

      await injector().load();

      const result = injector().get<TestService>(TestService)!.get();
      expect(result).toEqual("world");
    });
    it("should load all provider and override by configuration a provider (useClass)", async () => {
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

      injector().settings.set("imports", [
        {
          token: TestService,
          useClass: FsTestService
        }
      ]);

      await injector().load();

      const result = injector().get<TestService>(TestService)!.get();
      expect(result).toEqual("fs");
    });
    it("should load all provider and override by configuration a provider (useFactory)", async () => {
      @Injectable()
      class TestService {
        get() {
          return "hello";
        }
      }

      injector().settings.set("imports", [
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

      await injector().load();

      const result = injector().get<TestService>(TestService)!.get();
      expect(result).toEqual("world");
    });
    it("should load all provider and override by configuration a provider (useAsyncFactory)", async () => {
      @Injectable()
      class TestService {
        get() {
          return "hello";
        }
      }

      injector().settings.set("imports", [
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

      await injector().load();

      const result = injector().get<TestService>(TestService)!.get();
      expect(result).toEqual("world");
    });
  });
});
