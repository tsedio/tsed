import {ProviderRegistry, Service} from "@tsed/common";
import {Sinon} from "../../../tools";

class Test {
}

describe("Service", () => {
    before(() => {
        this.serviceStub = Sinon.stub(ProviderRegistry, "merge");

        Service()(Test);
    });

    after(() => {
        this.serviceStub.restore();
    });

    it("should set metadata", () => {
        this.serviceStub.should.have.been.calledWithExactly(Test, {provide: Test, type: "service"});
    });
});