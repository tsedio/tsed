import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {ResponseViewMiddleware} from "../../../../../src/mvc/components/ResponseViewMiddleware";

const middleware: any = Sinon.stub();
const UseAfter: any = Sinon.stub().returns(middleware);

const EndpointRegistry: any = {
    setMetadata: Sinon.stub()
};

const {ResponseView} = Proxyquire.load("../../../../../src/mvc/decorators/method/responseView", {
    "./useAfter": {UseAfter},
    "../../registries/EndpointRegistry": {EndpointRegistry}
});

class Test {

}

describe("ResponseView", () => {

    before(() => {
        this.descriptor = {};
        this.options = ["page", {}];
        ResponseView(...this.options)(Test, "test", this.descriptor);
    });

    after(() => {
        delete this.descriptor;
        delete this.options;
    });

    it("should set metadata", () => {
        assert(EndpointRegistry.setMetadata.calledWith(
            ResponseViewMiddleware,
            {
                viewPath: this.options[0],
                viewOptions: this.options[1]
            },
            Test,
            "test"
        ), "shouldn't set metadata");
    });

    it("should create middleware", () => {
        assert(UseAfter.calledWith(ResponseViewMiddleware), "haven't the right middleware");
        assert(middleware.calledWith(Test, "test", this.descriptor));
    });

});