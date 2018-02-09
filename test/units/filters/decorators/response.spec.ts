import {EXPRESS_RESPONSE} from "../../../../src/common/filters/constants";
import {Res} from "../../../../src/common/filters/decorators/response";
import {ParamRegistry} from "../../../../src/common/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

class Test {

}

describe("Response", () => {

    before(() => {
        this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
        Res();
    });

    after(() => {
        this.decorateStub.restore();
    });

    it("should have been called ParamFilter.decorate method with the correct parameters", () =>
        this.decorateStub.should.have.been.calledOnce
            .and
            .calledWithExactly(EXPRESS_RESPONSE)
    );
});
