import {expect, Sinon} from "../../../../tools";
import * as Proxyquire from "proxyquire";
import {AuthenticatedMiddleware} from "../../../../../src/mvc/components/AuthenticatedMiddleware";
import {EndpointRegistry} from "../../../../../src/mvc/registries/EndpointRegistry";

const middleware: any = Sinon.stub();
const UseBefore: any = Sinon.stub().returns(middleware);

const {Authenticated} = Proxyquire.load("../../../../../src/mvc/decorators/method/authenticated", {
    "./useBefore": {UseBefore}
});

class Test {

}

describe("Authenticated", () => {

    before(() => {
        this.descriptor = {};
        this.options = {};

        Authenticated(this.options)(Test, "test", this.descriptor);
        this.store = EndpointRegistry.store(Test, "test");
    });

    after(() => {
        this.store.clear();
    });


    it("should set metadata", () => {
        expect(this.store.get(AuthenticatedMiddleware)).to.deep.eq(this.options);
    });

    it("should create middleware", () => {
        UseBefore.should.have.been.calledWith(AuthenticatedMiddleware);
        middleware.should.have.been.calledWith(Test, "test", this.descriptor);
    });

});