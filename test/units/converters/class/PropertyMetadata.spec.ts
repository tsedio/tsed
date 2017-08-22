import {PropertyMetadata} from "../../../../src/converters/class/PropertyMetadata";
import {Store} from "../../../../src/core/class/Store";
import {expect} from "../../../tools";

class Test {
    method(arg1: any, arg2: any) {
    }
}

class TestFilter {
}

describe("PropertyMetadata", () => {

    before(() => {
        this.propertyMetadata = new PropertyMetadata(Test, "test");
        this.propertyMetadata.required = true;
        this.propertyMetadata.type = Test;
    });

    after(() => delete this.propertyMetadata);

    it("should return the required value", () =>
        expect(this.propertyMetadata.required).to.be.a("boolean").and.to.eq(true)
    );

    it("should return collectionType", () =>
        expect(this.propertyMetadata.collectionType).to.eq(undefined)
    );

    it("should return type", () =>
        expect(this.propertyMetadata.type).to.eq(Test)
    );

    it("should return collectionName", () =>
        expect(this.propertyMetadata.collectionName).to.eq("")
    );

    it("should return typeName", () =>
        expect(this.propertyMetadata.typeName).to.eq("Test")
    );

    it("should return isCollection", () => {
        expect(this.propertyMetadata.isCollection).to.eq(false);
    });

    it("should return a Store", () => {
        expect(this.propertyMetadata.store).to.be.an.instanceOf(Store);
    });
});