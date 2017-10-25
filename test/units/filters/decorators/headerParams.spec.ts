import {HeaderParamsFilter} from "../../../../src/filters/components/HeaderParamsFilter";
import {HeaderParams} from "../../../../src/filters/decorators/headerParams";
import {ParamRegistry} from "../../../../src/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

class Test {

}

describe("HeaderParams", () => {

    before(() => {
        this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
        HeaderParams("test");
    });

    after(() => {
        this.decorateStub.restore();
    });

    it("should have been called ParamFilter.decorate method with the correct parameters", () =>
        this.decorateStub.should.have.been.calledOnce
            .and
            .calledWithExactly(HeaderParamsFilter, {
                expression: "test"
            })
    );
});
