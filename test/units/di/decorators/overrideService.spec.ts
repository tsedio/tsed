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

        OverrideService(Test)(Test2);
    });

    after(() => {
        this.mergeStub.restore();
    });

    it("should set metadata", () => {
        this.mergeStub.should.be.calledWithExactly(Test, {useClass: Test2});
    });
});