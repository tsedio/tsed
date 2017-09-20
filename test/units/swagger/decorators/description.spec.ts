import {Store} from "../../../../src/core/class/Store";
import {decoratorArgs} from "../../../../src/core/utils";
import {Description} from "../../../../src/swagger/decorators/description";
import {expect} from "../../../tools";


class Test {
    test(a: any) {

    }
}

describe("Description()", () => {

    describe("on method", () => {
        before(() => {
            let args = decoratorArgs(Test, "test");
            Description("description")(...args);
            this.store = Store.from(...args);
        });
        it("should set the operation", () => {
            expect(this.store.get("operation")).to.deep.eq({description: "description"});
        });
    });

    describe("on param", () => {
        before(() => {
            let args = [Test, "test", 0];
            Description("description")(...args);
            this.store = Store.from(...args);
        });
        it("should set the baseParameter", () => {
            expect(this.store.get("baseParameter")).to.deep.eq({description: "description"});
        });
    });

    describe("on class", () => {
        before(() => {
            let args = [Test];
            Description("description")(...args);
            this.store = Store.from(...args);
        });
        it("should set the tag", () => {
            expect(this.store.get("description")).to.deep.eq("description");
        });
    });
});
