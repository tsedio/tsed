import {EXPRESS_REQUEST} from "../../../../src/filters/constants";
import {Req} from "../../../../src/filters/decorators/request";
import {ParamRegistry} from "../../../../src/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

class Test {

}

describe("Request", () => {

    before(() => {
        this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
        Req();
    });

    after(() => {
        this.decorateStub.restore();
    });

    it("should have been called ParamFilter.decorate method with the correct parameters", () =>
        this.decorateStub.should.have.been.calledOnce
            .and
            .calledWithExactly(EXPRESS_REQUEST)
    );
});
