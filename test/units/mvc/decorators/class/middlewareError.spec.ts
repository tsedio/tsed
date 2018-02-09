import {expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {MiddlewareType} from "../../../../../src/common/mvc/interfaces";

const MiddlewareRegistry: any = {
    merge: Sinon.stub()
};

const {MiddlewareError} = Proxyquire.load("../../../../../src/common/mvc/decorators/class/middlewareError", {
    "../../registries/MiddlewareRegistry": {MiddlewareRegistry}
});

class Test {

}

describe("MiddlewareError", () => {

    before(() => {
        MiddlewareError()(Test);
    });

    after(() => {

    });

    it("should called with some parameters", () => {
        expect(MiddlewareRegistry.merge.calledWith(Test, {type: MiddlewareType.ERROR})).to.eq(true);
    });

});