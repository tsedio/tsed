import {Store} from "../../../../src/core/class/Store";
import { Example, ExampleAnyType } from '../../../../src/swagger/decorators/example';
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

describe("ExampleAnyType()", () => {
    describe("string type", () => {
        before(() => {
            ExampleAnyType("stringTest")(Test, "test1");
            this.store = Store.from(Test, "test1");
        });
        it("should set the schema", () => {
            expect(this.store.get("schema")).to.deep.eq({
                "example": "stringTest"
            });
        });
    });

    describe("array type", () => {
        before(() => {
            ExampleAnyType(["s1", "s2"])(Test, "test2");
            this.store = Store.from(Test, "test2");
        });
        it("should set the schema", () => {
            expect(this.store.get("schema")).to.deep.eq({
                "example": ["s1", "s2"]
            });
        });
    });

    describe("object type", () => {
        before(() => {
            ExampleAnyType({"k1": { "k2": "vaue" }})(Test, "test3");
            this.store = Store.from(Test, "test3");
        });
        it("should set the schema", () => {
            expect(this.store.get("schema")).to.deep.eq({
                "example": {"k1": { "k2": "vaue" }}
            });
        });
    });
});