import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {MiddlewareType} from "../../../../../src/mvc/interfaces/Middleware";

const MiddlewareRegistry: any = {
    merge: Sinon.stub()
};

const {MiddlewareError} = Proxyquire.load("../../../../../src/mvc/decorators/class/middlewareError", {
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