import {Store} from "../../../../src/core/class/Store";
import {Title} from "../../../../src/swagger/decorators/title";
import {expect} from "../../../tools";


class Test {
    test() {

    }
}

describe("Title()", () => {
    before(() => {
        Title("title")(Test, "test");
        this.store = Store.from(Test, "test");
    });
    it("should set the schema", () => {
        expect(this.store.get("schema")).to.deep.eq({title: "title"});
    });
});