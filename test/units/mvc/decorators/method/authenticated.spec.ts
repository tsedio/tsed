import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {AuthenticatedMiddleware} from "../../../../../src/mvc/components/AuthenticatedMiddleware";

const middleware: any = Sinon.stub();
const UseBefore: any = Sinon.stub().returns(middleware);

const EndpointRegistry: any = {
    setMetadata: Sinon.stub()
};

const {Authenticated} = Proxyquire.load("../../../../../src/mvc/decorators/method/authenticated", {
    "./useBefore": {UseBefore},
    "../../registries/EndpointRegistry": {EndpointRegistry}
});

class Test {

}

describe("Authenticated", () => {

    before(() => {
        this.descriptor = {};
        this.options = {};
        Authenticated(this.options)(Test, "test", this.descriptor);
    });

    after(() => {
        delete this.descriptor;
        delete this.options;
    });

    it("should set metadata", () => {
        assert(EndpointRegistry.setMetadata.calledWith(AuthenticatedMiddleware, this.options, Test, "test"), "shouldn't set metadata");
    });

    it("should create middleware", () => {
        assert(UseBefore.calledWith(AuthenticatedMiddleware), "haven't the right middleware");
        assert(middleware.calledWith(Test, "test", this.descriptor));
    });

});