import {Store} from "../../../../src/core/class/Store";
import {decoratorArgs} from "../../../../src/core/utils";
import {ControllerRegistry} from "../../../../src/common/mvc/registries/ControllerRegistry";
import {Name} from "../../../../src/swagger/decorators/name";
import {expect} from "../../../tools";

class Test {
    test(a: any) {

    }
}

describe("Name()", () => {
    describe("on param", () => {
        before(() => {
            const args = [Test, "test", 0];
            Name("name")(...args);
            this.store = Store.from(...args);
        });
        it("should set the baseParameter", () => {
            expect(this.store.get("baseParameter")).to.deep.eq({name: "name"});
        });
    });

    describe("on method", () => {
        it("should throw an error", () => {
            const args = decoratorArgs(Test, "test");
            const fn = Name("name");
            expect(() => fn(...args)).to.throw();

        });
    });

    describe("on ctrl", () => {
        before(() => {
            ControllerRegistry.createIfNotExists(Test);
            const args = [Test];
            Name("name")(...args);
            this.store = Store.from(...args);
        });
        it("should set the name", () => {
            expect(this.store.get("name")).to.deep.eq("name");
        });
    });
});
