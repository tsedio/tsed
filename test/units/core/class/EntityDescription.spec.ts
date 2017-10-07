import {EntityDescription} from "../../../../src/core/class/EntityDescription";
import {expect} from "../../../tools";

class Test {
    method(arg1: any, arg2: any) {
    }
}

class EntityTest extends EntityDescription {
}

describe("EntityDescription", () => {

    describe("getter / setter", () => {
        before(() => {
            this.entityDescription = new EntityTest(Test, "test", 0);
            this.entityDescription.required = true;
            this.entityDescription.type = Test;
            this.entityDescription.allowedValues = [null, ""];
        });

        after(() => delete this.entityDescription);

        it("should return the required value", () =>
            expect(this.entityDescription.required).to.be.a("boolean").and.to.eq(true)
        );

        it("should return collectionType", () =>
            expect(this.entityDescription.collectionType).to.eq(undefined)
        );

        it("should return type", () =>
            expect(this.entityDescription.type).to.eq(Test)
        );

        it("should return collectionName", () =>
            expect(this.entityDescription.collectionName).to.eq("")
        );

        it("should return typeName", () =>
            expect(this.entityDescription.typeName).to.eq("Test")
        );

        it("should return isCollection", () => {
            expect(this.entityDescription.isCollection).to.eq(false);
        });

        it("should return allowedValues", () => {
            expect(this.entityDescription.allowedValues).to.deep.eq([null, ""]);
        });
    });


    describe("isValidValue", () => {
        describe("when property is required", () => {
            before(() => {
                this.entityDescription = new EntityTest(Test, "test");
                this.entityDescription.allowedValues = [];
                this.entityDescription.required = true;
            });
            it("should return false (value 0)", () => {
                return expect(this.entityDescription.isValidValue(0)).to.be.true;
            });

            it("should return true (value '')", () => {
                return expect(this.entityDescription.isValidValue("")).to.be.false;
            });
            it("should return true (value null)", () => {
                return expect(this.entityDescription.isValidValue(null)).to.be.false;
            });
            it("should return true (value undefined)", () => {
                return expect(this.entityDescription.isValidValue(undefined)).to.be.false;
            });
        });

        describe("when property is required and have allowed values", () => {
            before(() => {
                this.entityDescription = new EntityTest(Test, "test");
                this.entityDescription.allowedValues = [null];
                this.entityDescription.required = true;
            });
            it("should return false (value 0)", () => {
                return expect(this.entityDescription.isValidValue(0)).to.be.true;
            });

            it("should return true (value '')", () => {
                return expect(this.entityDescription.isValidValue("")).to.be.false;
            });
            it("should return true (value null)", () => {
                return expect(this.entityDescription.isValidValue(null)).to.be.true;
            });
            it("should return true (value undefined)", () => {
                return expect(this.entityDescription.isValidValue(undefined)).to.be.false;
            });
        });

        describe("when property is not required", () => {
            before(() => {
                this.entityDescription = new EntityTest(Test, "test");
                this.entityDescription.allowedValues = [];
                this.entityDescription.required = false;
            });
            it("should return false (value 0)", () => {
                return expect(this.entityDescription.isValidValue(0)).to.be.true;
            });

            it("should return true (value '')", () => {
                return expect(this.entityDescription.isValidValue("")).to.be.true;
            });
            it("should return true (value null)", () => {
                return expect(this.entityDescription.isValidValue(null)).to.be.true;
            });
            it("should return true (value undefined)", () => {
                return expect(this.entityDescription.isValidValue(undefined)).to.be.true;
            });
        });
    });
});