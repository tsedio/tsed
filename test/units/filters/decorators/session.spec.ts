import {SessionFilter} from "../../../../src/common/filters/components/SessionFilter";
import {Session} from "../../../../src/common/filters/decorators/session";
import {ParamRegistry} from "../../../../src/common/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

class Test {

}

describe("Session", () => {

    before(() => {
        this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
        Session("test", Test);
    });

    after(() => {
        this.decorateStub.restore();
    });

    it("should have been called ParamFilter.decorate method with the correct parameters", () =>
        this.decorateStub.should.have.been.calledOnce
            .and
            .calledWithExactly(SessionFilter, {
                expression: "test",
                useType: Test
            })
    );
});
