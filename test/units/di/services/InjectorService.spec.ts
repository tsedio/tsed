import {GlobalProviders, Provider, ProviderScope, ProviderType} from "@tsed/common";
import {Metadata, Store} from "@tsed/core";
import {Inject, InjectorService} from "../../../../src";
import {inject} from "../../../../src/testing/inject";
import {expect, Sinon} from "../../../tools";


interface MyFactory {
    method(): string;
}

const myFactory = function () {
    this.method = function () {
        return "test";
    };
};

class InvokeMethodTest {
    constructor(private t: any) {

    }

    @Inject()
    method(injectorService: InjectorService) {
        expect(this.t).not.to.be.undefined;
        return injectorService;
    }
}

class LocalService {
}

describe("InjectorService", () => {
    describe("static members", () => {
        describe("service()", () => {
            class Test {
            }

            before(() => {
                this.serviceStub = Sinon.stub(GlobalProviders.getRegistry(ProviderType.SERVICE), "merge");

                InjectorService.service(Test);
            });

            after(() => {
                this.serviceStub.restore();
            });

            it("should set metadata", () => {
                this.serviceStub.should.have.been.calledWithExactly(Test, {
                    instance: undefined,
                    provide: Test,
                    type: "service"
                });
            });
        });

        describe("factory()", () => {

            it("should create new Factory", () => {
                InjectorService.factory(myFactory, new (myFactory as any));
            });

            it("should inject the Factory", inject([myFactory], (myFactory: MyFactory) => {
                expect(myFactory.method()).to.equal("test");
            }));

        });

        describe("set()", () => {
            it("should create new entry", () => {
                InjectorService.set(myFactory, new (myFactory as any));
            });

            it("should inject the Factory", inject([myFactory], (myFactory: MyFactory) => {
                expect(myFactory.method()).to.equal("test");
            }));
        });

        describe("mapServices()", () => {
            describe("when serviceType is a string", () => {
                before(() => {
                    this.symbol = "ServiceName";

                    const locals = new Map();
                    locals.set(this.symbol, "ServiceInstanceName");
                    this.result = (InjectorService as any).mapServices({
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
                    this.symbol = class Test {
                    };

                    const locals = new Map();
                    locals.set(this.symbol, new this.symbol);

                    this.result = (InjectorService as any).mapServices({
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
                    this.symbol = class Test {
                    };

                    const locals = new Map();
                    this.getStub = Sinon.stub(GlobalProviders, "get").returns(undefined);

                    try {
                        this.result = (InjectorService as any).mapServices({
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
                    this.symbol = class Test {
                    };

                    this.locals = new Map();
                    this.getStub = Sinon.stub(GlobalProviders, "get").returns({
                        instance: undefined,
                        useClass: "useClass",
                        type: "provider"
                    });

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns({
                            buildable: true,
                            injectable: true
                        });

                    this.invokeStub = Sinon.stub(InjectorService, "invoke").returns("instance");

                    this.result = (InjectorService as any).mapServices({
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
                    this.symbol = class Test {
                    };

                    this.locals = new Map();
                    this.getStub = Sinon.stub(GlobalProviders, "get").returns({
                        instance: {instance: "instance"},
                        useClass: "useClass",
                        type: "provider"
                    });

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns({
                            buildable: false,
                            injectable: true
                        });

                    this.invokeStub = Sinon.stub(InjectorService, "invoke").returns("instance");

                    this.result = (InjectorService as any).mapServices({
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
                    this.symbol = class Test {
                    };

                    this.locals = new Map();
                    this.getStub = Sinon.stub(GlobalProviders, "get").returns({
                        instance: {instance: "instance"},
                        useClass: "useClass",
                        type: "provider",
                        scope: ProviderScope.SINGLETON
                    });

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns({
                            buildable: true,
                            injectable: true
                        });

                    this.invokeStub = Sinon.stub(InjectorService, "invoke").returns("instance");

                    this.result = (InjectorService as any).mapServices({
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
                    this.symbol = class Test {
                    };

                    this.locals = new Map();
                    this.getStub = Sinon.stub(GlobalProviders, "get").returns({
                        instance: {instance: "instance"},
                        useClass: "useClass",
                        type: "provider",
                        scope: ProviderScope.REQUEST
                    });

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns({
                            buildable: true,
                            injectable: true
                        });

                    this.invokeStub = Sinon.stub(InjectorService, "invoke").returns("instance");

                    this.result = (InjectorService as any).mapServices({
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
                    this.symbol = class Test {
                    };

                    this.locals = new Map();
                    this.getStub = Sinon.stub(GlobalProviders, "get").returns({
                        instance: {instance: "instance"},
                        useClass: "useClass",
                        type: "provider",
                        scope: ProviderScope.REQUEST
                    });

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns({
                            buildable: true,
                            injectable: true
                        });

                    this.invokeStub = Sinon.stub(InjectorService, "invoke").returns("instance");

                    try {
                        this.result = (InjectorService as any).mapServices({
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
                    expect(this.error.message).to.eq("Service of type useClass can not be injected as it is request scoped, while ServiceTest is singleton scoped");
                });
            });

            describe("when serviceType is a class from registry (INJECTION ERROR)", () => {
                before(() => {
                    this.symbol = class Test {
                    };

                    this.locals = new Map();
                    this.getStub = Sinon.stub(GlobalProviders, "get").returns({
                        instance: {instance: "instance"},
                        useClass: "useClass",
                        type: "provider",
                        scope: ProviderScope.REQUEST
                    });

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns({
                            buildable: true,
                            injectable: true
                        });

                    this.invokeStub = Sinon.stub(InjectorService, "invoke").throws(new Error("Origin Error"));

                    try {
                        this.result = (InjectorService as any).mapServices({
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
                    this.symbol = class Test {
                    };

                    this.locals = new Map();
                    this.getStub = Sinon.stub(GlobalProviders, "get").returns({
                        instance: {instance: "instance"},
                        useClass: "useClass",
                        type: "provider",
                        scope: ProviderScope.REQUEST
                    });

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns({
                            buildable: true,
                            injectable: false
                        });

                    this.invokeStub = Sinon.stub(InjectorService, "invoke");

                    try {
                        this.result = (InjectorService as any).mapServices({
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
                    this.provider = new Provider(Test);
                    this.provider.type = "controller";

                    this.container = new Map();
                    this.container.set(Test, this.provider);

                    this.config = new Map();
                    this.config.set("controllerScope", ProviderScope.REQUEST);

                    this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
                        buildable: true
                    });

                    this.invokeStub = Sinon.stub(InjectorService, "invoke").returns(new Test);

                    this.locals = InjectorService.build(this.container, this.config);
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
                    this.provider = new Provider(Test);
                    this.provider.type = "factory";
                    this.provider.instance = new Test;

                    this.container = new Map();
                    this.container.set(Test, this.provider);

                    this.config = new Map();

                    this.getRegistrySettingsStub = Sinon.stub(GlobalProviders, "getRegistrySettings").returns({
                        buildable: false
                    });

                    this.invokeStub = Sinon.stub(InjectorService, "invoke");

                    this.locals = InjectorService.build(this.container, this.config);
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
    });

    describe("instance members", () => {

        describe("get()", () => {
            it("should get a service", inject([InjectorService], (injectorService: InjectorService) => {
                expect(injectorService.get(InjectorService)).to.be.an.instanceof(InjectorService);
            }));

            it("should has the service", inject([InjectorService], (injectorService: InjectorService) => {
                expect(injectorService.has(InjectorService)).to.be.true;
            }));
        });

        describe("construct()", () => {
            class Test1 {
            }

            before(() => {
                InjectorService.set(Test1, {provide: Test1, useClass: Test1, type: "service"});
            });

            it("should construct provider", () => {
                expect(InjectorService.construct(Test1)).to.be.instanceof(Test1);
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
                before(inject([InjectorService], (injectorService: InjectorService) => {

                    this.registrySettings = {
                        onInvoke: Sinon.stub()
                    };

                    this.designParamTypes = [TestDep];

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns(this.registrySettings);

                    this.getParamTypesStub = Sinon
                        .stub(Metadata, "getParamTypes")
                        .returns(this.designParamTypes);

                    this.getStub = Sinon
                        .stub(GlobalProviders, "get")
                        .returns({provide: "provide"});

                    this.mapServicesStub = Sinon
                        .stub(InjectorService as any, "mapServices")
                        .returns(this.dep = new TestDep);

                    Store.from(Test).set("scope", "request");

                    this.locals = new Map();
                    this.result = injectorService.invoke(
                        Test,
                        this.locals,
                        undefined,
                        false
                    );
                }));

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
                    this.registrySettings.onInvoke.should.have.been.calledWithExactly(
                        {provide: "provide"},
                        this.locals,
                        this.designParamTypes
                    );
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
                    expect(this.result.args).to.deep.eq([
                        this.dep
                    ]);
                });
            });
            describe("when designParamsTypes is given", () => {
                before(inject([InjectorService], (injectorService: InjectorService) => {

                    this.registrySettings = {
                        onInvoke: Sinon.stub()
                    };

                    this.designParamTypes = [TestDep];

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns(this.registrySettings);

                    this.getParamTypesStub = Sinon
                        .stub(Metadata, "getParamTypes");

                    this.getStub = Sinon
                        .stub(GlobalProviders, "get")
                        .returns({provide: "provide"});

                    this.mapServicesStub = Sinon
                        .stub(InjectorService as any, "mapServices")
                        .returns(this.dep = new TestDep);

                    Store.from(Test).set("scope", "request");

                    this.locals = new Map();
                    this.result = injectorService.invoke(
                        Test,
                        this.locals,
                        this.designParamTypes,
                        false
                    );
                }));

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
                    this.registrySettings.onInvoke.should.have.been.calledWithExactly(
                        {provide: "provide"},
                        this.locals,
                        this.designParamTypes
                    );
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
                    expect(this.result.args).to.deep.eq([
                        this.dep
                    ]);
                });
            });
            describe("when onInvoke is empty", () => {
                before(inject([InjectorService], (injectorService: InjectorService) => {

                    this.registrySettings = {};
                    this.designParamTypes = [TestDep];

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns(this.registrySettings);

                    this.getParamTypesStub = Sinon
                        .stub(Metadata, "getParamTypes")
                        .returns(this.designParamTypes);

                    this.getStub = Sinon
                        .stub(GlobalProviders, "get")
                        .returns({provide: "provide"});

                    this.mapServicesStub = Sinon
                        .stub(InjectorService as any, "mapServices")
                        .returns(this.dep = new TestDep);

                    Store.from(Test).set("scope", "request");

                    this.locals = new Map();
                    this.result = injectorService.invoke(
                        Test,
                        this.locals,
                        undefined,
                        false
                    );
                }));

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
                    expect(this.result.args).to.deep.eq([
                        this.dep
                    ]);
                });
            });
            describe("when provider didn\'t exists", () => {
                before(inject([InjectorService], (injectorService: InjectorService) => {

                    this.registrySettings = {
                        onInvoke: Sinon.stub()
                    };
                    this.designParamTypes = [TestDep];

                    this.getRegistrySettingsStub = Sinon
                        .stub(GlobalProviders, "getRegistrySettings")
                        .returns(this.registrySettings);

                    this.getParamTypesStub = Sinon
                        .stub(Metadata, "getParamTypes")
                        .returns(this.designParamTypes);

                    this.getStub = Sinon
                        .stub(GlobalProviders, "get")
                        .returns(undefined);

                    this.mapServicesStub = Sinon
                        .stub(InjectorService as any, "mapServices")
                        .returns(this.dep = new TestDep);

                    Store.from(Test).set("scope", "request");

                    this.locals = new Map();
                    this.result = injectorService.invoke(
                        Test,
                        this.locals,
                        undefined,
                        false
                    );
                }));

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
                    expect(this.result.args).to.deep.eq([
                        this.dep
                    ]);
                });
            });
        });


        /*describe("invoke()", () => {
            it("should invoke a function constructor", inject([InjectorService], (injectorService: InjectorService) => {
                const fnInvokable = function (injectorService: InjectorService) {
                    expect(injectorService).to.be.an.instanceof(InjectorService);
                };
                injectorService.invoke(fnInvokable, undefined, [InjectorService]);
            }));

            describe("when locals is given", () => {
                let fnInvokable: any, locals: any;
                before(() => {
                    const localService = new LocalService();
                    locals = new Map();
                    locals.set(LocalService, localService);

                    fnInvokable = function (injectorService: InjectorService, localService: LocalService) {
                        expect(injectorService).to.be.an.instanceof(InjectorService);
                        expect(localService).to.be.an.instanceof(LocalService);
                    };
                });

                it("should invoke a function constructor with locals dependencies", inject([InjectorService], (injectorService: InjectorService) => {
                    injectorService.invoke(fnInvokable, locals, [InjectorService, LocalService]);
                }));
            });


            describe("when scope is given", () => {
                describe("when all classe is correctly decorated with scope", () => {
                    class T1 {
                        constructor(service: Se) {
                            expect(service).to.be.an.instanceof(Se);
                        }
                    }

                    class Se {
                    }

                    before(() => {
                        Store.from(T1).set("scope", "request");
                        this.getStub = Sinon.stub(ProviderRegistry, "get").returns({
                            useClass: Se,
                            scope: "request"
                        });

                        this.hasStub = Sinon.stub(ProviderRegistry, "has").returns(true);

                        this.result = InjectorService.invoke(T1, undefined, [Se], true);
                    });
                    after(() => {
                        this.getStub.restore();
                        this.hasStub.restore();
                    });

                    it("should invoke with scope", () => {
                        this.result.should.be.an.instanceof(T1);
                    });
                });
                describe("otherwise", () => {
                    class T1 {
                        constructor(service: Se) {
                            expect(service).to.be.an.instanceof(Se);
                        }
                    }

                    class Se {
                    }

                    before(() => {
                        Store.from(T1).set("scope", undefined);
                        this.getStub = Sinon.stub(ProviderRegistry, "get").returns({
                            useClass: Se,
                            scope: "request"
                        });

                        this.hasStub = Sinon.stub(ProviderRegistry, "has").returns(true);

                        try {
                            InjectorService.invoke(T1, undefined, [Se], true);
                        } catch (er) {
                            this.error = er;
                        }
                    });
                    after(() => {
                        this.getStub.restore();
                        this.hasStub.restore();
                    });

                    it("should invoke with scope", () => {
                        this.error.message.should.be.eq("Service of type Se can not be injected as it is request scoped, while T1 is singleton scoped");
                    });
                });
            });
        });*/

        describe("invokeMethod()", () => {

            it("should invoke a method of provide (decorators)", inject([InjectorService], (injectorService: InjectorService) => {

                const instance = new InvokeMethodTest("1");

                const result = (instance as any).method();

                expect(result).to.be.an.instanceof(InjectorService);
            }));


            it("should invoke a method of provide (decorators via Injector)", inject([InjectorService], (injectorService: InjectorService) => {

                const instance = new InvokeMethodTest("2");

                const result = injectorService.invokeMethod(instance.method, {target: instance} as any);

                expect(result).to.be.an.instanceof(InjectorService);
            }));


            it("should invoke a method of provide (injector)", inject([InjectorService], (injectorService: InjectorService) => {

                const result = injectorService.invokeMethod((injector: any) => injector, {
                    designParamTypes: [InjectorService]
                });

                expect(result).to.be.an.instanceof(InjectorService);
            }));

            it("should invoke a method of provide (injector)", inject([InjectorService], (injectorService: InjectorService) => {

                const result = injectorService.invokeMethod((injector: any) => injector, [InjectorService]);

                expect(result).to.be.an.instanceof(InjectorService);
            }));


            it("should invoke a method of provide (injector +  locals)", inject([InjectorService], (injectorService: InjectorService) => {

                const locals = new Map<Function, any>();
                locals.set(InjectorService, injectorService);

                const result = injectorService.invokeMethod((injector: any) => injector, {
                    designParamTypes: [InjectorService],
                    locals
                });

                expect(result).to.be.an.instanceof(InjectorService);
            }));

        });

    });
});