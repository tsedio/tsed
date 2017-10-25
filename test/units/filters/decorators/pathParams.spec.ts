import {PathParamsFilter} from "../../../../src/filters/components/PathParamsFilter";
import {PathParams} from "../../../../src/filters/decorators/pathParams";
import {ParamRegistry} from "../../../../src/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

class Test {

}

describe("PathParams", () => {

    before(() => {
        this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
        PathParams("test", Test);
    });

    after(() => {
        this.decorateStub.restore();
    });

    it("should have been called ParamFilter.decorate method with the correct parameters", () =>
        this.decorateStub.should.have.been.calledOnce
            .and
            .calledWithExactly(PathParamsFilter, {
                expression: "test",
                useType: Test
            })
    );
});
