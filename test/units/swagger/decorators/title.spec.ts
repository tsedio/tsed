import {Store} from "../../../../src/core/class/Store";
import {Title} from "../../../../src/swagger/decorators/title";
import {expect} from "../../../tools";
import {descriptorOf} from "../../../../src/core/utils";


class Test {
    test() {

    }
}

describe("Title()", () => {
    describe("when title is used as property decorator", () => {
        before(() => {
            Title("title")(Test, "test");
            this.store = Store.from(Test, "test");
        });
        it("should set the schema", () => {
            expect(this.store.get("schema")).to.deep.eq({title: "title"});
        });
    });
    describe("when title is used as parameters decorator", () => {
        before(() => {
            Title("title")(Test, "test", 0);
            this.store = Store.from(Test, "test", 0);
        });
        it("should set the schema", () => {
            expect(this.store.get("baseParameter")).to.deep.eq({title: "title"});
        });
    });
});