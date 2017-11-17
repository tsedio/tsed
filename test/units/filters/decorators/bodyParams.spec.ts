import {BodyParamsFilter} from "../../../../src/filters/components/BodyParamsFilter";
import {BodyParams} from "../../../../src/filters/decorators/bodyParams";
import {ParamRegistry} from "../../../../src/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

class Test {

}

describe("BodyParams", () => {

    before(() => {
        this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
        BodyParams("test", Test);
    });

    after(() => {
        this.decorateStub.restore();
    });

    it("should have been called ParamFilter.decorate method with the correct parameters", () =>
        this.decorateStub.should.have.been.calledOnce
            .and
            .calledWithExactly(BodyParamsFilter, {
                expression: "test",
                useType: Test,
                useConverter: true,
                useValidation: true
            })
    );
});
