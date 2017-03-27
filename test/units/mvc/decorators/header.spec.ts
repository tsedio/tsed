import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {FakeRequest} from "../../../helper/FakeRequest";
import {FakeResponse} from "../../../helper/FakeResponse";

let middleware;
const UseAfterStub: any = function (_middleware_) {
    middleware = _middleware_;
    return () => {
    };
};

const Header = Proxyquire.load("../../../../src/mvc/decorators/header", {
    "./method/useAfter": {UseAfter: UseAfterStub}
}).Header;

class Test {

}

describe("Header", () => {

    describe("when is used to decorate a method", () => {

        before(() => {
            this.request = new FakeRequest();
            this.response = new FakeResponse();
            Sinon.stub(this.response, "set").returns(this.response);
            this.nextSpy = Sinon.spy();
        });

        after(() => {
            delete this.request;
            delete this.response;
            delete this.nextSpy;
        });


        describe("with one params has object", () => {
            before(() => {
                Header({"Content-Type": "application/json"})(Test, "test", {});
                middleware(this.request, this.response, this.nextSpy);
            });

            it("should set header when middleware is called", () => {
                assert(this.response.set.calledWith("Content-Type", "application/json"), "parameters mismatch");
            });
            it("should call next function", () => {
                assert(this.nextSpy.called, "next isn't called");
            });
        });

        describe("with two params", () => {
            before(() => {
                Header("Content-Type", "application/json")(Test, "test", {});
                middleware(this.request, this.response, this.nextSpy);
            });

            it("should set header when middleware is called", () => {
                assert(this.response.set.calledWith("Content-Type", "application/json"), "parameters mismatch");
            });
            it("should call next function", () => {
                assert(this.nextSpy.called, "next isn't called");
            });
        });

        describe("with headerSent", () => {
            before(() => {
                Header({"Content-Type": "application/json"})(Test, "test", {});
                this.response.headersSent = true;
                middleware(this.request, this.response, this.nextSpy);
            });

            it("should call next function", () => {
                assert(this.nextSpy.called, "next isn't called");
            });
        });
    });
});