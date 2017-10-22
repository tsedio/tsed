import {expect} from "chai";
import {Readonly, Writable} from "../../../../src/core/decorators";
import {descriptorOf} from "../../../../src/core/utils";

class Test {
}

describe("Writable", () => {
    it("should set attribut as writable", () => {
        Writable()(Test, "test");
        expect(descriptorOf(Test, "test").writable).to.eq(true);
    });
    it("should set attribut as readonly", () => {
        Readonly()(Test, "test");
        expect(descriptorOf(Test, "test").writable).to.eq(false);
    });
});