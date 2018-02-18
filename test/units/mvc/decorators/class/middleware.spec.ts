import {expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {MiddlewareType} from "../../../../../src/common/mvc/interfaces";

const MiddlewareRegistry: any = {
    merge: Sinon.stub()
};

const {Middleware} = Proxyquire.load("../../../../../src/common/mvc/decorators/class/middleware", {
    "../../registries/MiddlewareRegistry": {MiddlewareRegistry}
});

class Test {

}

describe("Middleware", () => {

    before(() => {
        Middleware()(Test);
    });

    after(() => {

    });

    it("should called with some parameters", () => {
        expect(MiddlewareRegistry.merge.calledWith(Test, {type: MiddlewareType.MIDDLEWARE})).to.eq(true);
    });

});