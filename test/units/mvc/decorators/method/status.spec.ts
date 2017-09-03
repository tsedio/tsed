import * as Proxyquire from "proxyquire";
import {Store} from "../../../../../src/core/class/Store";
import {FakeResponse} from "../../../../helper/FakeResponse";
import {expect, Sinon} from "../../../../tools";

const middleware: any = Sinon.stub();
const UseAfter: any = Sinon.stub().returns(middleware);

const {Status} = Proxyquire.load("../../../../../src/mvc/decorators/method/status", {
    "./useAfter": {UseAfter}
});

class Test {

}

describe("Status", () => {

    before(() => {
        this.descriptor = {};
        this.options = 200;
        Status(this.options, {
            description: "description",
            use: "use",
            collection: "collection"
        })(Test, "test", this.descriptor);
        this.middleware = UseAfter.args[0][0];
        this.store = Store.from(Test, "test", this.descriptor);
    });

    after(() => {
        delete this.descriptor;
        delete this.options;
        delete this.middleware;
    });

    it("should create middleware", () => {
        expect(this.middleware).to.be.a("function");
        middleware.should.be.calledWithExactly(Test, "test", this.descriptor);
    });

    it("should store data in the Store", () => {
        expect(this.store.get("responses")).to.deep.eq({
            "200": {
                "collectionType": "collection",
                "description": "description",
                "type": "use"
            }
        });
    });

    describe("when middleware is executed", () => {

        before(() => {
            this.nextSpy = Sinon.stub();
            this.response = new FakeResponse();
            Sinon.stub(this.response, "status");

            this.middleware({}, this.response, this.nextSpy);
        });

        after(() => {
            delete this.response;
            delete this.nextSpy;
        });

        it("should call response method", () => {
            this.response.status.should.be.calledWith(this.options);
        });

        it("should call next function", () => {
            return this.nextSpy.should.be.calledOnce;
        });

        it("shoul store data in the Store", () => {
            this.store.get("responses", {});
        });
    });

    describe("when middleware is executed but header is sent", () => {

        before(() => {
            this.nextSpy = Sinon.stub();
            this.response = new FakeResponse();
            this.response.headersSent = true;
            Sinon.stub(this.response, "status");

            this.middleware({}, this.response, this.nextSpy);
        });

        after(() => {
            delete this.response;
            delete this.nextSpy;
        });

        it("should call response method", () => {
            return this.response.status.should.not.be.called;
        });

        it("should call next function", () => {
            return this.nextSpy.should.be.calledOnce;
        });

    });
});