import {Forbidden} from "ts-httpexceptions";
import {AuthenticatedMiddleware} from "../../../../src/mvc/components/AuthenticatedMiddleware";
import {FakeResponse} from "../../../helper";
import {Sinon} from "../../../tools";

class Test {

}

describe("AuthenticatedMiddleware", () => {

    before(() => {
        this.response = new FakeResponse();
        this.endpoint = {
            get: Sinon.stub().returns({})
        };

    });

    describe("use()", () => {
        describe("when isAuthenticated exists", () => {
            describe("authorize", () => {
                before(() => {
                    this.request = {
                        isAuthenticated: Sinon.stub().returns(true)
                    };
                    this.nextSpy = Sinon.spy();
                    this.middleware = new AuthenticatedMiddleware();
                    this.middleware.use(this.endpoint, this.request, this.nextSpy);
                });

                it("should have called next function", () => {
                    this.nextSpy.should.have.been.calledWithExactly();
                });
            });

            describe("unauthorize", () => {
                before(() => {
                    this.request = {
                        isAuthenticated: Sinon.stub().returns(false)
                    };
                    this.nextSpy = Sinon.spy();
                    this.middleware = new AuthenticatedMiddleware();
                    this.middleware.use(this.endpoint, this.request, this.nextSpy);
                });

                it("should have called next function", () => {
                    this.nextSpy.should.have.been.calledWithExactly(new Forbidden("Forbidden"));
                });
            });
        });

        describe("when isAuthenticated is not exists", () => {
            describe("authorize", () => {
                before(() => {
                    this.request = {};
                    this.nextSpy = Sinon.spy();
                    this.middleware = new AuthenticatedMiddleware();
                    this.middleware.use(this.endpoint, this.request, this.nextSpy);
                });

                it("should have called next function", () => {
                    this.nextSpy.should.have.been.calledWithExactly();
                });
            });
        });
    });
});