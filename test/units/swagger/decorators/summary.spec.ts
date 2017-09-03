import {Store} from "../../../../src/core/class/Store";
import {Summary} from "../../../../src/swagger/decorators/summary";
import {expect} from "../../../tools";


class Test {
    test() {

    }
}

describe("Summary()", () => {
    before(() => {
        Summary("summary info")(Test, "test");
        this.store = Store.from(Test, "test", this.descriptor);
    });
    it("should set the summary", () => {
        expect(this.store.get("summary")).to.eq("summary info");
    });
});