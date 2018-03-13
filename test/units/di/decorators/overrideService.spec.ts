import {OverrideService} from "../../../../src/common/di/decorators/overrideService";
import {ProviderRegistry} from "../../../../src/common/di/registries/ProviderRegistry";
import {Sinon} from "../../../tools";

class Test {
}

class Test2 {
}

describe("OverrideService", () => {
    before(() => {
        this.mergeStub = Sinon.stub(ProviderRegistry, "merge");
        this.hasStub = Sinon.stub(ProviderRegistry, "has").returns(true);

        OverrideService(Test)(Test2);
    });

    after(() => {
        this.mergeStub.restore();
        this.hasStub.restore();
    });

    it("should set metadata", () => {
        this.mergeStub.should.be.calledWithExactly(Test, {provide: Test, useClass: Test2});
    });
});