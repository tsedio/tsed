import {PropertyRegistry} from "../../../../src/converters/registries/PropertyRegistry";
import {expect} from "../../../tools";
import {PropertyMetadata} from "../../../../src/converters/class/PropertyMetadata";

class Test {
}

describe("PropertyRegistry", () => {
    describe("get()", () => {
        before(() => {
            this.propertyMetadata = PropertyRegistry.get(Test, "test");
        });

        it("should return the propertyMetadata", () => {
            expect(this.propertyMetadata).to.be.an.instanceof(PropertyMetadata);
        });
    });

    describe("required()", () => {
        before(() => {
            PropertyRegistry.required(Test, "test");
            this.propertyMetadata = PropertyRegistry.get(Test, "test");
        });

        it("should return the propertyMetadata", () => {
            expect(this.propertyMetadata).to.be.an.instanceof(PropertyMetadata);
        });
        it("should be required", () => {
            expect(this.propertyMetadata.required).to.eq(true);
        });
    });
});