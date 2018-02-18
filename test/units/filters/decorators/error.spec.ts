import {EXPRESS_ERR} from "../../../../src/common/filters/constants";
import {Err} from "../../../../src/common/filters/decorators/error";
import {ParamRegistry} from "../../../../src/common/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

class Test {

}

describe("Err", () => {

    before(() => {
        this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
        Err();
    });

    after(() => {
        this.decorateStub.restore();
    });

    it("should have been called ParamFilter.decorate method with the correct parameters", () =>
        this.decorateStub.should.have.been.calledOnce
            .and
            .calledWithExactly(EXPRESS_ERR)
    );
});
