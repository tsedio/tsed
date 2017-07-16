import * as Sinon from "sinon";
import {Forbidden} from "ts-httpexceptions";
import {AuthenticatedMiddleware} from "../../../../src/mvc/components/AuthenticatedMiddleware";
import {FakeRequest, FakeResponse} from "../../../helper";
import {assert, expect} from "../../../tools";

class Test {

}

describe("AuthenticatedMiddleware", () => {

    before(() => {

        this.request = new FakeRequest();
        this.response = new FakeResponse();
        this.endpoint = {
            store: {get: Sinon.stub().returns({})}
        };

    });

    describe("use()", () => {

        describe("authorize", () => {
            before(() => {
                this.settingsSpy = {
                    authentification: Sinon.stub().returns(true)
                };
                this.nextSpy = Sinon.spy();
                this.middleware = new AuthenticatedMiddleware(this.settingsSpy);
                this.middleware.use(this.endpoint, this.requestStub, this.responseStub, this.nextSpy);
            });
            after(() => {
                delete this.middleware;
                delete this.settingsSpy;
                delete this.nextSpy;
            });

            it("should have called next function", () => {
                assert(this.nextSpy.called);
            });

        });

        describe("unauthorize", () => {
            before(() => {
                this.settingsSpy = {
                    authentification: Sinon.stub().returns(false)
                };
                this.nextSpy = Sinon.spy();
                this.middleware = new AuthenticatedMiddleware(this.settingsSpy);
                this.middleware.use(this.endpoint, this.requestStub, this.responseStub, this.nextSpy);
            });
            after(() => {
                delete this.middleware;
                delete this.settingsSpy;
                delete this.nextSpy;
            });

            it("should throws Forbidden error", () => {
                expect(this.nextSpy.args[0][0]).to.be.instanceof(Forbidden);
            });

        });

    });
});