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
  ProviderType
} from "@tsed/di";
import {expect} from "chai";
import Sinon from "sinon";
import {Configuration} from "@tsed/common";
import {INJECTABLE_PROP} from "../constants";

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
      return expect(new InjectorService().has(InjectorService)).to.be.true;
    });

    it("should return false", () => {
      return expect(new InjectorService().has(Test)).to.be.false;
    });
  });
  describe("runInContext()", () => {
    it("should return true", () => {
      const injector = new InjectorService();
      injector.runInContext({} as any, () => {});
    });
  });

  describe("get()", () => {
    it("should return element", () => {
      expect(new InjectorService().get(InjectorService)).to.be.instanceOf(InjectorService);
    });

    it("should return undefined", () => {
      return expect(new InjectorService().get(Test)).to.be.undefined;
    });
  });

  describe("toArray()", () => {
    it("should return instances", () => {
      expect(new InjectorService().toArray()).to.be.instanceOf(Array);
    });
  });

  describe("forkProvider()", () => {
    class Test {}

    it("should return a provider", async () => {
      // GIVEN
      const injector = new InjectorService();

      // WHEN
      const provider = await injector.forkProvider(InjectorService);

      // THEN
      expect(provider).to.be.instanceof(Provider);
      expect(provider.provide).to.eq(InjectorService);
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

        Sinon.spy(injector as any, "resolve");
        Sinon.spy(injector as any, "invoke");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map();

        // WHEN

        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals, {rebuild: true});

        // THEN
        expect(result1).to.not.eq(result2);
        expect(injector.getProvider).to.have.been.calledWithExactly(token);
        expect(injector.get).to.have.been.calledWithExactly(token);
        expect((injector as any).resolve).to.have.been.calledWithExactly(token, locals, {rebuild: true});
        expect((injector as any).invoke).to.have.been.calledWithExactly(InjectorService, locals, {
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

        Sinon.spy(injector as any, "resolve");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map();

        // WHEN

        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals);

        // THEN
        expect(result1).to.eq(result2);
        expect(injector.getProvider).to.have.been.calledWithExactly(token);
        expect(injector.get).to.have.been.calledWithExactly(token);

        return expect((injector as any).resolve).to.not.have.been.called;
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

        Sinon.spy(injector as any, "resolve");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map(); // LocalContainer for the first request
        const locals2 = new Map(); // LocalContainer for the second request

        // WHEN REQ1
        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals);

        // WHEN REQ2
        const result3: any = injector.invoke(token, locals2);

        // THEN
        expect(result1).to.eq(result2);
        expect(result2).to.not.eq(result3);

        expect(injector.getProvider).to.have.been.calledWithExactly(token);
        expect((injector as any).resolve).to.have.been.calledWithExactly(token, locals, {});
        expect(locals.get(token)).to.eq(result1);
        expect(locals2.get(token)).to.eq(result3);

        return expect(injector.get).to.not.have.been.called;
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

        Sinon.spy(injector as any, "resolve");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map(); // LocalContainer for the first request

        // WHEN REQ1
        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals);

        // THEN
        expect(result1).to.not.eq(result2);

        expect(injector.getProvider).to.have.been.calledWithExactly(token);
        expect((injector as any).resolve).to.have.been.calledWithExactly(token, locals, {});
        expect(locals.has(token)).to.eq(false);

        return expect(injector.get).to.not.have.been.called;
      });
    });
    describe("when provider is a SINGLETON", () => {
      before(() => {
        Sinon.stub(GlobalProviders, "onInvoke");
      });
      after(() => {
        // @ts-ignore
        GlobalProviders.onInvoke.restore();
      });
      it("should invoke the provider from container", async () => {
        // GIVEN
        const token = class Test {};

        (GlobalProviders.onInvoke as any).returns(undefined);

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;

        const injector = new InjectorService();
        injector.set(token, provider);

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        expect(result).to.instanceof(token);
        expect(GlobalProviders.onInvoke).to.have.been.calledWithExactly(provider, Sinon.match.instanceOf(LocalsContainer), Sinon.match.any);
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
        expect(result).to.eq("TEST");
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
        expect(result).to.eq("TEST");
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
        expect(result).to.eq(null);
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
        expect(result).to.deep.eq({factory: "factory"});
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

        const tokenSync = Symbol.for("TokenSyncFactory");
        const providerSync = new Provider<any>(tokenSync);
        providerSync.deps = [token];
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
        expect(result).to.deep.eq({factory: "test async factory"});
        expect(result2).to.deep.eq("test async factory");
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
        expect(result).to.deep.eq({factory: "test async factory factory2"});
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
        expect(result).to.instanceof(token);
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
        expect(actualError.message).to.contains(
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
        expect(actualError.message).to.contains("Injection failed on Test\nOrigin: Unable to inject dependency.");
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
        expect(actualError.message).to.eq(
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
        expect(instance).to.deep.eq({to: injector.getProvider(token)});
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
        expect(instance).to.deep.eq({to: injector.settings});
      });
    });
  });

  describe("bindInjectableProperties()", () => {
    const sandbox = Sinon.createSandbox();

    class TestBind {}

    after(() => {
      sandbox.restore();
    });

    it("should bind all properties", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new TestBind();

      sandbox.stub(injector as any, "bindMethod");
      sandbox.stub(injector as any, "bindProperty");
      sandbox.stub(injector as any, "bindConstant");
      sandbox.stub(injector as any, "bindValue");
      sandbox.stub(injector as any, "bindInterceptor");

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
      injector.bindInjectableProperties(instance, new Map(), {});

      // THEN
      expect(injector.bindMethod).to.have.been.calledWithExactly(instance, injectableProperties.testMethod);
      expect(injector.bindProperty).to.have.been.calledWithExactly(instance, injectableProperties.testProp, new Map(), {});
      expect(injector.bindConstant).to.have.been.calledWithExactly(instance, injectableProperties.testConst);
      expect(injector.bindValue).to.have.been.calledWithExactly(instance, injectableProperties.testValue);
      expect(injector.bindInterceptor).to.have.been.calledWithExactly(instance, injectableProperties.testInterceptor);
    });
  });

  describe("bindMethod()", () => {
    const sandbox = Sinon.createSandbox();

    after(() => sandbox.restore());

    it("should bind the method", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new Test();

      const spyTest2 = sandbox.spy(instance, "test2");
      sandbox.spy(injector, "get");

      // WHEN
      injector.bindMethod(instance, {bindingType: "method", propertyKey: "test2"} as any);
      const result = (instance as any).test2();

      // THEN
      expect(spyTest2).to.have.been.calledWithExactly(injector);
      expect(injector.get).to.have.been.calledWithExactly(InjectorService);
      expect(result).to.eq(injector);
    });
  });

  describe("bindProperty()", () => {
    const sandbox = Sinon.createSandbox();

    after(() => sandbox.restore());

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
        new Map(),
        {}
      );

      // THEN
      expect(instance.prop).to.eq(injector);
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
      expect(instance.value).to.eq("test");
    });

    it("should bind a property with a value (2)", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new Test();

      // WHEN
      injector.bindValue(instance, {propertyKey: "value", expression: "UNKNOW", defaultValue: "test2"} as any);

      // THEN
      expect(instance.value).to.eq("test2");
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
      expect(instance.constant).to.eq("constant");

      let actualError: any;
      try {
        instance.constant = "test";
      } catch (er) {
        actualError = er;
      }
      expect(!!actualError).to.eq(true);
    });

    it("should bind a property with a value (2)", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new Test();

      // WHEN
      injector.bindConstant(instance, {propertyKey: "constant", expression: "UNKNOW", defaultValue: "test"} as any);

      // THEN
      expect(instance.constant).to.eq("test");
    });
  });

  describe("bindInterceptor()", () => {
    const sandbox = Sinon.createSandbox();

    after(() => sandbox.restore());

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

      sandbox.spy(injector, "get");

      // WHEN
      injector.bindInterceptor(instance, {
        bindingType: "interceptor",
        propertyKey: "test3",
        useType: InterceptorTest
      } as any);

      const result = (instance as any).test3("test");

      // THEN
      expect(expect(originalMethod)).to.not.eq(instance.test3);
      expect(injector.get).to.have.been.calledWithExactly(InterceptorTest);

      expect(result).to.eq("test called  intercepted");
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

      expect(injector.settings.get("scopes")).to.deep.eq({
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

      // THEN
      expect(injector.settings.get<string>("custom")).to.eq("config");
      expect(injector.settings.get<any>("scopes")).to.deep.eq({
        provider_custom_2: "singleton",
        provider_custom: "singleton",
        value: "singleton"
      });
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
      expect(injector.get(MyService)).to.instanceOf(MyService);
      expect(injector.get<MyService>(MyService)!.externalService).to.eq("MyClass");
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

      Sinon.spy(Test.prototype, "$alterValue");

      // GIVEN
      const injector = new InjectorService();
      injector.invoke<Test>(Test);

      const service = injector.get<Test>(Test)!;

      const value = injector.alter("$alterValue", "value");

      expect(service.$alterValue).to.have.been.calledWithExactly("value");
      expect(value).to.eq("alteredValue");
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

      Sinon.spy(Test.prototype, "$alterValue");

      // GIVEN
      const injector = new InjectorService();
      injector.invoke<Test>(Test);

      const service = injector.get<Test>(Test)!;

      const value = await injector.alterAsync("$alterValue", "value");

      expect(service.$alterValue).to.have.been.calledWithExactly("value");
      expect(value).to.eq("alteredValue");
    });
  });
});
