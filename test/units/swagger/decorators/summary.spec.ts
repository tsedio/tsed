import {Store} from "../../../../src/core/class/Store";
import {Summary} from "../../../../src/swagger/decorators/summary";
import {assert, expect} from "../../../tools";
import {descriptorOf} from "../../../../src/core/utils";


class Test {
    test() {

    }
}

describe("Summary()", () => {
    describe("when is used as method decorator", () => {
        before(() => {
            Summary("summary info")(Test, "test", descriptorOf(Test, "test"));
            this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
        });
        it("should set the summary", () => {
            expect(this.store.get("operation").summary).to.eq("summary info");
        });
    });

    describe("when is not used as method decorator", () => {
        it("should throw an exception", () => {
            assert.throws(() => Summary("summary")(Test, "test"), "Summary is only supported on method");
        });
    });
});