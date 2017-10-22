import {Store} from "../../../../src/core/class/Store";
import {PropertyMetadata} from "../../../../src/jsonschema/class/PropertyMetadata";
import {expect} from "../../../tools";

class Test {
    method(arg1: any, arg2: any) {
    }
}

class TestFilter {
}

describe("PropertyMetadata", () => {
    describe("getter / setter", () => {
        before(() => {
            this.propertyMetadata = new PropertyMetadata(Test, "test");
            this.propertyMetadata.required = true;
            this.propertyMetadata.type = Test;
            this.propertyMetadata.allowedValues = [null, ""];
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

        it("should return allowedValues", () => {
            expect(this.propertyMetadata.allowedValues).to.deep.eq([null, ""]);
        });

        it("should return a Store", () => {
            expect(this.propertyMetadata.store).to.be.an.instanceOf(Store);
        });

        it("should return schema", () => {
            expect(this.propertyMetadata.schema).to.deep.eq({
                "type": "object"
            });
        });
    });

    describe("isValidValue", () => {
        describe("when property is required", () => {
            before(() => {
                this.propertyMetadata = new PropertyMetadata(Test, "test");
                this.propertyMetadata.allowedValues = [];
                this.propertyMetadata.required = true;
            });
            it("should return false (value 0)", () => {
                return expect(this.propertyMetadata.isValidValue(0)).to.be.true;
            });

            it("should return true (value '')", () => {
                return expect(this.propertyMetadata.isValidValue("")).to.be.false;
            });
            it("should return true (value null)", () => {
                return expect(this.propertyMetadata.isValidValue(null)).to.be.false;
            });
            it("should return true (value undefined)", () => {
                return expect(this.propertyMetadata.isValidValue(undefined)).to.be.false;
            });
        });

        describe("when property is required and have allowed values", () => {
            before(() => {
                this.propertyMetadata = new PropertyMetadata(Test, "test");
                this.propertyMetadata.allowedValues = [null];
                this.propertyMetadata.required = true;
            });
            it("should return false (value 0)", () => {
                return expect(this.propertyMetadata.isValidValue(0)).to.be.true;
            });

            it("should return true (value '')", () => {
                return expect(this.propertyMetadata.isValidValue("")).to.be.false;
            });
            it("should return true (value null)", () => {
                return expect(this.propertyMetadata.isValidValue(null)).to.be.true;
            });
            it("should return true (value undefined)", () => {
                return expect(this.propertyMetadata.isValidValue(undefined)).to.be.false;
            });
        });

        describe("when property is not required", () => {
            before(() => {
                this.propertyMetadata = new PropertyMetadata(Test, "test");
                this.propertyMetadata.allowedValues = [];
                this.propertyMetadata.required = false;
            });
            it("should return false (value 0)", () => {
                return expect(this.propertyMetadata.isValidValue(0)).to.be.true;
            });

            it("should return true (value '')", () => {
                return expect(this.propertyMetadata.isValidValue("")).to.be.true;
            });
            it("should return true (value null)", () => {
                return expect(this.propertyMetadata.isValidValue(null)).to.be.true;
            });
            it("should return true (value undefined)", () => {
                return expect(this.propertyMetadata.isValidValue(undefined)).to.be.true;
            });
        });
    });
});