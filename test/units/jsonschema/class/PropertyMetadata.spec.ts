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
            this.propertyMetadata.allowedRequiredValues = [null, ""];
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

        it("should return allowedRequiredValues", () => {
            expect(this.propertyMetadata.allowedRequiredValues).to.deep.eq([null, ""]);
        });

        it("should return a Store", () => {
            expect(this.propertyMetadata.store).to.be.an.instanceOf(Store);
        });

        it("should return schema", () => {
            expect(this.propertyMetadata.schema).to.deep.eq({"$ref": "#/definitions/Test"});
        });
    });

    describe("isValidRequiredValue", () => {
        describe("when property is required", () => {
            before(() => {
                this.propertyMetadata = new PropertyMetadata(Test, "test");
                this.propertyMetadata.allowedRequiredValues = [];
                this.propertyMetadata.required = true;
            });
            it("should return true (value 0)", () => {
                return expect(this.propertyMetadata.isValidRequiredValue(0)).to.be.true;
            });

            it("should return false (value '')", () => {
                return expect(this.propertyMetadata.isValidRequiredValue("")).to.be.false;
            });
            it("should return false (value null)", () => {
                return expect(this.propertyMetadata.isValidRequiredValue(null)).to.be.false;
            });
            it("should return false (value undefined)", () => {
                return expect(this.propertyMetadata.isValidRequiredValue(undefined)).to.be.false;
            });
        });

        describe("when property is required and have allowed values", () => {
            before(() => {
                this.propertyMetadata = new PropertyMetadata(Test, "test");
                this.propertyMetadata.allowedRequiredValues = [null];
                this.propertyMetadata.required = true;
            });
            it("should return true (value 0)", () => {
                return expect(this.propertyMetadata.isValidRequiredValue(0)).to.be.true;
            });

            it("should return false (value '')", () => {
                return expect(this.propertyMetadata.isValidRequiredValue("")).to.be.false;
            });
            it("should return true (value null)", () => {
                return expect(this.propertyMetadata.isValidRequiredValue(null)).to.be.true;
            });
            it("should return false (value undefined)", () => {
                return expect(this.propertyMetadata.isValidRequiredValue(undefined)).to.be.false;
            });
        });

        describe("when property is not required", () => {
            before(() => {
                this.propertyMetadata = new PropertyMetadata(Test, "test");
                this.propertyMetadata.allowedRequiredValues = [];
                this.propertyMetadata.required = false;
            });
            it("should return true (value 0)", () => {
                return expect(this.propertyMetadata.isValidRequiredValue(0)).to.be.true;
            });

            it("should return true (value '')", () => {
                return expect(this.propertyMetadata.isValidRequiredValue("")).to.be.true;
            });
            it("should return true (value null)", () => {
                return expect(this.propertyMetadata.isValidRequiredValue(null)).to.be.true;
            });
            it("should return true (value undefined)", () => {
                return expect(this.propertyMetadata.isValidRequiredValue(undefined)).to.be.true;
            });
        });
    });
});