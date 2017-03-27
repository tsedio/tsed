import {assert, expect} from "chai";
import {Readonly, Writable} from "../../../../src/core/decorators/writable";

class Test {
}
describe("Writable", () => {
    it("should set attribut as writable", () => {
        expect(Writable()(Test, "test", {writable: false}).writable).to.eq(true);
    });
    it("should set attribut as writable", () => {
        expect(Writable(true)(Test, "test", {writable: false}).writable).to.eq(true);
    });
    it("should set attribut as readonly", () => {
        expect(Readonly()(Test, "test", {writable: true}).writable).to.eq(false);
    });
    it("should set attribut as writable", () => {
        expect(Writable()(Test, "test", undefined).writable).to.eq(true);
    });
});