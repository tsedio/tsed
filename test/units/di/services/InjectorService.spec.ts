import * as Chai from "chai";
import {Inject, InjectorService} from "../../../../src";
import {inject} from "../../../../src/testing/inject";

const expect: Chai.ExpectStatic = Chai.expect;

interface MyFactory {
    method(): string;
}

const myFactory = function () {
    this.method = function () {
        return "test";
    };
};

class InvokeMethodTest {
    constructor(private t) {

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
                InjectorService.factory(myFactory, new myFactory);
            });

            it("should inject the Factory", inject([myFactory], (myFactory: MyFactory) => {
                expect(myFactory.method()).to.equal("test");
            }));

        });

        describe("use()", () => {

            it("should create new entry", () => {
                InjectorService.set(myFactory, new myFactory);
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

            it("should invoke a function constructor with locals dependencies", inject([InjectorService], (injectorService: InjectorService) => {

                const localService = new LocalService();
                const locals = new Map();
                locals.set(LocalService, localService);

                const fnInvokable = function (injectorService: InjectorService, localService: LocalService) {
                    expect(injectorService).to.be.an.instanceof(InjectorService);
                    expect(localService).to.be.an.instanceof(LocalService);
                };

                injectorService.invoke(fnInvokable, locals, [InjectorService, LocalService]);
            }));
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

                const result = injectorService.invokeMethod((injector) => injector, {
                    designParamTypes: [InjectorService]
                });

                expect(result).to.be.an.instanceof(InjectorService);
            }));

            it("should invoke a method of provide (injector)", inject([InjectorService], (injectorService: InjectorService) => {

                const result = injectorService.invokeMethod((injector) => injector, [InjectorService]);

                expect(result).to.be.an.instanceof(InjectorService);
            }));


            it("should invoke a method of provide (injector +  locals)", inject([InjectorService], (injectorService: InjectorService) => {

                const locals = new Map<Function, any>();
                locals.set(InjectorService, injectorService);

                const result = injectorService.invokeMethod((injector) => injector, {
                    designParamTypes: [InjectorService],
                    locals
                });

                expect(result).to.be.an.instanceof(InjectorService);
            }));

        });

    });
});