import {Store} from "../../../../src/core/class/Store";
import {Schema} from "../../../../src/swagger/decorators/schema";
import {expect} from "../../../tools";


class Test {
    test() {

    }
}

describe("Schema()", () => {
    before(() => {
        Schema({description: "description"})(Test, "test");
        this.store = Store.from(Test, "test");
    });
    it("should set the schema", () => {
        expect(this.store.get("schema")).to.deep.eq({description: "description"});
    });
});