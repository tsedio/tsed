import "../../../../src/ajv";
import {ConverterService} from "../../../../src/converters/services/ConverterService";
import {InjectorService} from "../../../../src/di/services/InjectorService";
import {ENDPOINT_INFO, EXPRESS_ERR, RESPONSE_DATA} from "../../../../src/filters/constants";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {EndpointMetadata} from "../../../../src/mvc/class/EndpointMetadata";
import {HandlerBuilder} from "../../../../src/mvc/class/HandlerBuilder";
import {RequiredParamError} from "../../../../src/mvc/errors/RequiredParamError";
import {ControllerRegistry} from "../../../../src/mvc/registries/ControllerRegistry";
import {MiddlewareRegistry} from "../../../../src/mvc/registries/MiddlewareRegistry";
import {RouterController} from "../../../../src/mvc/services/RouterController";
import {ValidationService} from "../../../../src/mvc/services/ValidationService";
import {inject} from "../../../../src/testing";
import {FakeRequest} from "../../../helper/FakeRequest";
import {FakeResponse} from "../../../helper/FakeResponse";
import {$logStub, assert, expect, restore, Sinon} from "../../../tools";

class Test {

    get() {

    }

    use() {

    }
}

describe("HandlerBuilder", () => {
    describe("from()", () => {
        describe("from Endpoint", () => {
            before(() => {
                this.builder = HandlerBuilder.from(new EndpointMetadata(Test, "get"));
            });

            it("should create builder", () => {
                expect(this.builder.handlerMetadata.target).to.eq(Test);
                expect(this.builder.handlerMetadata.methodClassName).to.eq("get");
            });

        });
        describe("from class", () => {
            before(() => {
                this.builder = HandlerBuilder.from(Test);
            });

            it("should create builder", () => {
                expect(this.builder.handlerMetadata.target).to.eq(Test);
            });
        });
        describe("from function", () => {
            before(() => {
                this.builder = HandlerBuilder.from(() => {
                });
            });

            it("should create builder", () => {
                expect(this.builder.handlerMetadata.target).to.be.a("function");
            });
        });
    });
    describe("build()", () => {
        describe("middleware", () => {
            before(() => {
                this.invokeStub = Sinon.stub(HandlerBuilder.prototype, "invoke");
            });

            after(() => {
                this.invokeStub.restore();
            });

            describe("when is a middleware", () => {
                before(() => {
                    this.response = new FakeResponse();
                    this.request = new FakeRequest();
                    this.nextSpy = Sinon.spy();
                    this.stub = Sinon.stub();

                    this.metadata = {
                        nextFunction: false,
                        errorParam: false,
                        target: (req: any, res: any) => {
                            this.stub(req, res);
                        }
                    };

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware({request: "request"}, {response: "response"}, "function");
                });

                it("should call invoke method with the correct parameters", () => {
                    this.invokeStub.should.have.been.calledWithExactly({
                        request: {request: "request"},
                        response: {response: "response"},
                        next: "function"
                    });
                });
            });

            describe("when is an error middleware", () => {
                before(() => {
                    this.response = new FakeResponse();
                    this.request = new FakeRequest();
                    this.nextSpy = Sinon.spy();
                    this.stub = Sinon.stub();

                    this.metadata = {
                        nextFunction: false,
                        errorParam: true,
                        target: (req: any, res: any) => {
                            this.stub(req, res);
                        }
                    };

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware("error", {request: "request"}, {response: "response"}, "function");
                });

                it("should call invoke method with the correct parameters", () => {
                    this.invokeStub.should.have.been.calledWithExactly({
                        err: "error",
                        request: {request: "request"},
                        response: {response: "response"},
                        next: "function"
                    });
                });
            });

            /*describe("from function with next func", () => {

                before(inject([], () => {
                    this.response = new FakeResponse();
                    this.request = new FakeRequest();
                    this.nextSpy = Sinon.spy();

                    this.stub = Sinon.stub();

                    this.metadata = {
                        type: "function",
                        nextFunction: true,
                        errorParam: false,
                        target: (req: any, res: any, next: any) => {
                            this.stub(req, res, next);
                            next();
                        },
                        isValidRequiredValue: () => true
                    };

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(this.request, this.response, this.nextSpy);
                }));

                it("should create middleware", () => {
                    expect(this.middleware).to.be.a("function").and.length(3);
                });

                it("should call middleware with some parameters", () => {
                    this.stub.should.calledWithExactly(this.request, this.response, Sinon.match.func);
                });

                it("should call next spy", () =>
                    this.nextSpy.should.have.been.calledOnce
                );
            });

            describe("from function without next func", () => {

                before(() => {
                    this.response = new FakeResponse();
                    this.request = new FakeRequest();
                    this.nextSpy = Sinon.spy();
                    this.stub = Sinon.stub();

                    this.metadata = {
                        nextFunction: false,
                        errorParam: false,
                        target: (req: any, res: any) => {
                            this.stub(req, res);
                        }
                    };

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(this.request, this.response, this.nextSpy);
                });

                it("should create middleware", () => {
                    expect(this.middleware).to.be.a("function").and.length(3);
                });

                it("should call middleware with some parameters", () => {
                    this.stub.should.have.been.calledWithExactly(this.request, this.response);
                });

                it("should call next spy", () =>
                    this.nextSpy.should.have.been.calledOnce
                );
            });

            describe("from function with err", () => {

                before(() => {
                    this.response = new FakeResponse();
                    this.request = new FakeRequest();
                    this.nextSpy = Sinon.spy();
                    this.stub = Sinon.stub();

                    this.metadata = {
                        nextFunction: true,
                        errorParam: true,
                        target: (err: any, req: any, res: any, next: any) => {
                            this.stub(err, req, res, next);
                            next(err);
                        }
                    };

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(new Error, this.request, this.response, this.nextSpy);
                });

                it("should create middleware", () => {
                    expect(this.middleware).to.be.a("function").and.length(4);
                });

                it("should call middleware with some parameters", () => {
                    this.stub.should.have.been.calledWithExactly(
                        Sinon.match.instanceOf(Error),
                        this.request,
                        this.response,
                        Sinon.match.func
                    );
                });

                it("should call next spy", () =>
                    this.nextSpy.should.have.been.calledOnce
                );
            });

            describe("from Endpoint", () => {

                before(() => {
                    this.response = new FakeResponse();
                    this.request = new FakeRequest();
                    this.nextSpy = Sinon.spy();
                    this.getStub = Sinon.stub(Test.prototype, "get").returns({response: "body"});
                    this.deserializeStub.returns({request: "body"});
                    this.metadata = {
                        type: "controller",
                        injectable: true,
                        nextFunction: false,
                        errorParam: false,
                        target: Test,
                        methodClassName: "get",
                        services: [{service: PathParamsFilter, useConverter: true, isValidRequiredValue: () => true}],
                        instance: new Test
                    };

                    this.invokeMethodStub = Sinon.stub(FilterService.prototype, "invokeMethod").returns({request: "body"});

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(this.request, this.response, this.nextSpy)
                        .catch((er: any) => console.error(er));
                });

                after(() => {
                    this.deserializeStub.reset();
                    restore(Test.prototype.get);
                    restore(FilterService.prototype.invokeMethod);
                });

                it("should create middleware", () => {
                    expect(this.middleware).to.be.a("function").and.length(3);
                });

                it("should invoke middleware with some parameters", () => {
                    this.invokeMethodStub.should.have.been.calledWithExactly(
                        Sinon.match.func,
                        undefined,
                        Sinon.match.instanceOf(FakeRequest),
                        Sinon.match.instanceOf(FakeResponse)
                    );
                });

                it("should call middleware with some parameters", () => {
                    this.getStub.should.have.been.calledWithExactly({request: "body"});
                });

                it("should call next spy", () =>
                    this.nextSpy.should.have.been.calledOnce
                );

                it("shouldn't call next spy with args", () =>
                    this.nextSpy.should.not.have.been.calledWith(Sinon.match.instanceOf(Error))
                );

                it("should store data", () => {
                    expect(this.request.getStoredData()).to.deep.eq({response: "body"});
                });
            });

            describe("from Endpoint with required params", () => {

                before(() => {
                    this.response = new FakeResponse();
                    this.request = new FakeRequest();
                    this.nextSpy = Sinon.spy();
                    this.getStub = Sinon.stub(Test.prototype, "get").returns(undefined);

                    this.metadata = {
                        type: "controller",
                        injectable: true,
                        nextFunction: false,
                        errorParam: false,
                        target: Test,
                        methodClassName: "get",
                        services: [{
                            service: PathParamsFilter,
                            name: "PathParamsFilter",
                            required: true,
                            expression: "required",
                            isValidRequiredValue: () => false
                        }],
                        instance: new Test
                    };

                    this.invokeMethodStub = Sinon.stub(FilterService.prototype, "invokeMethod").returns(undefined);

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(this.request, this.response, this.nextSpy)
                        .catch((er: any) => console.error(er));
                });

                after(() => {
                    restore(Test.prototype.get);
                    restore(FilterService.prototype.invokeMethod);
                });

                it("should create middleware", () => {
                    expect(this.middleware).to.be.a("function").and.length(3);
                });

                it("should invoke middleware with some parameters", () => {
                    this.invokeMethodStub.should.have.been.calledWithExactly(
                        Sinon.match.func,
                        "required",
                        Sinon.match.instanceOf(FakeRequest),
                        Sinon.match.instanceOf(FakeResponse)
                    );
                });

                it("should call middleware with some parameters", () => {
                    this.getStub.should.not.have.been.called;
                });

                it("should call next spy", () =>
                    this.nextSpy.should.have.been.calledOnce
                );

                it("should call next spy with Error", () =>
                    this.nextSpy.should.have.been.calledWith(Sinon.match.instanceOf(RequiredParamError))
                );
            });

            describe("from Middleware", () => {

                before(() => {
                    this.response = new FakeResponse();
                    this.request = new FakeRequest();
                    this.nextSpy = Sinon.spy();
                    this.useStub = Sinon.stub(Test.prototype, "use").returns({response: "body"});
                    stub(MiddlewareRegistry.get).returns({instance: new Test});

                    this.metadata = {
                        type: "middleware",
                        injectable: true,
                        nextFunction: false,
                        errorParam: false,
                        target: Test,
                        methodClassName: "use",
                        services: [{service: PathParamsFilter, isValidRequiredValue: () => true}]
                    };

                    this.invokeMethodStub = Sinon.stub(FilterService.prototype, "invokeMethod").returns({request: "body"});

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(this.request, this.response, this.nextSpy)
                        .catch((er: any) => console.error(er));
                });

                after(() => {
                    (Test.prototype.use as any).restore();
                    (FilterService.prototype.invokeMethod as any).restore();
                });

                it("should create middleware", () => {
                    expect(this.middleware).to.be.a("function").and.length(3);
                });

                it("should invoke middleware with some parameters", () => {
                    this.invokeMethodStub.should.have.been.calledWithExactly(
                        Sinon.match.func,
                        undefined,
                        Sinon.match.instanceOf(FakeRequest),
                        Sinon.match.instanceOf(FakeResponse)
                    );
                });

                it("should call middleware with some parameters", () => {
                    this.useStub.should.have.been.calledWithExactly({request: "body"});
                });

                it("should call next spy", () =>
                    this.nextSpy.should.have.been.calledOnce
                );

                it("shouldn't call next spy with args", () =>
                    this.nextSpy.should.not.have.been.calledWith(Sinon.match.instanceOf(Error))
                );

                it("should store data", () => {
                    expect(this.request.getStoredData()).to.deep.eq({response: "body"});
                });
            });

            describe("from Middleware Error", () => {

                before(() => {
                    this.response = new FakeResponse();
                    this.request = new FakeRequest();
                    this.nextSpy = Sinon.spy();
                    this.useStub = Sinon.stub(Test.prototype, "use").returns({response: "body"});
                    stub(MiddlewareRegistry.get).returns({instance: new Test});

                    this.metadata = {
                        type: "middleware",
                        injectable: true,
                        nextFunction: false,
                        errorParam: true,
                        target: Test,
                        methodClassName: "use",
                        services: [
                            {service: EXPRESS_ERR, useConverter: false, name: "err", isValidRequiredValue: () => true},
                            {service: PathParamsFilter, isValidRequiredValue: () => true},
                            {
                                service: ENDPOINT_INFO,
                                useConverter: false,
                                name: "endpointInfo",
                                isValidRequiredValue: () => true
                            },
                            {
                                service: RESPONSE_DATA,
                                useConverter: false,
                                name: "responseData",
                                isValidRequiredValue: () => true
                            }
                        ]
                    };

                    this.invokeMethodStub = Sinon.stub(FilterService.prototype, "invokeMethod").returns({request: "body"});

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(new Error(), this.request, this.response, this.nextSpy)
                        .catch((er: any) => console.error(er));
                });

                after(() => {
                    (Test.prototype.use as any).restore();
                    (FilterService.prototype.invokeMethod as any).restore();
                });

                it("should create middleware", () => {
                    expect(this.middleware).to.be.a("function").and.length(4);
                });

                it("should invoke middleware with some parameters", () => {
                    this.invokeMethodStub.should.have.been.calledWithExactly(
                        Sinon.match.func,
                        undefined,
                        Sinon.match.instanceOf(FakeRequest),
                        Sinon.match.instanceOf(FakeResponse)
                    );
                });

                it("should call middleware with some parameters", () => {
                    this.useStub.should.have.been.calledWithExactly(
                        Sinon.match.instanceOf(Error),
                        {request: "body"},
                        Sinon.match.instanceOf(Object),
                        Sinon.match.instanceOf(Object)
                    );
                });

                it("should call next spy", () =>
                    this.nextSpy.should.have.been.calledOnce
                );

                it("shouldn't call next spy with args", () =>
                    this.nextSpy.should.not.have.been.calledWith(Sinon.match.instanceOf(Error))
                );

                it("should store data", () => {
                    expect(this.request.getStoredData()).to.deep.eq({response: "body"});
                });
            });*/

        });
    });
    describe("buildNext()", () => {
        describe("when header is not sent", () => {
            before(() => {
                $logStub.reset();
                this.handlerMetadata = {};
                this.handlerBuilder = new HandlerBuilder(this.handlerMetadata);

                this.nextStub = Sinon.stub();
                this.infoStub = Sinon.stub(this.handlerBuilder, "log").returns("log");

                this.handlerBuilder.buildNext({tagId: "1"}, {}, this.nextStub)();
            });

            it("should change the nextCalled state", () => {
                expect(this.nextStub.isCalled).to.eq(true);
            });
            it("should have called the info method", () => {
                this.infoStub.should.have.been.calledWithExactly({tagId: "1"}, {error: undefined});
            });
            it("should have called the log.debug with the correct parameters", () => {
                $logStub.debug.should.have.been.calledWithExactly("1", "[INVOKE][END  ]", "log");
            });
        });

        describe("when header is sent", () => {
            before(() => {
                $logStub.reset();
                this.handlerMetadata = {};
                this.handlerBuilder = new HandlerBuilder(this.handlerMetadata);

                this.nextStub = Sinon.stub();
                this.infoStub = Sinon.stub(this.handlerBuilder, "log").returns("log");

                this.handlerBuilder.buildNext({tagId: "1"}, {headersSent: true}, this.nextStub)();
            });

            it("should change the nextCalled state", () => {
                expect(this.nextStub.isCalled).to.eq(true);
            });
            it("should have called the info method", () => {
                return this.infoStub.should.not.have.been.called;
            });
            it("should have called the log.debug with the correct parameters", () => {
                return $logStub.debug.should.not.have.been.called;
            });
        });
    });
    describe("invoke()", () => {
        describe("when handler return data", () => {
            before(() => {
                this.response = new FakeResponse();
                this.request = {
                    storeData: Sinon.stub()
                };
                this.nextSpy = Sinon.stub();
                this.getStub = Sinon.stub(Test.prototype, "get").returns({response: "body"});

                this.metadata = {
                    type: "controller",
                    nextFunction: false
                };

                const handlerBuilder: any = new HandlerBuilder(this.metadata);
                this.buildNextStub = Sinon.stub(handlerBuilder, "buildNext").returns(this.nextSpy);
                this.localsToParamsStub = Sinon.stub(handlerBuilder, "localsToParams").returns(["parameters"]);
                this.handlerStub = Sinon.stub().returns("someData");

                Object.defineProperty(handlerBuilder, "handler", {
                    get: () => this.handlerStub
                });

                this.locals = {
                    response: this.response,
                    request: this.request,
                    next: this.nextSpy
                };

                return handlerBuilder.invoke(this.locals);
            });

            after(() => {
                restore(Test.prototype.get);
            });

            it("should have called the buildNext method", () => {
                this.buildNextStub.should.have.been.calledWithExactly(this.request, this.response, this.nextSpy);
            });

            it("should have called the locals method", () => {
                return this.localsToParamsStub.should.have.been.calledOnce.and.calledWithExactly(this.locals);
            });

            it("should have called the handler", () => {
                this.handlerStub.should.have.been.calledWithExactly("parameters");
            });

            it("should have called the next callback", () =>
                this.nextSpy.should.have.been.calledWithExactly()
            );

            it("should store data", () => {
                return this.request.storeData.should.have.been.calledWithExactly("someData");
            });
        });
        describe("when handler return data (nextFunction && function type)", () => {
            before(() => {
                $logStub.reset();
                this.response = new FakeResponse();
                this.request = {
                    tagId: "1",
                    storeData: Sinon.stub()
                };
                this.nextSpy = Sinon.stub();
                this.getStub = Sinon.stub(Test.prototype, "get").returns({response: "body"});

                this.metadata = {
                    tagId: "1",
                    type: "function",
                    nextFunction: true
                };

                const handlerBuilder: any = new HandlerBuilder(this.metadata);
                this.logStub = Sinon.stub(handlerBuilder, "log").returns("log");
                this.buildNextStub = Sinon.stub(handlerBuilder, "buildNext").returns(this.nextSpy);
                this.localsToParamsStub = Sinon.stub(handlerBuilder, "localsToParams").returns(["parameters"]);
                this.handlerStub = Sinon.stub().returns("someData");

                Object.defineProperty(handlerBuilder, "handler", {
                    get: () => this.handlerStub
                });

                this.locals = {
                    response: this.response,
                    request: this.request,
                    next: this.nextSpy
                };

                return handlerBuilder.invoke(this.locals);
            });

            after(() => {
                restore(Test.prototype.get);
            });
            it("should have called the log method", () => {
                this.logStub.should.have.been.calledWithExactly(this.request);
                $logStub.debug.should.have.been.calledWithExactly("1", "[INVOKE][START]", "log");
            });
            it("should have called the buildNext method", () => {
                this.buildNextStub.should.have.been.calledWithExactly(this.request, this.response, this.nextSpy);
            });

            it("should have called the locals method", () => {
                return this.localsToParamsStub.should.have.been.calledOnce.and.calledWithExactly(this.locals);
            });

            it("should have called the handler", () => {
                this.handlerStub.should.have.been.calledWithExactly("parameters");
            });

            it("should not have called the next callback", () =>
                this.nextSpy.should.not.have.been.called
            );

            it("should not store data", () => {
                return this.request.storeData.should.not.have.been.called;
            });
        });
        describe("when next isCalled", () => {
            before(() => {
                $logStub.reset();
                this.response = new FakeResponse();
                this.request = {
                    tagId: "1",
                    storeData: Sinon.stub()
                };
                this.nextSpy = Sinon.stub();
                this.getStub = Sinon.stub(Test.prototype, "get").returns({response: "body"});

                this.metadata = {
                    tagId: "1",
                    type: "controller",
                    nextFunction: false
                };

                const handlerBuilder: any = new HandlerBuilder(this.metadata);
                this.logStub = Sinon.stub(handlerBuilder, "log").returns("log");
                this.buildNextStub = Sinon.stub(handlerBuilder, "buildNext").returns(this.nextSpy);
                this.localsToParamsStub = Sinon.stub(handlerBuilder, "localsToParams").returns(["parameters"]);
                this.handlerStub = Sinon.stub().returns("someData");

                Object.defineProperty(handlerBuilder, "handler", {
                    get: () => {
                        this.nextSpy.isCalled = true;
                        return this.handlerStub;
                    }
                });

                this.locals = {
                    response: this.response,
                    request: this.request,
                    next: this.nextSpy
                };

                return handlerBuilder.invoke(this.locals);
            });

            after(() => {
                restore(Test.prototype.get);
            });
            it("should have called the log method", () => {
                this.logStub.should.have.been.calledWithExactly(this.request);
                $logStub.debug.should.have.been.calledWithExactly("1", "[INVOKE][START]", "log");
            });
            it("should have called the buildNext method", () => {
                this.buildNextStub.should.have.been.calledWithExactly(this.request, this.response, this.nextSpy);
            });

            it("should have called the locals method", () => {
                return this.localsToParamsStub.should.have.been.calledOnce.and.calledWithExactly(this.locals);
            });

            it("should have called the handler", () => {
                this.handlerStub.should.have.been.calledWithExactly("parameters");
            });

            it("should not have called the next callback", () =>
                this.nextSpy.should.not.have.been.called
            );

            it("should not store data", () => {
                return this.request.storeData.should.not.have.been.called;
            });
        });
        describe("when handler thrown an error", () => {
            before(() => {
                this.response = new FakeResponse();
                this.request = {
                    storeData: Sinon.stub()
                };
                this.error = new Error("test");
                this.nextSpy = Sinon.stub();
                this.getStub = Sinon.stub(Test.prototype, "get").returns({response: "body"});

                this.metadata = {
                    type: "controller",
                    nextFunction: false,
                    target: Test,
                    methodClassName: "get",
                    services: []
                };

                const handlerBuilder: any = new HandlerBuilder(this.metadata);
                this.buildNextStub = Sinon.stub(handlerBuilder, "buildNext").returns(this.nextSpy);
                this.localsToParamsStub = Sinon.stub(handlerBuilder, "localsToParams").returns(["parameters"]);
                this.handlerStub = Sinon.stub().throws(this.error);

                Object.defineProperty(handlerBuilder, "handler", {
                    get: () => this.handlerStub
                });

                this.locals = {
                    response: this.response,
                    request: this.request,
                    next: this.nextSpy
                };

                return handlerBuilder.invoke(this.locals);
            });

            after(() => {
                restore(Test.prototype.get);
            });

            it("should have called the buildNext method", () => {
                this.buildNextStub.should.have.been.calledWithExactly(this.request, this.response, this.nextSpy);
            });

            it("should have called the locals method", () => {
                return this.localsToParamsStub.should.have.been.calledOnce.and.calledWithExactly(this.locals);
            });

            it("should have called the handler", () => {
                this.handlerStub.should.have.been.calledWithExactly("parameters");
            });

            it("should call next spy", () =>
                this.nextSpy.should.have.been.calledWithExactly(this.error)
            );

            it("should not store data", () => {
                return this.request.storeData.should.not.have.been.called;
            });
        });
        describe("when handler return a Circular Object", () => {
            before(() => {
                this.response = new FakeResponse();
                this.request = new FakeRequest();
                this.nextSpy = Sinon.spy();
                this.getStub = Sinon.stub(Test.prototype, "get").returns({response: "body"});

                this.metadata = {
                    type: "controller",
                    injectable: true,
                    nextFunction: false,
                    errorParam: false,
                    target: Test,
                    methodClassName: "get",
                    services: [],
                    instance: new Test
                };

                const handlerBuilder = new HandlerBuilder(this.metadata);
                this.localsToParamsStub = Sinon.stub(handlerBuilder as any, "localsToParams").returns([]);

                const circularObject = new Error("test");
                const circularObject2 = new Error("test2");

                (circularObject as any)._circ2 = circularObject2;
                (circularObject2 as any)._circ1 = circularObject;

                Object.defineProperty(handlerBuilder, "handler", {
                    get: () => () => circularObject
                });

                (handlerBuilder as any)
                    .invoke({
                        response: this.response,
                        request: this.request,
                        next: this.nextSpy
                    })
                    .catch((er: any) => {
                        this.error = er;
                    });
            });

            after(() => {
                restore(Test.prototype.get);
            });

            it("should call the locals method", () => {
                return this.localsToParamsStub.should.have.been.calledOnce;
            });

            it("should call next spy", () =>
                this.nextSpy.should.have.been.calledOnce
            );

            it("should catch an error", () => {
                this.nextSpy.should.have.been.calledWithExactly(Sinon.match.instanceOf(Error));
            });

            it("should store data", () => {
                expect(this.request.getStoredData()).to.be.an.instanceof(Error);
            });
        });
    });
    describe("localsToParams()", () => {
        describe("when the handler is injectable", () => {
            before(() => {
                this.metadata = {
                    injectable: true,
                    nextFunction: false,
                    errorParam: false
                };

                const handlerBuilder: any = new HandlerBuilder(this.metadata);

                this.getInjectableParametersStub = Sinon.stub(handlerBuilder, "getInjectableParameters").returns(["parameters"]);

                this.result = handlerBuilder.localsToParams("locals");
            });
            it("should call the getInjectableParameters with locals", () => {
                this.getInjectableParametersStub.should.have.been.calledWithExactly("locals");
            });
            it("should return the parameters", () => {
                this.result.should.deep.eq(["parameters"]);
            });
        });

        describe("when the handler is an error middleware", () => {
            before(() => {

                this.metadata = {
                    injectable: false,
                    nextFunction: true,
                    errorParam: true
                };

                const handlerBuilder: any = new HandlerBuilder(this.metadata);

                this.getInjectableParametersStub = Sinon.stub(handlerBuilder, "getInjectableParameters").returns(["parameters"]);

                this.result = handlerBuilder.localsToParams({
                    request: "request",
                    response: "response",
                    err: "error",
                    next: "next"
                });
            });
            it("should call the getInjectableParameters with locals", () => {
                return this.getInjectableParametersStub.should.not.be.called;
            });
            it("should return the parameters", () => {
                this.result.should.deep.eq(["error", "request", "response", "next"]);
            });
        });
    });
    describe("getInjectableParameters()", () => {
        before(inject([FilterService, ValidationService, ConverterService], (filterService: any, validationService: any, converterService: any) => {
            this.invokeMethodStub = Sinon.stub(filterService, "invokeMethod");
            this.filterHasStub = Sinon.stub(filterService, "has").returns(true);
            this.deserializeStub = Sinon.stub(converterService, "deserialize");
            this.validationStub = Sinon.stub(validationService, "validate");
        }));
        after(() => {
            this.invokeMethodStub.restore();
            this.filterHasStub.restore();
            this.deserializeStub.restore();
            this.validationStub.restore();
        });

        describe("when the parameters is in the localScope", () => {
            before(() => {
                this.handlerMetadata = {
                    services: [
                        {service: EXPRESS_ERR, useConverter: false, name: "err", isValidRequiredValue: () => true}
                    ]
                };

                const handlerBuilder: any = new HandlerBuilder(this.handlerMetadata);
                this.result = handlerBuilder.getInjectableParameters({err: "error"});
            });
            it("should return the parameters", () => {
                this.result.should.deep.eq(["error"]);
            });
        });

        describe("when the parameters is an ENDPOINT_INFO", () => {
            before(() => {
                this.handlerMetadata = {
                    services: [
                        {
                            service: ENDPOINT_INFO,
                            name: "endpointInfo"
                        }
                    ]
                };

                const handlerBuilder: any = new HandlerBuilder(this.handlerMetadata);
                this.result = handlerBuilder.getInjectableParameters({request: {getEndpoint: () => "endpoint"}});
            });
            it("should return the parameters", () => {
                this.result.should.deep.eq(["endpoint"]);
            });
        });

        describe("when the parameters is an RESPONSE_DATA", () => {
            before(() => {

                this.handlerMetadata = {
                    services: [
                        {
                            service: RESPONSE_DATA,
                            name: "responseData"
                        }
                    ]
                };
                const handlerBuilder: any = new HandlerBuilder(this.handlerMetadata);
                this.result = handlerBuilder.getInjectableParameters({request: {getStoredData: () => "storedData"}});
            });
            it("should return the parameters", () => {
                this.result.should.deep.eq(["storedData"]);
            });
        });
        describe("when the parameters is a filterService without converter", () => {
            before(() => {
                this.invokeMethodStub.returns("filterData");

                const handlerMetadata: any = {
                    services: [
                        {
                            service: Test,
                            expression: "expression",
                            isValidRequiredValue: () => true,
                            useConverter: false
                        }
                    ]
                };

                const handlerBuilder: any = new HandlerBuilder(handlerMetadata);
                this.result = handlerBuilder.getInjectableParameters({request: "request", response: "response"});
            });
            after(() => {
                this.invokeMethodStub.reset();
                this.deserializeStub.reset();
                this.validationStub.reset();
            });
            it("should have called the invokeMethod", () => {
                this.invokeMethodStub.should.have.been.calledWithExactly(Test, "expression", "request", "response");
            });
            it("should return the parameters", () => {
                this.result.should.deep.eq(["filterData"]);
            });
        });
        describe("when the parameters is a filterService and it use the converter", () => {
            before(() => {
                this.invokeMethodStub.returns("filterData");
                this.deserializeStub.returns("deserializedValue");

                this.handlerMetadata = {
                    services: [
                        {
                            type: "type",
                            collectionType: "collectionType",
                            service: Test,
                            expression: "expression",
                            isValidRequiredValue: () => true,
                            useConverter: true
                        }
                    ]
                };

                const handlerBuilder: any = new HandlerBuilder(this.handlerMetadata);
                Object.defineProperty(handlerBuilder, "filterService",
                    {
                        get: () => ({
                            invokeMethod: this.invokeMethodStub,
                            has: () => true
                        })
                    }
                );

                this.result = handlerBuilder.getInjectableParameters({request: "request", response: "response"});
            });
            after(() => {
                this.invokeMethodStub.reset();
                this.deserializeStub.reset();
                this.validationStub.reset();
            });

            it("should have called the invokeMethod", () => {
                this.invokeMethodStub.should.have.been.calledWithExactly(Test, "expression", "request", "response");
            });
            it("should have called the deserialize method", () => {
                this.deserializeStub.should.have.been.calledWithExactly("filterData", "type", "collectionType");
            });
            it("should have called the validate method", () => {
                this.validationStub.should.have.been.calledWithExactly("deserializedValue", "type", "collectionType");
            });
            it("should return the parameters", () => {
                this.result.should.deep.eq(["deserializedValue"]);
            });
        });
        describe("when type didn\'t exists", () => {
            before(() => {
                this.invokeMethodStub.returns("filterData");
                this.deserializeStub.returns("deserializedValue");

                this.handlerMetadata = {
                    services: [
                        {
                            service: Test,
                            expression: "expression",
                            isValidRequiredValue: () => true,
                            useConverter: true
                        }
                    ]
                };

                const handlerBuilder: any = new HandlerBuilder(this.handlerMetadata);
                Object.defineProperty(handlerBuilder, "filterService",
                    {
                        get: () => ({
                            invokeMethod: this.invokeMethodStub,
                            has: () => true
                        })
                    }
                );

                this.result = handlerBuilder.getInjectableParameters({request: "request", response: "response"});
            });
            after(() => {
                this.invokeMethodStub.reset();
                this.deserializeStub.reset();
                this.validationStub.reset();
            });

            it("should have called the invokeMethod", () => {
                this.invokeMethodStub.should.have.been.calledWithExactly(Test, "expression", "request", "response");
            });
            it("should have called the deserialize method", () => {
                this.deserializeStub.should.have.been.calledWithExactly("filterData", undefined, undefined);
            });
            it("should not have called the validate method", () => {
                this.validationStub.should.not.have.been.called;
            });
            it("should return the parameters", () => {
                this.result.should.deep.eq(["deserializedValue"]);
            });
        });
        describe("when the parameters is required", () => {
            before(() => {
                this.invokeMethodStub.returns("filterData");
                this.deserializeStub.returns("deserializedValue");

                this.handlerMetadata = {
                    services: [
                        {
                            name: "name",
                            type: "type",
                            collectionType: "collectionType",
                            service: Test,
                            expression: "expression",
                            isValidRequiredValue: () => false,
                            useConverter: true
                        }
                    ]
                };

                const handlerBuilder: any = new HandlerBuilder(this.handlerMetadata);
                Object.defineProperty(handlerBuilder, "filterService",
                    {
                        get: () => ({
                            invokeMethod: this.invokeMethodStub,
                            has: () => true
                        })
                    }
                );

                try {
                    handlerBuilder.getInjectableParameters({request: "request", response: "response"});
                } catch (er) {
                    this.error = er;
                }
            });
            after(() => {
                this.invokeMethodStub.reset();
                this.deserializeStub.reset();
                this.validationStub.reset();
            });

            it("should have called the invokeMethod", () => {
                this.invokeMethodStub.should.have.been.calledWithExactly(Test, "expression", "request", "response");
            });
            it("should not have called the deserialize method", () => {
                this.deserializeStub.should.not.have.been.called;
            });
            it("should not have called the validate method", () => {
                this.validationStub.should.not.have.been.called;
            });
            it("should throw an error", () => {
                this.error.should.be.deep.eq(new RequiredParamError("name", "expression"));
            });
        });
    });
    describe("handler()", () => {
        describe("function", () => {
            before(() => {
                this.handlerMetadata = {
                    type: "function",
                    target: "target"
                };
                this.handlerBuilder = new HandlerBuilder(this.handlerMetadata);
            });

            it("should return the function handler", () => {
                this.handlerBuilder.handler.should.eq("target");
            });
        });
        describe("middleware", () => {
            before(() => {
                this.handlerMetadata = {
                    type: "middleware",
                    target: "target"
                };
                this.handlerBuilder = new HandlerBuilder(this.handlerMetadata);
                this.middlewareHandlerStub = Sinon.stub(this.handlerBuilder, "middlewareHandler");
                this.middlewareHandlerStub.returns("handlerMiddleware");
                this.result = this.handlerBuilder.handler;
            });

            it("should have called the middlewareHandler method", () => {
                return this.middlewareHandlerStub.should.have.been.called;
            });

            it("should return the function handler", () => {
                this.result.should.eq("handlerMiddleware");
            });
        });
        describe("controller", () => {
            before(() => {
                this.handlerMetadata = {
                    type: "controller",
                    target: "target"
                };
                this.handlerBuilder = new HandlerBuilder(this.handlerMetadata);
                Sinon.stub(this.handlerBuilder, "endpointHandler").returns("endpointHandler");
            });
            it("should return the function handler", () => {
                this.handlerBuilder.handler.should.eq("endpointHandler");
            });
        });
    });
    describe("endpointHandler()", () => {
        describe("when the controller is known", () => {
            before(() => {
                this.instance = {
                    method: () => {
                    }
                };
                this.invokeStub = Sinon.stub(InjectorService, "invoke");
                this.invokeStub.returns(this.instance);

                this.controllerGetStub = Sinon.stub(ControllerRegistry, "get");
                this.controllerGetStub.returns({
                    useClass: "providerClass"
                });
                this.handlerMetadata = {
                    target: "target",
                    methodClassName: "method"
                };
                this.handlerBuilder = new HandlerBuilder(this.handlerMetadata);

                this.locals = new Map<string | Function, any>();
                this.result = this.handlerBuilder.endpointHandler(this.locals);
            });

            after(() => {
                this.controllerGetStub.restore();
                this.invokeStub.restore();
            });

            it("should have called the ControllerRegistry.get method", () => {
                this.controllerGetStub.should.have.been.calledWithExactly("target");
            });
            it("should have called the invoke method", () => {
                this.invokeStub.should.have.been.calledWithExactly("providerClass", this.locals);
            });
            it("should return the handler", () => {
                this.result.should.have.been.a("function");
            });
            it("should have a RouterController stored in the locals", () => {
                expect(this.locals.has(RouterController)).to.be.true;
            });
        });
        describe("when the controller is known and instance is already built", () => {
            before(() => {
                this.instance = {
                    method: () => {
                    }
                };
                this.invokeStub = Sinon.stub(InjectorService, "invoke");

                this.controllerGetStub = Sinon.stub(ControllerRegistry, "get");
                this.controllerGetStub.returns({
                    useClass: "providerClass",
                    instance: this.instance
                });
                this.handlerMetadata = {
                    target: "target",
                    methodClassName: "method"
                };
                this.handlerBuilder = new HandlerBuilder(this.handlerMetadata);
                this.result = this.handlerBuilder.endpointHandler();
            });

            after(() => {
                this.controllerGetStub.restore();
                this.invokeStub.restore();
            });

            it("should have called the ControllerRegistry.get method", () => {
                this.controllerGetStub.should.have.been.calledWithExactly("target");
            });
            it("should not have called the invoke method", () => {
                this.invokeStub.should.not.be.called;
            });
            it("should return the handler", () => {
                this.result.should.have.been.a("function");
            });
        });
        describe("when the controller is unknown", () => {
            before(() => {
                this.invokeStub = Sinon.stub(InjectorService, "invoke");

                this.controllerGetStub = Sinon.stub(ControllerRegistry, "get");
                this.controllerGetStub.returns(undefined);
                this.handlerMetadata = {
                    target: "target",
                    methodClassName: "method"
                };
                this.handlerBuilder = new HandlerBuilder(this.handlerMetadata);
            });

            after(() => {
                this.controllerGetStub.restore();
                this.invokeStub.restore();
            });

            it("should throw an exception", () => {
                assert.throws(() => this.handlerBuilder.endpointHandler(), "Controller component not found in the ControllerRegistry");
            });
        });
    });
    describe("middlewareHandler()", () => {
        describe("when middleware is known", () => {
            before(() => {
                this.middlewareGetStub = Sinon.stub(MiddlewareRegistry, "get");
                this.middlewareGetStub.returns({
                    instance: {
                        use: () => {
                        }
                    }
                });
                this.handlerMetadata = {
                    target: "target"
                };
                this.handlerBuilder = new HandlerBuilder(this.handlerMetadata);
                this.result = this.handlerBuilder.middlewareHandler();
            });
            after(() => {
                this.middlewareGetStub.restore();
            });
            it("should have called the MiddlewareRegistry.get method", () => {
                this.middlewareGetStub.should.have.been.calledWithExactly("target");
            });
            it("should return the handler", () => {
                this.result.should.have.been.a("function");
            });
        });

        describe("when middleware is unknown", () => {
            before(() => {
                this.middlewareGetStub = Sinon.stub(MiddlewareRegistry, "get");
                this.middlewareGetStub.returns(undefined);
                this.handlerMetadata = {
                    target: "target"
                };
                this.handlerBuilder = new HandlerBuilder(this.handlerMetadata);
            });
            after(() => {
                this.middlewareGetStub.restore();
            });
            it("should throw an error", () => {
                assert.throws(() => {
                    this.handlerBuilder.middlewareHandler();
                }, "Middleware component not found in the MiddlewareRegistry");
            });
        });
    });
});
