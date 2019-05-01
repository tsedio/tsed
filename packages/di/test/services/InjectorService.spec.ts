import {GlobalProviders, Inject, Provider, ProviderScope, ProviderType} from "@tsed/common";
import {Metadata, Store} from "@tsed/core";
import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {$log} from "ts-log-debug";
import {TestContext} from "../../../testing/src";
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
  before(() => {
    this.injector = new InjectorService();
  });

  describe("invoke test with Inject decorator", () => {
    before(() => {
      this.instance = this.injector.invoke(Test);
    });

    it("should bind the method", () => {
      expect(this.instance.test("test")).to.be.instanceOf(InjectorService);
    });

    it("should bind the property", () => {
      expect(this.instance.prop).to.be.instanceOf(InjectorService);
    });
  });

  describe("has()", () => {
    it("should return true", () => {
      expect(this.injector.has(InjectorService)).to.be.true;
    });

    it("should return false", () => {
      expect(this.injector.has(Test)).to.be.false;
    });
  });

  describe("get()", () => {
    before(
      inject([InjectorService], (injector: InjectorService) => {
        this.injector2 = injector;
      })
    );

    it("should return element", () => {
      expect(this.injector.get(InjectorService)).to.be.instanceOf(InjectorService);
    });

    it("should return undefined", () => {
      expect(this.injector.get(Test)).to.be.undefined;
    });

    it("should get a service", () => {
      expect(this.injector2.get(InjectorService)).to.be.an.instanceof(InjectorService);
    });
  });

  describe("forEach()", () => {
    before(() => {
      this.list = [];
      this.injector.forEach((item: any) => {
        this.list.push(item);
      });
    });
    it("should return the list", () => {
      expect(this.list.length).to.eq(this.injector.size);
    });
  });

  describe("keys()", () => {
    before(() => {
      this.list = Array.from(this.injector.keys());
    });
    it("should return the list", () => {
      expect(this.list).to.be.an("array");
    });
  });

  describe("entries()", () => {
    before(() => {
      this.list = Array.from(this.injector.entries());
    });
    it("should return the list", () => {
      expect(this.list[0]).to.be.an("array");
    });
  });

  describe("values()", () => {
    before(() => {
      this.list = Array.from(this.injector.values());
    });
    it("should return the list", () => {
      expect(this.list).to.be.an("array");
      expect(this.list[0].instance).to.be.instanceof(InjectorService);
    });
  });

  describe("Array.from()", () => {
    before(() => {
      this.list = Array.from(this.injector);
    });

    it("should return a list", () => {
      expect(this.list).to.be.an("array");
    });
  });

  describe("getProvider()", () => {
    before(
      inject([InjectorService], (injector: InjectorService) => {
        this.provider = injector.getProvider(InjectorService);
      })
    );
    after(TestContext.reset);

    it("should return a provider", () => {
      expect(this.provider).to.be.instanceOf(Provider);
    });
  });

  describe("getProviders()", () => {
    describe("with type ProviderType.MIDDLEWARE", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.providers = injector.getProviders(ProviderType.MIDDLEWARE);
          this.hasOther = this.providers.find((item: any) => item.type !== ProviderType.MIDDLEWARE);
        })
      );

      it("should return a list", () => {
        expect(this.providers.length > 0).to.be.true;
      });

      it("sohuld return a list", () => {
        expect(this.providers[0]).to.be.instanceOf(Provider);
      });

      it("should have only provider typed as CONVERTER", () => {
        expect(this.hasOther).to.be.undefined;
      });
    });

    describe("without type", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.providers = injector.getProviders();
          this.hasOther = this.providers.find((item: any) => item.type === ProviderType.MIDDLEWARE);
        })
      );

      it("sohuld return a list", () => {
        expect(this.providers.length > 0).to.be.true;
      });

      it("should return a list", () => {
        expect(this.providers[0]).to.be.instanceOf(Provider);
      });

      it("should have only provider typed as CONVERTER", () => {
        expect(!!this.hasOther).to.be.true;
      });
    });
  });

  describe("mapServices()", () => {
    describe("when serviceType is a string", () => {
      before(() => {
        this.injector = new InjectorService();
        this.symbol = "ServiceName";

        const locals = new Map();
        locals.set(this.symbol, "ServiceInstanceName");
        this.result = this.injector.mapServices({
          serviceType: this.symbol,
          locals
        });
      });

      it("should return the service instance from the locals map", () => {
        expect(this.result).to.eq("ServiceInstanceName");
      });
    });

    describe("when serviceType is a class from locals", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {
        };

        const locals = new Map();
        locals.set(this.symbol, new this.symbol());

        this.result = this.injector.mapServices({
          serviceType: this.symbol,
          locals
        });
      });

      it("should return the service instance from the locals map", () => {
        expect(this.result).to.be.instanceOf(this.symbol);
      });
    });

    describe("when serviceType is a class from registry (unknow)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {
        };

        const locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider");

        try {
          this.result = this.injector.mapServices({
            serviceType: this.symbol,
            locals,
            target: class ServiceTest {
            }
          });
        } catch (er) {
          this.error = er;
        }
      });

      after(() => {
        this.getStub.restore();
      });

      it("should call GlobalProviders.has", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should throw an error", () => {
        expect(this.error.message).to.eq("Service ServiceTest > Test not found.");
      });
    });

    describe("when serviceType is a class from registry (know, buildable, instance undefined)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {
        };

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: undefined,
          useClass: "useClass",
          type: "provider"
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          registry: GlobalProviders,
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        this.result = this.injector.mapServices({
          serviceType: this.symbol,
          locals: this.locals,
          requiredScope: true,
          target: class ServiceTest {
          }
        });
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should build instance and return the service", () => {
        this.invokeStub.should.have.been.calledWithExactly("useClass", this.locals, undefined, true);
      });
      it("should return the service instance", () => {
        expect(this.result).to.deep.eq("instance");
      });
    });

    describe("when serviceType is a class from registry (know, instance defined, not buildable)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {
        };

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          useClass: "useClass",
          type: "provider"
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          registry: GlobalProviders,
          buildable: false,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        this.result = this.injector.mapServices({
          serviceType: this.symbol,
          locals: this.locals,
          requiredScope: true,
          target: class ServiceTest {
          }
        });
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should build instance and return the service", () => {
        return this.invokeStub.should.not.have.been.called;
      });
      it("should return the service instance", () => {
        expect(this.result).to.deep.eq({instance: "instance"});
      });
    });

    describe("when serviceType is a class from registry (know, instance defined, buildable, SINGLETON)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {
        };

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          useClass: "useClass",
          type: "provider",
          scope: ProviderScope.SINGLETON
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          registry: GlobalProviders,
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        this.result = this.injector.mapServices({
          serviceType: this.symbol,
          locals: this.locals,
          requiredScope: true,
          target: class ServiceTest {
          }
        });
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should not build instance", () => {
        return this.invokeStub.should.not.have.been.called;
      });
      it("should return the service instance", () => {
        expect(this.result).to.deep.eq({instance: "instance"});
      });
    });

    describe("when serviceType is a class from registry (know, instance defined, buildable, REQUEST)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {
        };

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          useClass: "useClass",
          type: "provider",
          scope: ProviderScope.REQUEST
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          registry: GlobalProviders,
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        this.result = this.injector.mapServices({
          serviceType: this.symbol,
          locals: this.locals,
          requiredScope: true,
          parentScope: true,
          target: class ServiceTest {
          }
        });
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should build instance and return the service", () => {
        return this.invokeStub.should.have.been.calledWithExactly("useClass", this.locals, undefined, true);
      });
      it("should return the service instance", () => {
        expect(this.result).to.deep.eq("instance");
      });
    });

    describe("when serviceType is a class from registry (know, instance defined, buildable, SCOPE ERROR)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {
        };

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          useClass: "useClass",
          type: "provider",
          scope: ProviderScope.REQUEST
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          registry: GlobalProviders,
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns("instance");

        try {
          this.result = this.injector.mapServices({
            serviceType: this.symbol,
            locals: this.locals,
            requiredScope: true,
            parentScope: false,
            target: class ServiceTest {
            }
          });
        } catch (er) {
          this.error = er;
        }
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should not build instance", () => {
        return this.invokeStub.should.not.have.been.called;
      });
      it("should throw an error", () => {
        expect(this.error.message).to.eq(
          "Service of type useClass can not be injected as it is request scoped, while ServiceTest is singleton scoped"
        );
      });
    });

    describe("when serviceType is a class from registry (INJECTION ERROR)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {
        };

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          useClass: "useClass",
          type: "provider",
          scope: ProviderScope.REQUEST
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          registry: GlobalProviders,
          buildable: true,
          injectable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").throws(new Error("Origin Error"));

        try {
          this.result = this.injector.mapServices({
            serviceType: this.symbol,
            locals: this.locals,
            requiredScope: true,
            parentScope: true,
            target: class ServiceTest {
            }
          });
        } catch (er) {
          this.error = er;
        }
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should build instance and return the service", () => {
        return this.invokeStub.should.have.been.calledWithExactly("useClass", this.locals, undefined, true);
      });
      it("should throw an error", () => {
        expect(this.error.message).to.deep.eq("Service ServiceTest > Test injection failed.");
      });

      it("should throw an error with origin error", () => {
        expect(this.error.origin.message).to.deep.eq("Origin Error");
      });
    });

    describe("when serviceType is a class from registry (NOT INJECTABLE)", () => {
      before(() => {
        this.injector = new InjectorService();

        this.symbol = class Test {
        };

        this.locals = new Map();
        this.getStub = Sinon.stub(this.injector, "getProvider").returns({
          instance: {instance: "instance"},
          useClass: "useClass",
          type: "provider",
          scope: ProviderScope.REQUEST
        });

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          registry: GlobalProviders,
          buildable: true,
          injectable: false
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke");

        try {
          this.result = this.injector.mapServices({
            serviceType: this.symbol,
            locals: this.locals,
            requiredScope: true,
            parentScope: true,
            target: class ServiceTest {
            }
          });
        } catch (er) {
          this.error = er;
        }
      });

      after(() => {
        this.getStub.restore();
        this.invokeStub.restore();
        this.getRegistrySettingsStub.restore();
      });

      it("should call GlobalProviders.get", () => {
        this.getStub.should.have.been.calledWithExactly(this.symbol);
      });

      it("should call GlobalProviders.getRegistrySettings", () => {
        this.getRegistrySettingsStub.should.be.calledWithExactly("provider");
      });
      it("should not build service", () => {
        return this.invokeStub.should.not.have.been.called;
      });
      it("should throw an error", () => {
        expect(this.error.message).to.deep.eq("Service ServiceTest > Test not injectable.");
      });
    });
  });

  describe("build()", () => {
    class Test {
    }

    describe("when the provider is buildable", () => {
      before(() => {
        this.injector = new InjectorService();
        this.injector.logger = $log;

        this.injector.scopes = {
          [ProviderType.CONTROLLER]: ProviderScope.REQUEST
        };
        this.provider = new Provider(Test);
        this.provider.type = "controller";

        this.injector.set(Test, this.provider);

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          registry: GlobalProviders,
          buildable: true
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke").returns(new Test());

        this.locals = this.injector.build();
      });
      after(() => {
        this.getRegistrySettingsStub.restore();
        this.invokeStub.restore();
      });

      it("should call GlobalProviders.getRegistrySettings()", () => {
        this.getRegistrySettingsStub.should.have.been.calledWithExactly("controller");
      });

      it("should call InjectorService.invoke()", () => {
        this.invokeStub.should.have.been.calledWithExactly(Test, Sinon.match.instanceOf(Map));
      });

      it("should create an instance", () => {
        expect(this.provider.instance).to.be.instanceOf(Test);
      });

      it("should set the default scope", () => {
        expect(this.provider.scope).to.eq(ProviderScope.REQUEST);
      });

      it("should store the instance in locals map", () => {
        expect(this.locals.get(Test)).to.be.instanceOf(Test);
      });
    });
    describe("when the provider is not buildable", () => {
      before(() => {
        this.injector = new InjectorService();
        this.injector.logger = $log;
        this.provider = new Provider(Test);
        this.provider.type = "factory";
        this.provider.instance = new Test();

        this.injector.set(Test, this.provider);

        this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
          registry: GlobalProviders,
          buildable: false
        });

        this.invokeStub = Sinon.stub(this.injector, "invoke");

        this.locals = this.injector.build();
      });
      after(() => {
        this.getRegistrySettingsStub.restore();
        this.invokeStub.restore();
      });

      it("should call GlobalProviders.getRegistrySettings()", () => {
        this.getRegistrySettingsStub.should.have.been.calledWithExactly("factory");
      });

      it("should call InjectorService.invoke()", () => {
        return this.invokeStub.should.not.have.been.called;
      });

      it("should create an instance", () => {
        expect(this.provider.instance).to.be.instanceOf(Test);
      });

      it("should set the default scope", () => {
        expect(this.provider.scope).to.eq(ProviderScope.SINGLETON);
      });

      it("should store the instance in locals map", () => {
        expect(this.locals.get(Test)).to.be.instanceOf(Test);
      });
    });
  });

  describe("invoke()", () => {
    class Test {
      args: any[];

      constructor(...args: any[]) {
        this.args = args;
      }
    }

    class TestDep {
    }

    describe("when designParamsTypes is not given", () => {
      before(
        inject([InjectorService], (injectorService: InjectorService) => {
          this.provider = new Provider(Test);
          this.registrySettings = {
            onInvoke: Sinon.stub()
          };

          this.designParamTypes = [TestDep];

          this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns(this.registrySettings);

          this.getParamTypesStub = Sinon.stub(Metadata, "getParamTypes").returns(this.designParamTypes);

          this.getStub = Sinon.stub(injectorService, "getProvider").returns(this.provider);

          this.mapServicesStub = Sinon.stub(injectorService as any, "mapServices").returns((this.dep = new TestDep()));

          Store.from(Test).set("scope", "request");

          this.locals = new Map();
          this.result = injectorService.invoke(Test, this.locals, undefined, false);
        })
      );
      after(TestContext.reset);
      after(() => {
        this.mapServicesStub.restore();
        this.getStub.restore();
        this.getRegistrySettingsStub.restore();
        this.getParamTypesStub.restore();
      });

      it("should call GlobalProviders.getRegistrySettings method", () => {
        this.getRegistrySettingsStub.should.have.been.calledWithExactly(Test);
      });

      it("should call GlobalProviders.get method", () => {
        this.getStub.should.have.been.calledWithExactly(Test);
      });

      it("should call Metadata.getParamTypes method", () => {
        this.getParamTypesStub.should.have.been.calledWithExactly(Test);
      });

      it("should call settings.onInvoke method", () => {
        this.registrySettings.onInvoke.should.have.been.calledWithExactly(this.provider, this.locals, this.designParamTypes);
      });

      it("should call injectorService.mapServices method", () => {
        this.mapServicesStub.should.have.been.calledWithExactly({
          target: Test,
          serviceType: TestDep,
          locals: this.locals,
          requiredScope: false,
          parentScope: "request"
        });
      });

      it("should return a new instance of the given service", () => {
        expect(this.result).to.instanceOf(Test);
      });

      it("should injected services into the given service constructor", () => {
        expect(this.result.args).to.deep.eq([this.dep]);
      });
    });
    describe("when designParamsTypes is given", () => {
      before(
        inject([InjectorService], (injectorService: InjectorService) => {
          this.provider = new Provider(Test);

          this.registrySettings = {
            onInvoke: Sinon.stub()
          };

          this.designParamTypes = [TestDep];

          this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns(this.registrySettings);

          this.getParamTypesStub = Sinon.stub(Metadata, "getParamTypes");

          this.getStub = Sinon.stub(injectorService, "getProvider").returns(this.provider);

          this.mapServicesStub = Sinon.stub(injectorService as any, "mapServices").returns((this.dep = new TestDep()));

          Store.from(Test).set("scope", "request");

          this.locals = new Map();
          this.result = injectorService.invoke(Test, this.locals, this.designParamTypes, false);
        })
      );
      after(TestContext.reset);
      after(() => {
        this.mapServicesStub.restore();
        this.getStub.restore();
        this.getRegistrySettingsStub.restore();
        this.getParamTypesStub.restore();
      });

      it("should call GlobalProviders.getRegistrySettings method", () => {
        this.getRegistrySettingsStub.should.have.been.calledWithExactly(Test);
      });

      it("should call GlobalProviders.get method", () => {
        this.getStub.should.have.been.calledWithExactly(Test);
      });

      it("shouldn't call Metadata.getParamTypes method", () => {
        return this.getParamTypesStub.should.not.have.been.called;
      });

      it("should call settings.onInvoke method", () => {
        this.registrySettings.onInvoke.should.have.been.calledWithExactly(this.provider, this.locals, this.designParamTypes);
      });

      it("should call injectorService.mapServices method", () => {
        this.mapServicesStub.should.have.been.calledWithExactly({
          target: Test,
          serviceType: TestDep,
          locals: this.locals,
          requiredScope: false,
          parentScope: "request"
        });
      });

      it("should return a new instance of the given service", () => {
        expect(this.result).to.instanceOf(Test);
      });

      it("should injected services into the given service constructor", () => {
        expect(this.result.args).to.deep.eq([this.dep]);
      });
    });
    describe("when onInvoke is empty", () => {
      before(
        inject([InjectorService], (injectorService: InjectorService) => {
          this.provider = new Provider(Test);
          this.registrySettings = {};
          this.designParamTypes = [TestDep];

          this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns(this.registrySettings);

          this.getParamTypesStub = Sinon.stub(Metadata, "getParamTypes").returns(this.designParamTypes);

          this.getStub = Sinon.stub(injectorService, "getProvider").returns(this.provider);

          this.mapServicesStub = Sinon.stub(injectorService as any, "mapServices").returns((this.dep = new TestDep()));

          Store.from(Test).set("scope", "request");

          this.locals = new Map();
          this.result = injectorService.invoke(Test, this.locals, undefined, false);
        })
      );
      after(TestContext.reset);
      after(() => {
        this.mapServicesStub.restore();
        this.getStub.restore();
        this.getRegistrySettingsStub.restore();
        this.getParamTypesStub.restore();
      });

      it("should call GlobalProviders.getRegistrySettings method", () => {
        this.getRegistrySettingsStub.should.have.been.calledWithExactly(Test);
      });

      it("should call GlobalProviders.get method", () => {
        this.getStub.should.have.been.calledWithExactly(Test);
      });

      it("should call Metadata.getParamTypes method", () => {
        this.getParamTypesStub.should.have.been.calledWithExactly(Test);
      });

      it("should call injectorService.mapServices method", () => {
        this.mapServicesStub.should.have.been.calledWithExactly({
          target: Test,
          serviceType: TestDep,
          locals: this.locals,
          requiredScope: false,
          parentScope: "request"
        });
      });

      it("should return a new instance of the given service", () => {
        expect(this.result).to.instanceOf(Test);
      });

      it("should injected services into the given service constructor", () => {
        expect(this.result.args).to.deep.eq([this.dep]);
      });
    });
    describe("when provider didn't exists", () => {
      before(
        inject([InjectorService], (injectorService: InjectorService) => {
          this.registrySettings = {
            onInvoke: Sinon.stub()
          };
          this.designParamTypes = [TestDep];

          this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns(this.registrySettings);

          this.getParamTypesStub = Sinon.stub(Metadata, "getParamTypes").returns(this.designParamTypes);

          this.getStub = Sinon.stub(injectorService, "getProvider").returns(undefined);

          this.mapServicesStub = Sinon.stub(injectorService as any, "mapServices").returns((this.dep = new TestDep()));

          Store.from(Test).set("scope", "request");

          this.locals = new Map();
          this.result = injectorService.invoke(Test, this.locals, undefined, false);
        })
      );
      after(TestContext.reset);
      after(() => {
        this.mapServicesStub.restore();
        this.getStub.restore();
        this.getRegistrySettingsStub.restore();
        this.getParamTypesStub.restore();
      });

      it("should call GlobalProviders.getRegistrySettings method", () => {
        this.getRegistrySettingsStub.should.have.been.calledWithExactly(Test);
      });

      it("should call GlobalProviders.get method", () => {
        this.getStub.should.have.been.calledWithExactly(Test);
      });

      it("should call Metadata.getParamTypes method", () => {
        this.getParamTypesStub.should.have.been.calledWithExactly(Test);
      });

      it("shouldn't call settings.onInvoke method", () => {
        return this.registrySettings.onInvoke.should.not.have.been.called;
      });

      it("should call injectorService.mapServices method", () => {
        this.mapServicesStub.should.have.been.calledWithExactly({
          target: Test,
          serviceType: TestDep,
          locals: this.locals,
          requiredScope: false,
          parentScope: "request"
        });
      });

      it("should return a new instance of the given service", () => {
        expect(this.result).to.instanceOf(Test);
      });

      it("should injected services into the given service constructor", () => {
        expect(this.result.args).to.deep.eq([this.dep]);
      });
    });
  });

  describe("invokeMethod()", () => {
    class InjectTest {
    }

    describe("when designParamTypes is given", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.injector = injector;

          this.mapServicesStub = Sinon.stub(this.injector, "mapServices");
          this.mapServicesStub.returns(new InjectTest());

          this.getParamsTypesStub = Sinon.stub(Metadata, "getParamTypes");

          this.handler = Sinon.stub();

          this.injector.invokeMethod(this.handler, {
            target: Test,
            methodName: "test",
            locals: "locals",
            designParamTypes: [InjectTest]
          });
        })
      );
      after(TestContext.reset);
      after(() => {
        this.mapServicesStub.restore();
        this.getParamsTypesStub.restore();
      });

      it("should call injectorService.mapServices()", () => {
        this.mapServicesStub.should.have.been.calledWithExactly({
          serviceType: InjectTest,
          target: Test,
          locals: "locals",
          requiredScope: false,
          parentScope: false
        });
      });

      it("shouldn't call Metadata.getParamTypes()", () => {
        this.getParamsTypesStub.should.not.have.been.called;
      });

      it("should call the handler", () => {
        this.handler.should.have.been.calledWithExactly(new InjectTest());
      });
    });
    describe("when designParamTypes is not given", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.injector = injector;

          this.mapServicesStub = Sinon.stub(this.injector, "mapServices");
          this.mapServicesStub.returns(new InjectTest());

          this.getParamsTypesStub = Sinon.stub(Metadata, "getParamTypes").returns([InjectTest]);

          this.handler = Sinon.stub();

          this.injector.invokeMethod(this.handler, {
            target: Test,
            methodName: "test",
            locals: "locals"
          });
        })
      );
      after(TestContext.reset);
      after(() => {
        this.mapServicesStub.restore();
        this.getParamsTypesStub.restore();
      });

      it("shouldn't call Metadata.getParamTypes()", () => {
        this.getParamsTypesStub.should.have.been.calledWithExactly(Test.prototype, "test");
      });

      it("should call injectorService.mapServices()", () => {
        this.mapServicesStub.should.have.been.calledWithExactly({
          serviceType: InjectTest,
          target: Test,
          locals: "locals",
          requiredScope: false,
          parentScope: false
        });
      });

      it("should call the handler", () => {
        this.handler.should.have.been.calledWithExactly(new InjectTest());
      });
    });
    describe("when handler is already injected", () => {
      before(
        inject([InjectorService], (injector: InjectorService) => {
          this.injector = injector;

          this.mapServicesStub = Sinon.stub(this.injector, "mapServices");
          this.mapServicesStub.returns(new InjectTest());

          this.getParamsTypesStub = Sinon.stub(Metadata, "getParamTypes");

          this.handler = Sinon.stub();
          this.handler.$injected = true;

          this.injector.invokeMethod(this.handler, {
            target: Test,
            methodName: "test",
            locals: "locals"
          });
        })
      );
      after(TestContext.reset);
      after(() => {
        this.mapServicesStub.restore();
        this.getParamsTypesStub.restore();
      });

      it("shouldn't call Metadata.getParamTypes()", () => {
        this.getParamsTypesStub.should.not.have.been.called;
      });

      it("shouldn't call injectorService.mapServices()", () => {
        this.mapServicesStub.should.not.have.been.called;
      });

      it("should call the handler", () => {
        this.handler.should.have.been.calledWithExactly("locals");
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
    afterEach(() => sandbox.resetHistory());

    it("should bind the method and return result", async () => {
      // GIVEN
      class InterceptorTest {
        aroundInvoke(ctx: any) {
          return ctx.proceed() + " intercepted";
        }
      }

      const injector = new InjectorService();
      const instance = new Test();
      const originalMethod = instance["test3"];

      sandbox.stub(injector, "get").returns(new InterceptorTest());

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
    it("should bind the method and throw error", async () => {
      // GIVEN
      class InterceptorTest {
        aroundInvoke(ctx: any) {
          return ctx.proceed(new Error());
        }
      }

      const injector = new InjectorService();
      const instance = new Test();
      const originalMethod = instance["test3"];

      sandbox.stub(injector, "get").returns(new InterceptorTest());

      // WHEN
      injector.bindInterceptor(instance, {
        bindingType: "interceptor",
        propertyKey: "test3",
        useType: InterceptorTest
      } as any);

      let actualError;
      try {
        (instance as any).test3("test");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(originalMethod).should.not.eq(instance.test3);
      injector.get.should.have.been.calledWithExactly(InterceptorTest);

      actualError.should.instanceOf(Error);
    });
  });
});
