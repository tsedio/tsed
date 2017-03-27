import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {AcceptMimesMiddleware} from "../../../../../src/mvc/components/AcceptMimesMiddleware";

const middleware: any = Sinon.stub();
const UseBefore: any = Sinon.stub().returns(middleware);

const EndpointRegistry: any = {
    setMetadata: Sinon.stub()
};

const {AcceptMime} = Proxyquire.load("../../../../../src/mvc/decorators/method/acceptMime", {
    "./useBefore": {UseBefore},
    "../../registries/EndpointRegistry": {EndpointRegistry}
});

class Test {

}

describe("AcceptMime", () => {

    before(() => {
        this.descriptor = {};
        this.options = "application/json";
        AcceptMime("application/json")(Test, "test", this.descriptor);
    });

    after(() => {
        delete this.descriptor;
        delete this.options;
    });

    it("should set metadata", () => {
        assert(EndpointRegistry.setMetadata.calledWith(AcceptMimesMiddleware, [this.options], Test, "test"), "shouldn't set metadata");
    });

    it("should create middleware", () => {
        assert(UseBefore.calledWith(AcceptMimesMiddleware), "haven't the right middleware");
        assert(middleware.calledWith(Test, "test", this.descriptor));
    });

});