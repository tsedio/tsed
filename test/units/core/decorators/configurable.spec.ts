import {expect} from "chai";
import {NotConfigurable} from "../../../../src/core/decorators";
import {Configurable} from "../../../../src/core/decorators/configurable";
import {descriptorOf} from "../../../../src/core/utils";

class Test {
    test: string;
}

describe("Configurable", () => {
    it("should set attribut as configurable", () => {
        Configurable()(Test, "test");
        expect(descriptorOf(Test, "test").configurable).to.eq(true);
    });

    it("should set attribut as not configurable", () => {
        NotConfigurable()(Test, "test");
        expect(descriptorOf(Test, "test").configurable).to.eq(false);
    });
});