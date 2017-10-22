import {PropertyMetadata} from "../../../../src/jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {expect} from "../../../tools";

class Test {
}

class Parent {
    id: string;
    name: string;
}

class Children extends Parent {
    id: string;
    test: string;
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
            PropertyRegistry.required(Test, "test", [null, ""]);
            this.propertyMetadata = PropertyRegistry.get(Test, "test");
        });

        it("should return the propertyMetadata", () => {
            expect(this.propertyMetadata).to.be.an.instanceof(PropertyMetadata);
        });
        it("should be required", () => {
            expect(this.propertyMetadata.required).to.eq(true);
        });
        it("should be allowedValues", () => {
            expect(this.propertyMetadata.allowedValues).to.deep.eq([null, ""]);
        });
    });

    describe("getProperties", () => {
        before(() => {
            PropertyRegistry.get(Children, "id");
            PropertyRegistry.get(Children, "test");
            PropertyRegistry.get(Parent, "id");
            PropertyRegistry.get(Parent, "name");
        });

        describe("when is the Parent class", () => {
            before(() => {
                this.result = PropertyRegistry.getProperties(Children);
            });
            it("should have a property id metadata from Children class", () => {
                expect(this.result.get("id").targetName).to.eq("Children");
            });

            it("should have a property name metadata from Parent class", () => {
                expect(this.result.get("name").targetName).to.eq("Parent");
            });

            it("should have a property name metadata from Parent class", () => {
                expect(this.result.get("test").targetName).to.eq("Children");
            });
        });

        describe("when is the Parent class", () => {
            before(() => {
                this.result = PropertyRegistry.getProperties(Parent);
            });
            it("should have a property name metadata from Parent class", () => {
                return expect(this.result.has("test")).to.be.false;
            });

            it("should have a property id metadata from Children class", () => {
                expect(this.result.get("id").targetName).to.eq("Parent");
            });

            it("should have a property name metadata from Parent class", () => {
                expect(this.result.get("name").targetName).to.eq("Parent");
            });
        });

    });
});