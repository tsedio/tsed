import {expect} from "chai";
import {NotEnumerable} from "../../../../src/core/decorators";
import {Enumerable} from "../../../../src/core/decorators/enumerable";
import {descriptorOf} from "../../../../src/core/utils";

class Test {
    test: string;
}

describe("Enumerable", () => {
    it("should set attribut as enumerable", () => {
        Enumerable()(Test, "test");
        expect(descriptorOf(Test, "test").enumerable).to.eq(true);
    });
    it("should set attribut as not enumerable", () => {
        NotEnumerable()(Test, "test");
        expect(descriptorOf(Test, "test").enumerable).to.eq(false);
    });
});