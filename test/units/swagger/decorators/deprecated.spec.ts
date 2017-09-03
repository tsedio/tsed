import {Store} from "../../../../src/core/class/Store";
import {Deprecated} from "../../../../src/swagger/decorators/deprecated";
import {expect} from "../../../tools";


class Test {
    test() {

    }
}

describe("Deprecated()", () => {
    before(() => {
        Deprecated()(Test, "test", {});
        this.store = Store.from(Test, "test", {});
    });
    it("should set the deprecated", () => {
        expect(this.store.get("deprecated")).to.eq(true);
    });
});