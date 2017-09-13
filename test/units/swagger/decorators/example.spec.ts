import {Store} from "../../../../src/core/class/Store";
import {Example} from "../../../../src/swagger/decorators/example";
import {expect} from "../../../tools";


class Test {
    test() {

    }
}

describe("Example()", () => {
    before(() => {
        Example("name", "description")(Test, "test");
        this.store = Store.from(Test, "test");
    });
    it("should set the schema", () => {
        expect(this.store.get("schema")).to.deep.eq({
            "example": {
                "name": "description"
            }
        });
    });
});