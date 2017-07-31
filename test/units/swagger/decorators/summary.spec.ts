import {Store} from "../../../../src/core/class/Store";
import {Summary} from "../../../../src/swagger/decorators/summary";
import {Sinon} from "../../../tools";


class Test {
    test() {

    }
}

describe("Summary", () => {

    before(() => {
        this.mergeStub = Sinon.stub(Store.prototype, "merge");
        Summary("summary info")(Test, "test");
    });

    after(() => {
        this.mergeStub.restore();
    });

    it("should set the summary", () => {
        this.mergeStub.should.be.calledOnce;
        this.mergeStub.should.be.calledWithExactly("summary", "summary info");
    });
});