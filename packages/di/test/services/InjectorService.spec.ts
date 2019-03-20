import {Inject, Provider, ProviderScope, ProviderType} from "@tsed/common";
import {Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {InjectorService} from "../../src";

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

  describe("getProvider()", () => {
    class Test {
    }

    it("should return a provider", () => {
      // GIVEN
      const injector = new InjectorService();
      const provider = new Provider(Test);

      injector.set(Test, provider);

      // WHEN
      const result = injector.getProvider(Test);

      // THEN
      result!.should.instanceof(Provider);
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

  describe("getProviders()", () => {
    let injector: InjectorService;
    beforeEach(async () => {
      injector = new InjectorService();
      await injector.load();
    });

    it("should return middlewares only", () => {
      const providers = injector.getProviders(ProviderType.MIDDLEWARE);

      const result = providers.find((item: any) => item.type !== ProviderType.MIDDLEWARE);

      providers[0].type.should.eq(ProviderType.MIDDLEWARE);
      expect(result).to.eq(undefined);
    });

    it("should return controllers only", () => {
      const providers = injector.getProviders(ProviderType.CONTROLLER);

      const result = providers.find((item: any) => item.type !== ProviderType.CONTROLLER);

      providers[0].type.should.eq(ProviderType.CONTROLLER);
      expect(result).to.eq(undefined);
    });

    it("should return all providers", () => {
      const providers = injector.getProviders();
      const controllers = providers.filter((item: any) => item.type === ProviderType.CONTROLLER);
      const middlewares = providers.filter((item: any) => item.type === ProviderType.MIDDLEWARE);

      expect(providers.length > 0).to.eq(true);
      expect(controllers.length > 0).to.eq(true);
      expect(middlewares.length > 0).to.eq(true);
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

        Sinon.spy(injector as any, "_invoke");
        Sinon.spy(injector as any, "invoke");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map();

        // WHEN

        const result1 = await injector.invoke(token, locals);
        const result2 = await injector.invoke(token, locals, {rebuild: true});

        // THEN
        result1.should.not.eq(result2);
        injector.getProvider.should.have.been.calledWithExactly(token);
        injector.get.should.have.been.calledWithExactly(token);
        (injector as any)._invoke.should.have.been.calledWithExactly(token, locals, {rebuild: true});
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

        Sinon.spy(injector as any, "_invoke");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map();

        // WHEN

        const result1 = await injector.invoke(token, locals);
        const result2 = await injector.invoke(token, locals);

        // THEN
        result1.should.eq(result2);
        injector.getProvider.should.have.been.calledWithExactly(token);
        injector.get.should.have.been.calledWithExactly(token);

        return (injector as any)._invoke.should.not.have.been.called;
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

        Sinon.spy(injector as any, "_invoke");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map(); // LocalContainer for the first request
        const locals2 = new Map(); // LocalContainer for the second request

        // WHEN REQ1
        const result1 = await injector.invoke(token, locals);
        const result2 = await injector.invoke(token, locals);

        // WHEN REQ2
        const result3 = await injector.invoke(token, locals2);

        // THEN
        result1.should.eq(result2);
        result2.should.not.eq(result3);

        injector.getProvider.should.have.been.calledWithExactly(token);
        (injector as any)._invoke.should.have.been.calledWithExactly(token, locals, {});
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

        Sinon.spy(injector as any, "_invoke");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map(); // LocalContainer for the first request

        // WHEN REQ1
        const result1 = await injector.invoke(token, locals);
        const result2 = await injector.invoke(token, locals);

        // THEN
        result1.should.not.eq(result2);

        injector.getProvider.should.have.been.calledWithExactly(token);
        (injector as any)._invoke.should.have.been.calledWithExactly(token, locals, {});
        locals.has(token).should.eq(false);

        return injector.get.should.not.have.been.called;
      });
    });
    describe("when provider is return an undefined instance", () => {
      it("should throw an error", async () => {
        // GIVEN
        const token = class Test {
        };

        const provider = new Provider<any>(token);
        provider.scope = ProviderScope.SINGLETON;

        provider.useFactory = () => undefined;

        const injector = new InjectorService();

        await injector.load();

        injector.set(token, provider);

        Sinon.spy(injector as any, "_invoke");
        Sinon.spy(injector, "get");
        Sinon.spy(injector, "getProvider");

        const locals = new Map();

        // WHEN
        let actualError;
        let result;
        try {
          result = await injector.invoke(token, locals);
        } catch (er) {
          actualError = er;
        }

        // THEN
        expect(result).to.eq(undefined);
        actualError.message.should.eq("Unable to create new instance from provided token (Test)");
        injector.getProvider.should.have.been.calledWithExactly(token);
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
    it("should bind a property with a value", () => {
      // GIVEN
      const injector = new InjectorService();
      const instance = new Test();

      // WHEN
      injector.bindValue(instance, {propertyKey: "value", expression: "expression"} as any);

      instance.value = "test";
      // THEN
      expect(instance.value).to.eq("test");
    });
  });

  describe("bindConstant()", () => {
    it("should bind a property with a value", () => {
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
  });

  describe("bindInterceptor()", () => {
    const sandbox = Sinon.createSandbox();

    after(() => sandbox.restore());

    it("should bind the method", async () => {
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
  });
});
