import {expect} from "chai";
import {NotEnumerable} from "../../../../src/core/decorators";
import {Enumerable} from "../../../../src/core/decorators/enumerable";

class Test {
}
describe("Enumerable", () => {
    it("should set attribut as enumerable", () => {
        expect(Enumerable()(Test, "test", {enumerable: false}).enumerable).to.eq(true);
    });
    it("should set attribut as enumerable", () => {
        expect(Enumerable(true)(Test, "test", {enumerable: false}).enumerable).to.eq(true);
    });
    it("should set attribut as not enumerable", () => {
        expect(NotEnumerable()(Test, "test", {enumerable: true}).enumerable).to.eq(false);
    });
    it("should set attribut as enumerable", () => {
        expect(Enumerable()(Test, "test", undefined).enumerable).to.eq(true);
    });
});