import {ENDPOINT_INFO} from "../../../../src/filters/constants";
import {EndpointInfo} from "../../../../src/filters/decorators/endpointInfo";
import {ParamRegistry} from "../../../../src/filters/registries/ParamRegistry";
import {Sinon} from "../../../tools";

class Test {

}

describe("EndpointInfo", () => {

    before(() => {
        this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
        EndpointInfo();
    });

    after(() => {
        this.decorateStub.restore();
    });

    it("should have been called ParamFilter.decorate method with the correct parameters", () =>
        this.decorateStub.should.have.been.calledOnce
            .and
            .calledWithExactly(ENDPOINT_INFO)
    );
});
