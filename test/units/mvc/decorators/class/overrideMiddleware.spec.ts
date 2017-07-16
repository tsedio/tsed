import {OverrideMiddleware} from "../../../../../src/mvc/decorators/class/overrideMiddleware";
import {MiddlewareRegistry} from "../../../../../src/mvc/registries/MiddlewareRegistry";
import {Sinon} from "../../../../tools";


class Test {

}
class MiddlewareTest {

}

describe("OverrideMiddleware", () => {

    before(() => {
        this.middlewareRegistryStub = Sinon.stub(MiddlewareRegistry, "merge");

        OverrideMiddleware(MiddlewareTest)(Test);
    });

    after(() => {
        this.middlewareRegistryStub.restore();
    });

    it("should called with some parameters", () => {
        this.middlewareRegistryStub.should.be.calledWithExactly(MiddlewareTest, {useClass: Test});
    });

});