import {Inject, InjectorService} from "../../../../src";
import {Store} from "../../../../src/core/class/Store";
import {ProviderRegistry} from "../../../../src/di/registries/ProviderRegistry";
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
        describe("factory()", () => {

            it("should create new Factory", () => {
                InjectorService.factory(myFactory, new (myFactory as any));
            });

            it("should inject the Factory", inject([myFactory], (myFactory: MyFactory) => {
                expect(myFactory.method()).to.equal("test");
            }));

        });

        describe("use()", () => {

            it("should create new entry", () => {
                InjectorService.set(myFactory, new (myFactory as any));
            });

            it("should inject the Factory", inject([myFactory], (myFactory: MyFactory) => {
                expect(myFactory.method()).to.equal("test");
            }));

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
        });

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