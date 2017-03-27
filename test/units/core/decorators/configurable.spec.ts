import {assert, expect} from "chai";
import {Configurable, NotConfigurable} from "../../../../src/core/decorators/configurable";

class Test {
}
describe("Configurable", () => {
    it("should set attribut as configurable", () => {
        expect(Configurable()(Test, "test", {configurable: false}).configurable).to.eq(true);
    });
    it("should set attribut as configurable", () => {
        expect(Configurable(true)(Test, "test", {configurable: false}).configurable).to.eq(true);
    });
    it("should set attribut as not configurable", () => {
        expect(NotConfigurable()(Test, "test", {configurable: true}).configurable).to.eq(false);
    });
    it("should set attribut as configurable", () => {
        expect(Configurable()(Test, "test", undefined).configurable).to.eq(true);
    });
});