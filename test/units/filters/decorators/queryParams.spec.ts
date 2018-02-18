import {QueryParamsFilter} from "../../../../src/common/filters/components/QueryParamsFilter";
import {QueryParams} from "../../../../src/common/filters/decorators/queryParams";
import {ParamRegistry} from "../../../../src/common/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

class Test {

}

describe("QueryParams", () => {

    before(() => {
        this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
        QueryParams("test", Test);
    });

    after(() => {
        this.decorateStub.restore();
    });

    it("should have been called ParamFilter.decorate method with the correct parameters", () =>
        this.decorateStub.should.have.been.calledOnce
            .and
            .calledWithExactly(QueryParamsFilter, {
                expression: "test",
                useType: Test,
                useConverter: true,
                useValidation: true
            })
    );
});
