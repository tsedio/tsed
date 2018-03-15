import {Store} from "../../../../src/core/class/Store";
import {descriptorOf} from "../../../../src/core/utils";
import {Indexed} from "../../../../src/mongoose/decorators";
import {expect} from "../../../tools";

describe("@Indexed()", () => {
    class Test {
    }

    before(() => {
        Indexed()(Test, "test", descriptorOf(Test, "test"));
        this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });

    it("should set metadata", () => {
        expect(this.store.get("mongooseSchema")).to.deep.eq({
            index: true
        });
    });
});