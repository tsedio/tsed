import {Store} from "@tsed/core";
import {Inject, InjectorService, Provider, ProviderScope} from "@tsed/di";
import {expect} from "chai";
import * as Sinon from "sinon";
import {GlobalProviders, LocalsContainer} from "../../src";
import {Configuration} from "../../src/decorators/configuration";
import {ProviderType} from "../../src/interfaces";

class Test {
  @Inject()
  prop: InjectorService;

  value: any;
  constant: any;

  constructor() {
  }

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
    class Test {
    }

    it("should return a provider", async () => {
      // GIVEN
      const injector = new InjectorService();

      // WHEN
      const provider = await injector.forkProvider(InjectorService);

      // THEN
      provider.should.be.instanceof(Provider);
      provider.provide.should.eq(InjectorService);
    });
  });

  describe("invoke()", () => {
    describe("when we call invoke with rebuild options (SINGLETON)", () => {
      it("should invoke the provider from container", async () => {
        // GIVEN
        const token = class Test {
        };

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;
        provider.deps = [InjectorService];

        const injector = new InjectorService();
        injector.set(token, provider);

        await injector.load();

        Sinon.spy(injector as any, "resolve");
        Sinon.spy(injector as any, "invoke");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map();

        // WHEN

        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals, {rebuild: true});

        // THEN
        result1.should.not.eq(result2);
        injector.getProvider.should.have.been.calledWithExactly(token);
        injector.get.should.have.been.calledWithExactly(token);
        (injector as any).resolve.should.have.been.calledWithExactly(token, locals, {rebuild: true});
        (injector as any).invoke.should.have.been.calledWithExactly(InjectorService, locals, {
          parent: token
        });
      });
    });
    describe("when provider is a SINGLETON", () => {
      it("should invoke the provider from container", async () => {
        // GIVEN
        const token = class Test {
        };

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;

        const injector = new InjectorService();
        injector.set(token, provider);

        await injector.load();

        Sinon.spy(injector as any, "resolve");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map();

        // WHEN

        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals);

        // THEN
        result1.should.eq(result2);
        injector.getProvider.should.have.been.calledWithExactly(token);
        injector.get.should.have.been.calledWithExactly(token);

        return (injector as any).resolve.should.not.have.been.called;
      });
    });
    describe("when provider is a REQUEST", () => {
      it("should invoke a request from local container", async () => {
        // GIVEN
        const token = class Test {
        };

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.REQUEST;

        const injector = new InjectorService();
        injector.set(token, provider);

        await injector.load();

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
        result1.should.eq(result2);
        result2.should.not.eq(result3);

        injector.getProvider.should.have.been.calledWithExactly(token);
        (injector as any).resolve.should.have.been.calledWithExactly(token, locals, {});
        locals.get(token).should.eq(result1);
        locals2.get(token).should.eq(result3);

        return injector.get.should.not.have.been.called;
      });
    });
    describe("when provider is a INSTANCE", () => {
      it("should invoke a new instance", async () => {
        // GIVEN
        const token = class Test {
        };

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.INSTANCE;

        const injector = new InjectorService();
        injector.set(token, provider);

        await injector.load();

        Sinon.spy(injector as any, "resolve");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map(); // LocalContainer for the first request

        // WHEN REQ1
        const result1: any = injector.invoke(token, locals);
        const result2: any = injector.invoke(token, locals);

        // THEN
        result1.should.not.eq(result2);

        injector.getProvider.should.have.been.calledWithExactly(token);
        (injector as any).resolve.should.have.been.calledWithExactly(token, locals, {});
        locals.has(token).should.eq(false);

        return injector.get.should.not.have.been.called;
      });
    });
    describe("when provider is a SINGLETON", () => {
      before(() => {
        Sinon.stub(GlobalProviders, "getRegistrySettings");
      });
      after(() => {
        // @ts-ignore
        GlobalProviders.getRegistrySettings.restore();
      });
      it("should invoke the provider from container", async () => {
        // GIVEN
        const token = class Test {
        };

        const registry = {
          onInvoke: Sinon.stub()
        };

        // @ts-ignore
        GlobalProviders.getRegistrySettings.returns(registry);

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;

        const injector = new InjectorService();
        injector.set(token, provider);

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        result.should.instanceof(token);
        registry.onInvoke.should.have.been.calledWithExactly(provider, Sinon.match.instanceOf(LocalsContainer), []);
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
        injector.set(token, provider);

        await injector.load();

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        result.should.eq("TEST");
      });

      it("should invoke the provider from container (2)", async () => {
        // GIVEN
        const token = Symbol.for("TokenValue");

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;
        provider.useValue = () => "TEST";

        const injector = new InjectorService();
        injector.set(token, provider);

        await injector.load();

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        result.should.eq("TEST");
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
        injector.set(token, provider);

        await injector.load();

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        result.should.deep.eq({factory: "factory"});
      });
    });
    describe("when provider is an AsyncFactory (useAsyncFactory)", () => {
      it("should invoke the provider from container", async () => {
        // GIVEN
        const tokenChild = Symbol.for("TokenChildFactory");
        const providerChild = new Provider<any>(tokenChild);
        providerChild.useAsyncFactory = async (dep: any) => ("test async");

        const token = Symbol.for("TokenFactory");
        const provider = new Provider<any>(token);
        provider.deps = [tokenChild];
        provider.useAsyncFactory = async (dep: any) => ({factory: dep + " factory"});

        const tokenSync = Symbol.for("TokenSyncFactory");
        const providerSync = new Provider<any>(tokenSync);
        providerSync.deps = [token];
        providerSync.useFactory = (asyncInstance: any) => (asyncInstance.factory);

        const injector = new InjectorService();
        injector.set(tokenChild, providerChild);
        injector.set(token, provider);
        injector.set(tokenSync, providerSync);

        await injector.load();

        // WHEN
        const result: any = injector.invoke(token);
        const result2: any = injector.invoke(tokenSync);

        // THEN
        result.should.deep.eq({factory: "test async factory"});
        result2.should.deep.eq("test async factory");
      });
    });
    describe("when provider is an unknow provider", () => {
      it("should invoke the class from given parameter", async () => {
        // GIVEN
        const token = class {
        };

        const injector = new InjectorService();

        // WHEN
        const result: any = injector.invoke(token);

        // THEN
        result.should.instanceof(token);
      });
    });
    describe("when one of dependencies isn't injectable", () => {
      it("should throw InjectionError", async () => {
        // GIVEN
        const token2 = class Ctrl {
        };
        const token3 = class Test {
        };

        const provider2 = new Provider<any>(token2);
        provider2.scope = ProviderScope.SINGLETON;
        provider2.type = ProviderType.CONTROLLER;
        provider2.useClass = token2;
        provider2.injectable = false;

        const provider3 = new Provider<any>(token3);
        provider3.scope = ProviderScope.SINGLETON;
        provider3.deps = [token2];

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
        actualError.message.should.eq("Injection failed on Test > Ctrl\nOrigin: Ctrl controller is not injectable to another provider");
      });
    });
    describe("when one of dependencies is undefined", () => {
      it("should throw InjectionError > UndefinedTokenError", async () => {
        // GIVEN
        const token2 = class Ctrl {
          constructor() {
          }
        };
        const token3 = class Test {
          constructor(test: any) {
          }
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
        actualError.message.should.contains("Injection failed on Test\nOrigin: Unable to inject dependency. Given token is undefined. Have you enabled emitDecoratorMetadata in your tsconfig.json or decorated your class with @Injectable, @Service, ... decorator ?");
      });
      it("should throw InjectionError > Object", async () => {
        // GIVEN
        const token2 = class Ctrl {
          constructor() {
          }
        };
        const token3 = class Test {
          constructor(test: Object) {
          }
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
        actualError.message.should.contains("Injection failed on Test\nOrigin: Unable to inject dependency.");
      });
    });
    describe("when error occur", () => {
      it("should throw InjectionError", async () => {
        // GIVEN
        const token1 = Symbol.for("TokenValue");
        const token2 = Symbol.for("TokenFactory");
        const token3 = class Test {
          constructor(dep: any) {
          }
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
        actualError.message.should.eq("Injection failed on Test > TokenFactory > TokenValue\nOrigin: Unable to create new instance from undefined value. Check your provider declaration for TokenValue");
      });
    });
    describe("when provider has Provider as dependencies", () => {
      it("should inject Provider", () => {
        // GIVEN
        const injector = new InjectorService();
        const token = Symbol.for("TokenProvider1");
        injector.add(token, {
          deps: [
            Provider
          ],
          configuration: {
            "test": "test"
          },
          useFactory(provider: any) {
            return {to: provider};
          }
        });

        // WHEN
        const instance: any = injector.invoke(token)!;

        // THEN
        instance.should.deep.eq({to: injector.getProvider(token)});
      });
    });
    describe("when provider has Configuration as dependencies", () => {
      it("should inject Provider", () => {
        // GIVEN
        const injector = new InjectorService();
        const token = Symbol.for("TokenProvider1");
        injector.add(token, {
          deps: [
            Configuration
          ],
          useFactory(settings: any) {
            return {to: settings};
          }
        });

        // WHEN
        const instance: any = injector.invoke(token)!;

        // THEN
        instance.should.deep.eq({to: injector.settings});
      });
    });
  });

  describe("bindInjectableProperties()", () => {
    const sandbox = Sinon.createSandbox();

    class TestBind {
    }

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

      Store.from(TestBind).set("injectableProperties", injectableProperties);

      // WHEN
      injector.bindInjectableProperties(instance);

      // THEN
      injector.bindMethod.should.have.been.calledWithExactly(instance, injectableProperties.testMethod);
      injector.bindProperty.should.have.been.calledWithExactly(instance, injectableProperties.testProp);
      injector.bindConstant.should.have.been.calledWithExactly(instance, injectableProperties.testConst);
      injector.bindValue.should.have.been.calledWithExactly(instance, injectableProperties.testValue);
      injector.bindInterceptor.should.have.been.calledWithExactly(instance, injectableProperties.testInterceptor);
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
      spyTest2.should.have.been.calledWithExactly(injector);
      injector.get.should.have.been.calledWithExactly(InjectorService);
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
      injector.bindProperty(instance, {bindingType: "property", propertyKey: "prop", useType: InjectorService} as any);

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

    it("should bind the method with aroundInvoke", async () => {
      // GIVEN
      class InterceptorTest {
        aroundInvoke(ctx: any) {
          return ctx.proceed() + " intercepted";
        }
      }

      const injector = new InjectorService();
      injector.addProvider(InterceptorTest);

      await injector.load();

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
      expect(originalMethod).should.not.eq(instance.test3);
      injector.get.should.have.been.calledWithExactly(InterceptorTest);

      expect(result).to.eq("test called  intercepted");
    });
    it("should bind the method with intercept", async () => {
      // GIVEN
      class InterceptorTest {
        intercept(ctx: any) {
          return ctx.next() + " intercepted";
        }
      }

      const injector = new InjectorService();
      injector.addProvider(InterceptorTest);

      await injector.load();

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
      expect(originalMethod).should.not.eq(instance.test3);
      injector.get.should.have.been.calledWithExactly(InterceptorTest);

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

      injector.add(Symbol.for("TOKEN1"), {
        configuration: {
          custom: "config",
          scopes: {
            "provider_custom": ProviderScope.SINGLETON
          }
        }
      });

      injector.add(Symbol.for("TOKEN2"), {
        configuration: {
          scopes: {
            "provider_custom_2": ProviderScope.SINGLETON
          }
        }
      });

      // WHEN
      injector.resolveConfiguration();

      // THEN
      injector.settings.get<string>("custom").should.eq("config");
      injector.settings.get<any>("scopes").should.deep.eq({
        provider_custom_2: "singleton",
        provider_custom: "singleton",
        value: "singleton"
      });
    });
  });
});
