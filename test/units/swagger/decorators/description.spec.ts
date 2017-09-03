import {Store} from "../../../../src/core/class/Store";
import {Description} from "../../../../src/swagger/decorators/description";
import {expect} from "../../../tools";


class Test {
    test() {

    }
}

describe("Description()", () => {
    before(() => {
        Description("description")(Test, "test");
        this.store = Store.from(Test, "test");
    });
    it("should set the schema", () => {
        expect(this.store.get("schema")).to.deep.eq({description: "description"});
    });
});