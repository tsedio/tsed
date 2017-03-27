import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {MiddlewareType} from "../../../../../src/mvc/interfaces/Middleware";

const MiddlewareRegistry: any = {
    merge: Sinon.stub()
};

const {Middleware} = Proxyquire.load("../../../../../src/mvc/decorators/class/middleware", {
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