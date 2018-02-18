import {Service} from "../../../../src/common/di/decorators/service";
import {InjectorService} from "../../../../src/common/di/services/InjectorService";
import {Sinon} from "../../../tools";

class Test {
}

describe("Service", () => {
    before(() => {
        this.serviceStub = Sinon.stub(InjectorService, "service");

        Service()(Test);
    });

    after(() => {
        this.serviceStub.restore();
    });

    it("should set metadata", () => {
        this.serviceStub.should.be.calledWithExactly(Test);
    });
});