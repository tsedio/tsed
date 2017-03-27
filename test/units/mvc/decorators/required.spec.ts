import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";

const ParamsRegistry: any = {
    required: Sinon.stub()
};

const {Required} = Proxyquire.load("../../../../src/mvc/decorators/required", {
    "../registries/ParamsRegistry": {ParamsRegistry}
});

class Test {

}

describe("Required", () => {

    before(() => {
        Required()(Test, "test", 0);
    });

    after(() => {

    });

    it("should called with some parameters", () => {
        assert(ParamsRegistry.required.calledWith(Test, "test", 0));
    });

});