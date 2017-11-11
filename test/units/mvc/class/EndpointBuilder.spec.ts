import * as Express from "express";
import * as Proxyquire from "proxyquire";
import {globalServerSettings} from "../../../../src/config";

import {EndpointMetadata} from "../../../../src/mvc/class/EndpointMetadata";
import {inject} from "../../../../src/testing/inject";
import {FakeRequest} from "../../../helper/FakeRequest";
import {FakeResponse} from "../../../helper/FakeResponse";
import {expect, Sinon} from "../../../tools";


const HandlerBuilder = {
    from: Sinon.stub().returns({
        build: Sinon.stub().returns(() => {

        })
    })
};

const {EndpointBuilder} = Proxyquire("../../../../src/mvc/class/EndpointBuilder", {
    "./HandlerBuilder": {
        HandlerBuilder
    }
});

class Test {
    method() {
        return "test";
    }
}

describe("EndpointBuilder", () => {

    before(inject([], () => {
        this.router = Express.Router();
        Sinon.stub(this.router, "use");
        Sinon.stub(this.router, "get");

        this.endpointMetadata = new EndpointMetadata(Test, "method");
        this.endpointBuilder = new EndpointBuilder(this.endpointMetadata, this.router);
    }));

    after(() => {
        this.router.get.restore();
        this.router.use.restore();
        delete this.router;
        delete this.endpointMetadata;
        delete this.endpointBuilder;
    });

    describe("build()", () => {

        describe("use", () => {

            before(() => {
                this.middlewares = this.endpointBuilder.build();
            });

            it("should build middlewares", () => {
                expect(this.middlewares).to.be.an("array").and.have.length(3);
            });

            it("should call HandlerBuilder", () => {
                expect(HandlerBuilder.from.called).to.eq(true);
            });

            it("should call use method", () =>
                this.router.use.should.have.been.calledOnce
            );

            it("should call with args", () => {
                this.router.use.should.have.been.calledWithExactly(...this.middlewares);
            });
        });

        describe("get", () => {
            before(() => {
                this.endpointMetadata.httpMethod = "get";
                this.endpointMetadata.path = "/";
            });

            it("should build middlewares", () => {
                expect(this.endpointBuilder.build()).to.be.an("array").and.have.length(3);
            });

            it("should call HandlerBuilder", () => {
                expect(HandlerBuilder.from.called).to.eq(true);
            });

            it("should call get method", () =>
                this.router.get.should.have.been.calledOnce
            );

            it("should call with args", () => {
                this.router.get.should.have.been.calledWithExactly("/", Sinon.match.func, Sinon.match.func, Sinon.match.func);
            });
        });

    });

    describe("onRequest()", () => {
        before(() => {
            globalServerSettings.debug = true;
            this.request = new FakeRequest();
            this.request.id = 1;
            this.response = new FakeResponse();
            Sinon.stub(this.response, "setHeader");
            this.nextSpy = Sinon.spy(() => {
            });

        });

        after(() => {
            globalServerSettings.debug = false;
            this.response.setHeader.restore();
        });

        describe("without headersSent", () => {
            before(() => {
                this.endpointBuilder.onRequest()(this.request, this.response, this.nextSpy);
                this.request.storeData({stored: true});
            });

            it("should attach getEndpoint method to the current request", () => {
                expect(this.request.getEndpoint).to.be.a("function");
            });

            it("should return EndpointMetadata", () => {
                expect(this.request.getEndpoint()).to.equal(this.endpointMetadata);
            });

            it("should attach storeData method to the current request", () => {
                expect(this.request.storeData).to.be.a("function");
            });

            it("should attach getStoredData method to the current request", () => {
                expect(this.request.getStoredData).to.be.a("function");
            });

            it("should return an Object when it call getStoredData", () => {
                expect(this.request.getStoredData()).to.be.an("object");
            });
        });

        describe("with headersSent", () => {
            before(() => {
                this.response.setHeader.reset();
                this.response.headersSent = true;

                this.endpointBuilder.onRequest()(this.request, this.response, this.nextSpy);
                this.request.storeData({stored: true});
            });

            it("shouldn't set header", () =>
                this.response.setHeader.should.not.have.been.called
            );

            it("should attach getEndpoint method to the current request", () => {
                expect(this.request.getEndpoint).to.be.a("function");
            });

            it("should return EndpointMetadata", () => {
                expect(this.request.getEndpoint()).to.equal(this.endpointMetadata);
            });

            it("should attach storeData method to the current request", () => {
                expect(this.request.storeData).to.be.a("function");
            });

            it("should attach getStoredData method to the current request", () => {
                expect(this.request.getStoredData).to.be.a("function");
            });

            it("should return an Object when it call getStoredData", () => {
                expect(this.request.getStoredData()).to.be.an("object");
            });
        });
    });

});