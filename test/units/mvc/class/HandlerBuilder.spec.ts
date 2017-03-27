import {expect, Sinon} from "../../../tools";
import * as Proxyquire from "proxyquire";
import {EndpointMetadata} from "../../../../src/mvc/class/EndpointMetadata";
import {FakeRequest} from "../../../helper/FakeRequest";
import {FakeResponse} from "../../../helper/FakeResponse";
import {PathParamsFilter} from "../../../../src/filters/components/PathParamsFilter";
import {inject} from "../../../../src/testing/inject";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {ENDPOINT_INFO, EXPRESS_ERR, RESPONSE_DATA} from "../../../../src/mvc/constants/index";
import {RequiredParamError} from "../../../../src/mvc/errors/RequiredParamError";

class Test {

    get() {

    }

    use() {

    }
}

const ParamsRegistry = {
    isInjectable: Sinon.stub(),
    hasNextFunction: Sinon.stub(),
    getParams: Sinon.stub().returns([])
};

const MiddlewareRegistry = {
    has: Sinon.stub(),
    get: Sinon.stub()
};

const ControllerRegistry = {
    has: Sinon.stub(),
    get: Sinon.stub().withArgs(Test).returns({
        useClass: Test,
        provide: Test
    })
};

const ConverterService = {
    deserialize: Sinon.stub()
};

const HandlerBuilder = Proxyquire("../../../../src/mvc/class/HandlerBuilder", {
    "../registries/ParamsRegistry": {ParamsRegistry},
    "../registries/MiddlewareRegistry": {MiddlewareRegistry},
    "../registries/ConverterService": {ConverterService},
    "../registries/ControllerRegistry": {ControllerRegistry}
}).HandlerBuilder;


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

            describe("from function with next func", () => {

                before(inject([], () => {
                    this.response = new FakeResponse();
                    this.request = new FakeRequest();
                    this.nextSpy = Sinon.spy();

                    this.stub = Sinon.stub();

                    this.metadata = {
                        type: "function",
                        nextFunction: true,
                        errorParam: false,
                        target: (req, res, next) => {
                            this.stub(req, res, next);
                            next();
                        }
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
                        target: (req, res) => {
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
                        target: (err, req, res, next) => {
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
                    ConverterService.deserialize.returns({response: "body"});

                    this.metadata = {
                        type: "controller",
                        injectable: true,
                        nextFunction: false,
                        errorParam: false,
                        target: Test,
                        methodClassName: "get",
                        services: [{service: PathParamsFilter, useConverter: true}],
                        instance: new Test
                    };

                    this.invokeMethodStub = Sinon.stub(FilterService.prototype, "invokeMethod").returns({request: "body"});

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(this.request, this.response, this.nextSpy)
                        .catch(er => console.error(er));
                });

                after(() => {
                    (Test.prototype.get as any).restore();
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
                        Sinon.match.instanceOf(FakeResponse),
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
                            expression: "required"
                        }],
                        instance: new Test
                    };

                    this.invokeMethodStub = Sinon.stub(FilterService.prototype, "invokeMethod").returns(undefined);

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(this.request, this.response, this.nextSpy)
                        .catch(er => console.error(er));
                });

                after(() => {
                    (Test.prototype.get as any).restore();
                    (FilterService.prototype.invokeMethod as any).restore();
                });

                it("should create middleware", () => {
                    expect(this.middleware).to.be.a("function").and.length(3);
                });

                it("should invoke middleware with some parameters", () => {
                    this.invokeMethodStub.should.have.been.calledWithExactly(
                        Sinon.match.func,
                        "required",
                        Sinon.match.instanceOf(FakeRequest),
                        Sinon.match.instanceOf(FakeResponse),
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
                    MiddlewareRegistry.get.returns({instance: new Test});

                    this.metadata = {
                        type: "middleware",
                        injectable: true,
                        nextFunction: false,
                        errorParam: false,
                        target: Test,
                        methodClassName: "use",
                        services: [{service: PathParamsFilter}]
                    };

                    this.invokeMethodStub = Sinon.stub(FilterService.prototype, "invokeMethod").returns({request: "body"});

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(this.request, this.response, this.nextSpy)
                        .catch(er => console.error(er));
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
                        Sinon.match.instanceOf(FakeResponse),
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
                    MiddlewareRegistry.get.returns({instance: new Test});

                    this.metadata = {
                        type: "middleware",
                        injectable: true,
                        nextFunction: false,
                        errorParam: true,
                        target: Test,
                        methodClassName: "use",
                        services: [
                            {service: EXPRESS_ERR, useConverter: false, name: "err"},
                            {service: PathParamsFilter},
                            {service: ENDPOINT_INFO, useConverter: false, name: "endpointInfo"},
                            {service: RESPONSE_DATA, useConverter: false, name: "responseData"}
                        ]
                    };

                    this.invokeMethodStub = Sinon.stub(FilterService.prototype, "invokeMethod").returns({request: "body"});

                    this.middleware = new HandlerBuilder(this.metadata).build();
                    this.middleware(new Error(), this.request, this.response, this.nextSpy)
                        .catch(er => console.error(er));
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
                        Sinon.match.instanceOf(FakeResponse),
                    );
                });

                it("should call middleware with some parameters", () => {
                    this.useStub.should.have.been.calledWithExactly(
                        Sinon.match.instanceOf(Error),
                        {request: "body"},
                        Sinon.match.instanceOf(Object),
                        Sinon.match.instanceOf(Object),
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
            });

        });

    });
});
