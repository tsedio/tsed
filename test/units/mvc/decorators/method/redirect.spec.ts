import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {FakeResponse} from "../../../../helper/FakeResponse";

const middleware: any = Sinon.stub();
const UseAfter: any = Sinon.stub().returns(middleware);

const {Redirect} = Proxyquire.load("../../../../../src/mvc/decorators/method/redirect", {
    "./useAfter": {UseAfter}
});

class Test {

}

describe("Redirect", () => {

    describe("with one parameter", () => {
        before(() => {
            this.descriptor = {};
            this.options = "test";
            Redirect(this.options)(Test, "test", this.descriptor);
            this.middleware = UseAfter.args[0][0];
        });

        after(() => {
            delete this.descriptor;
            delete this.options;
            delete this.middleware;
        });

        it("should create middleware", () => {
            expect(this.middleware).to.be.a("function");
            assert(middleware.calledWith(Test, "test", this.descriptor));
        });

        describe("when middleware is executed", () => {

            before(() => {
                this.nextSpy = Sinon.stub();
                this.response = new FakeResponse();
                Sinon.stub(this.response, "redirect");

                this.middleware({}, this.response, this.nextSpy);
            });

            after(() => {
                delete this.response;
                delete this.nextSpy;
            });

            it("should call response method", () => {
                assert(this.response.redirect.calledWith(this.options), "method not called");
            });

            it("should call next function", () => {
                assert(this.nextSpy.called, "function not called");
            });

        });

        describe("when middleware is executed but header is sent", () => {

            before(() => {
                this.nextSpy = Sinon.stub();
                this.response = new FakeResponse();
                this.response.headersSent = true;
                Sinon.stub(this.response, "type");

                this.middleware({}, this.response, this.nextSpy);
            });

            after(() => {
                delete this.response;
                delete this.nextSpy;
            });

            it("should call response method", () => {
                assert(!this.response.redirect.called, "method is called");
            });

            it("should call next function", () => {
                assert(this.nextSpy.called, "function not called");
            });

        });

    });

    describe("with two parameters", () => {
        before(() => {
            this.descriptor = {};
            Redirect(200, "test2")(Test, "test", this.descriptor);
            this.middleware = UseAfter.args[1][0];
        });

        after(() => {
            delete this.descriptor;
            delete this.options;
            delete this.middleware;
        });

        it("should create middleware", () => {
            expect(this.middleware).to.be.a("function");
            assert(middleware.calledWith(Test, "test", this.descriptor));
        });

        describe("when middleware is executed", () => {

            before(() => {
                this.nextSpy = Sinon.stub();
                this.response = new FakeResponse();
                Sinon.stub(this.response, "redirect");

                this.middleware({}, this.response, this.nextSpy);
            });

            after(() => {
                delete this.response;
                delete this.nextSpy;
            });

            it("should call response method", () => {
                assert(this.response.redirect.calledWith(200, "test2"), "method not called");
            });

            it("should call next function", () => {
                assert(this.nextSpy.called, "function not called");
            });

        });
    });
});